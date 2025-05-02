import { Field, Entry, entrySchema, fieldSchema } from "./types";
import { parse } from "date-fns";

import { locations } from "../locations";
import { database } from "../database/database";
import {
  bikeWeekEventSchema,
  BikeWeekEvent,
  EventLocation,
  eventLocationSchema,
  EventSponsor,
  EventTime,
  eventStatusSchema,
  eventTimeSchema,
} from "../routes/contract";
import { logger } from "../utils";

/** this list is NOT exhaustive, just used for conditional behaviors in the backend */
export const EventTypes = {
  DISCOUNT: "discount",
  ENDOFWEEKPARTY: "endofweekparty",
  PAID: "paid",
  FREE: "free",
} as const;

const GF_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

/** take data from mongo GF dump and load into structured event info */
class Processor {
  async extractEvents(): Promise<BikeWeekEvent[]> {
    const fields = fieldSchema
      .array()
      .parse(await database.gfFormFields.find().toArray());

    const responses = entrySchema
      .array()
      .parse(await database.gfResponses.find().toArray());

    const eventHelper = new EventHelper(fields);

    const retval = Array<BikeWeekEvent>();
    for (const entry of responses) {
      const sponsors = eventHelper.getSponsorInfo(entry);
      const status = eventStatusSchema
        .optional()
        .default(eventStatusSchema.Enum.submitted)
        .parse(eventHelper.lookupFieldValue(entry, "status"));
      const createDate = parse(entry.date_created, GF_DATE_FORMAT, new Date());
      const modifyDate = parse(entry.date_updated, GF_DATE_FORMAT, new Date());

      const newEntry = bikeWeekEventSchema.parse({
        id: entry.id,
        name: eventHelper.requireFieldValue(entry, "event_name"),
        eventUrl: eventHelper.lookupFieldValue(entry, "event_url"),
        description: eventHelper.requireFieldValue(entry, "event_description"),
        sponsors,
        location: eventHelper.getLocationInfo(entry),
        eventTypes: eventHelper.getEventTypes(entry),
        eventDays: eventHelper.getEventDays(entry),
        eventTimes: eventTimeSchema
          .array()
          .parse(eventHelper.getEventTimes(entry)),
        eventGraphicUrl: eventHelper.lookupFieldValue(entry, "event_graphic"),
        modifyDate,
        createDate,
        status,
        comments: eventHelper.lookupFieldValue(entry, "comments"),
      });
      // promote non-PAID and non-DISCOUNT items to FREE
      if (
        !newEntry.eventTypes.includes(EventTypes.PAID) &&
        !newEntry.eventTypes.includes(EventTypes.DISCOUNT) &&
        !newEntry.eventTypes.includes(EventTypes.FREE)
      ) {
        newEntry.eventTypes.push(EventTypes.FREE);
      }
      retval.push(newEntry);
    }
    return retval;
  }
}
export const processor = new Processor();

class EventHelper {
  constructor(private fields: Field[]) {}

  getLocationInfo(entry: Entry): EventLocation | undefined {
    const firstChoice = this.lookupFieldValue(entry, "location_first");
    let mapped = locations.find((value) => value.name === firstChoice);
    if (
      !mapped &&
      firstChoice !== "N/A" &&
      firstChoice !== "None" &&
      firstChoice !== ""
    ) {
      logger.error(`Missing location map for location name: ${firstChoice}`);
    }
    if (mapped) {
      mapped = { ...mapped };
    } else {
      mapped = { name: "" };
    }
    mapped.detailed_location_description = this.lookupFieldValue(
      entry,
      "location_other",
    );
    return eventLocationSchema.parse(mapped);
  }

  getEventDays(entry: Entry): Date[] {
    const eventDays = this.requireMultiFieldValue(entry, "event_days");
    const retval = new Array<Date>();
    for (const day of eventDays) {
      const parsedDate = parse(day, "MM-dd-yyyy", new Date());
      if (Number.isNaN(parsedDate.getTime())) {
        throw Error(`Invalid date encountered ${day}`);
      }
      retval.push(parsedDate);
    }
    return retval;
  }

  getEventTypes(entry: Entry): string[] {
    return this.requireMultiFieldValue(entry, "event_type");
  }

  getEventTimes(entry: Entry): EventTime[] {
    const eventStart = this.lookupFieldValue(entry, "event_start") ?? "";
    const eventEnd = this.lookupFieldValue(entry, "event_end") ?? "";
    if (!eventEnd || !eventStart) {
      if (eventEnd || eventStart) {
        logger.warn(
          "Event has a mismatched start/end time. Event will be assumed to all-day.",
        );
      }
      return [];
    } else {
      return [{ start: eventStart, end: eventEnd }];
    }
  }

  /** return parsed sponsor info from format like this "Madison Bikes (https://www.madisonbikes.org);City of Madison" */
  getSponsorInfo(entry: Entry): EventSponsor[] {
    const baseSponsorText = this.requireFieldValue(entry, "sponsors");
    let separator = ",";
    if (baseSponsorText.includes(";")) {
      separator = ";";
    }
    const sponsors = baseSponsorText.split(separator).map((v) => v.trim());
    const retval = sponsors.map((sponsor) => {
      const res = /(.*)\((.+)\)/.exec(sponsor);
      if (!res) {
        return { name: sponsor, url: "" };
      } else {
        return { name: res[1].trim(), url: res[2].trim() };
      }
    });
    return retval;
  }

  requireFieldValue(entry: Entry, adminLabel: string): string {
    const fieldValue = this.lookupFieldValue(entry, adminLabel);
    if (fieldValue == null) {
      throw new Error(`No entry for admin label ${adminLabel}`);
    }
    return fieldValue;
  }

  requireMultiFieldValue(entry: Entry, adminLabel: string): string[] {
    const fieldValue = this.lookupMultiFieldValue(entry, adminLabel);
    if (fieldValue == null) {
      throw new Error(`No entry for admin label ${adminLabel}`);
    }
    return fieldValue;
  }

  lookupMultiFieldValue(
    entry: Entry,
    adminLabel: string,
  ): string[] | undefined {
    const fieldId = this.lookupFieldId(adminLabel);
    if (fieldId === undefined) return undefined;

    const rawInputs = this.fields.find((value) => value.id === fieldId)?.inputs;
    if (rawInputs == null) {
      return undefined;
    }
    if (typeof rawInputs === "string") {
      if (rawInputs !== "") {
        logger.warn("ignoring non-empty string input value");
      }
      return undefined;
    }
    const inputIds = rawInputs.map((input) => input.id);

    const retval: string[] = [];
    for (const i of inputIds) {
      const value = entry[i];
      if (typeof value === "string") {
        if (value && value.length > 0) {
          retval.push(value);
        }
      } else {
        logger.warn(
          {
            entry,
            value,
          },
          `Unexpected non-string value in field ${adminLabel}`,
        );
      }
    }
    return retval;
  }

  lookupFieldValue(entry: Entry, adminLabel: string): string | undefined {
    const fieldId = this.lookupFieldId(adminLabel);
    if (fieldId === undefined) return undefined;

    const value = entry[`${fieldId}`];
    if (typeof value !== "string") {
      logger.warn(
        { entry, value },
        `Unexpected non-string value in field ${adminLabel}`,
      );
      return undefined;
    }
    return value;
  }

  requireFieldId(adminLabel: string): number {
    const fieldId = this.lookupFieldId(adminLabel);
    if (fieldId === undefined) {
      throw new Error(`No field for admin label ${adminLabel}`);
    }
    return fieldId;
  }

  lookupFieldId(adminLabel: string): number | undefined {
    return this.fields.find((value) => value.adminLabel === adminLabel)?.id;
  }
}

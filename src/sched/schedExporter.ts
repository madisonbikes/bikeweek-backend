import { injectable } from "tsyringe";
import { format, parseISO } from "date-fns";
import { isAllDayEvent, isEndOfWeekParty } from "../database/events";
import { SchedApi } from "./api";
import { buildMapsUrl } from "../locations";
import { EventTypes } from "../gravityforms/processor";
import { BikeWeekEvent, EventStatusSchema } from "../api/event";

@injectable()
export class SchedExporter {
  constructor(private sched: SchedApi) {}

  async start(updatedEvents: BikeWeekEvent[]): Promise<void> {
    // get complete session list so we can build a complete key list
    const sessionsResponse = await this.sched.exportSessions();
    if (sessionsResponse.isError()) {
      throw new Error(sessionsResponse.value);
    }

    const sessionList = sessionsResponse.value;

    const relevantExistingKeys = sessionList
      .map((item) => {
        return item.event_key;
      })
      // filter out event entries not tied to the supplied events
      .filter((key) => {
        return (
          updatedEvents.find((event) => {
            return key.startsWith(`${event.id}.`);
          }) !== undefined
        );
      });

    const handledKeys = new Set<string>();
    const events = [...updatedEvents]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((event) => {
        if (isEndOfWeekParty(event)) {
          console.log(`Skipping ${event.name} (end of week party tabling)`);
          return false;
        }
        if (isAllDayEvent(event)) {
          console.log(`Skipping ${event.name} (all day, no time)`);
          return false;
        }
        if (event.eventDays.length === 0) {
          console.log(`Skipping ${event.name} (no days)`);
          return false;
        }
        if (
          event.status !== EventStatusSchema.Enum.approved &&
          event.status !== EventStatusSchema.Enum.cancelled
        ) {
          console.log(`Skipping ${event.name} (unapproved)`);
          return false;
        }
        return true;
      });

    for (const event of events) {
      for (const isoDay of event.eventDays) {
        const dayAsDate = parseISO(isoDay);
        for (const timeNdx in event.eventTimes) {
          const time = event.eventTimes[timeNdx];
          const dayOfYear = format(dayAsDate, "DDD");
          const session_key = `${event.id}.${dayOfYear}.${timeNdx}`;
          const description = this.buildDescription(event);

          const timeBase = isoDay;
          const session_start = `${timeBase} ${time.start}`;
          const session_end = `${timeBase} ${time.end}`;
          const session_type = sortEventTypes(event.eventTypes)
            .filter((value) => value !== EventTypes.ENDOFWEEKPARTY)
            .join(",");
          const base = {
            session_key,
            name:
              event.status !== EventStatusSchema.enum.cancelled
                ? event.name
                : `CANCELLED - ${event.name}`,
            description,
            // format: YYYY-MM-DD HH:MM
            session_start,
            session_end,
            session_type,
            venue: event.location?.sched_venue ?? event.location?.name ?? "",
            address: event.location?.sched_address ?? "",
            active:
              event.status === EventStatusSchema.enum.approved ? "Y" : "N",
            rsvp_url: event.location ? buildMapsUrl(event.location) : "",
            media_url: event.eventGraphicUrl,
          };
          let result;
          let action;
          if (relevantExistingKeys.indexOf(session_key) !== -1) {
            result = await this.sched.modifySession(base);
            action = "modified";
          } else {
            result = await this.sched.addSession(base);
            action = "added";
          }
          if (result.isError()) {
            console.log(`${session_key} ${action} error: ${result.value}`);
          } else {
            console.log(
              `${session_key} ${action} ok(${result.value}) status: ${event.status}`
            );
          }
          handledKeys.add(session_key);
        }
      }
    }

    const unpublishCandidates = new Set<string>(relevantExistingKeys);

    // remove handledKeys from the key list
    for (const key of handledKeys) {
      unpublishCandidates.delete(key);
    }

    // remaining keys should be unpublished
    for (const key of unpublishCandidates) {
      const result = await this.sched.deleteSession({
        session_key: key.toString(),
      });
      if (result.isError()) {
        console.log(`delete $key error: ${result.value}`);
      }
    }
  }

  buildDescription(event: BikeWeekEvent): string {
    let description = "";
    const sponsor = this.buildSponsor(event);
    if (sponsor) {
      description += `<strong>${sponsor}</strong><br>\n`;
    }

    let modified = event.description;

    // ditch any carriage returns, how archaic
    modified = modified.replace(/\r/g, "");

    // replace double breaks with a real HTML break
    modified = modified.replace(/\n\n/g, "<br>\n");

    description += modified;

    if (event.eventUrl?.trim() === "") {
      description += `\n<br><a href="${event.eventUrl}" target="_blank">Learn more about this event here!</a>`;
    }
    return description;
  }

  buildSponsor(event: BikeWeekEvent): string | undefined {
    let sponsorText = "";
    if (event.sponsors.length > 0) {
      sponsorText += "Hosted by ";
      event.sponsors.forEach((value, index) => {
        if (index > 0) {
          if (index === event.sponsors.length - 1) {
            sponsorText += " and ";
          } else {
            sponsorText += ", ";
          }
        }
        const url = value.url;
        if (url && url.length > 0) {
          sponsorText += `<a href="${url}" target="_blank">${value.name}</a>`;
        } else {
          sponsorText += value.name;
        }
      });
    }
    if (sponsorText.length > 0) {
      return sponsorText;
    } else {
      return undefined;
    }
  }
}

export const sortEventTypes = (types: string[]): string[] => {
  const retval = [...types];
  retval.sort((a, b) => {
    const a1 = eventTypeSortable(a);
    const b1 = eventTypeSortable(b);
    if (a1 === b1) return 0;
    return a1 > b1 ? 1 : -1;
  });
  return retval;
};

const eventTypeSortable = (type: string) => {
  if (type === "food") {
    return "aaaaafood";
  }
  if (type === "ride") {
    return "aaaaride";
  }
  return type;
};

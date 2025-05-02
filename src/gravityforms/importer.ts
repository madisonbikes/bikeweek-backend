import superagent from "superagent";

import { entryResponseSchema, Field, FormResponseSchema } from "./types";

import { configuration } from "../config";
import { database } from "../database/database";
import { logger } from "../utils";
import { locations } from "../locations";

/** pull data out of GF REST service and dump into mongo */
class Importer {
  async import(): Promise<void> {
    if (!this.isEnabled()) {
      logger.info("Gravity forms URI not provided, no form data importing");
      return;
    }

    const [formFields, responses] = await Promise.all([
      this.loadForms(),
      this.loadEntries(),
    ]);
    await database.gfFormFields.deleteMany({});
    if (formFields.fields.length > 0) {
      await database.gfFormFields.insertMany(formFields.fields);
    }
    this.runLocationLint(formFields.fields);

    await database.gfResponses.deleteMany({});
    if (responses.entries.length > 0) {
      await database.gfResponses.insertMany(responses.entries);
    }
  }

  isEnabled() {
    return configuration.gravityFormsUri;
  }

  private runLocationLint(fields: Field[]) {
    const location = fields.find((f) => f.adminLabel === "location_first");
    if (!location) {
      logger.warn("no location field found in form data");
      return;
    }
    const choices = location.choices;
    if (choices == null) {
      logger.warn("location choices are unexpectedly null");
      return;
    }
    if (!Array.isArray(choices)) {
      logger.warn("location choices are unexpectedly a string");
      return;
    }

    // look through our server location list and make sure they all exist in the form
    for (const localLocation of locations) {
      const found =
        choices.findIndex((c) => c.value === localLocation.name) !== -1;
      if (!found) {
        logger.warn(
          `Local location ${localLocation.name} not found in form choices`,
        );
      }
    }

    // look through form choices and make sure they all exist in our server location list
    for (const formChoice of choices) {
      const found =
        locations.findIndex((l) => l.name === formChoice.value) !== -1;
      if (!found && formChoice.text !== "") {
        logger.warn(
          `Form location choice ${formChoice.text} not found in local location list`,
        );
      }
    }
  }

  // FIXME support pagination for > 100 entries
  private async loadEntries() {
    const response = await superagent
      .get(`${configuration.gravityFormsUri}/entries`)
      .query({ form_ids: configuration.gravityFormsId })
      .query("paging[page_size]=100")
      .auth(
        configuration.gravityFormsConsumerApiKey,
        configuration.gravityFormsConsumerSecret,
      );
    const result = entryResponseSchema.safeParse(response.body);
    if (!result.success) {
      logger.error(
        { responses: response.text, error: result.error },
        "Error parsing form responses",
      );
      throw new Error("error parsing form responses");
    }
    return result.data;
  }

  private async loadForms() {
    const response = await superagent
      .get(
        `${configuration.gravityFormsUri}/forms/${configuration.gravityFormsId}`,
      )
      .auth(
        configuration.gravityFormsConsumerApiKey,
        configuration.gravityFormsConsumerSecret,
      );
    const result = FormResponseSchema.safeParse(response.body);
    if (!result.success) {
      logger.error(
        { forms: response.text, error: result.error },
        "Error parsing form definitions",
      );
      throw new Error("error parsing form definitions");
    }
    return result.data;
  }
}

export const importer = new Importer();

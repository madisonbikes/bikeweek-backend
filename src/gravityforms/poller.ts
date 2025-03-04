import { setIntervalAsync } from "set-interval-async/dynamic";
import { configuration } from "../config";
import { importer } from "./importer";
import { processor } from "./processor";
import { createHash } from "crypto";
import { eventModel } from "../database/events";
import { BikeWeekEvent } from "../routes/contract";
import { logger } from "../utils";

class RemoteEventPoller {
  async start() {
    await importer.import();

    // defaults to every hour
    logger.info(
      `Scheduling poll of form data for every ${
        configuration.pollInterval / 1000
      } seconds`,
    );
    await this.doImport();
    setIntervalAsync(() => this.doImport(), configuration.pollInterval);
  }

  /** perform the import if form data has been updated or if it's the first execution */
  private async doImport(): Promise<void> {
    logger.debug("running remote forms import");
    await importer.import();

    const importedEvents = await processor.extractEvents();
    let skipCount = 0,
      addCount = 0;
    for (const event of importedEvents) {
      const eventExists = (await eventModel.findEvent(event.id)) !== undefined;
      if (!eventExists) {
        addCount++;
        logger.debug(
          `Importing new event ${event.id}: "${event.name}" from remote forms`,
        );
        logger.trace({ event });
        await eventModel.addEvent(event);
      } else {
        skipCount++;
      }
    }
    logger.info(
      `Finished remote forms import, skipped ${skipCount} added ${addCount}`,
    );
  }

  private lastCount = -1;
  private lastHash = "";

  /** check if form data is updated by looking at event count + last modified hash */
  private isUpdated(events: BikeWeekEvent[]) {
    const hash = createHash("sha1");
    for (const e of events) {
      hash.update(e.modifyDate.toUTCString());
    }
    const calculatedHash = hash.digest("base64");
    const updated =
      calculatedHash !== this.lastHash || this.lastCount !== events.length;
    this.lastCount = events.length;
    this.lastHash = calculatedHash;
    return updated;
  }
}

export const poller = new RemoteEventPoller();

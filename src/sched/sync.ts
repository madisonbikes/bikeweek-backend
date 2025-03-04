import { eventModel } from "../database/events";
import { database } from "../database/database";
import { exportToSched } from "./schedExporter";
import exportDiscounts from "../discountExporter";
import { setTimeout, clearTimeout } from "timers";
import { configuration } from "../config";
import { logger } from "../utils";

/** handles sync to sched */

let cancelTimeout: NodeJS.Timeout | undefined;

function start(): Promise<void> {
  // launch initial trigger
  trigger();
  return Promise.resolve();
}

function trigger() {
  if (cancelTimeout) {
    clearTimeout(cancelTimeout);
  }

  cancelTimeout = setTimeout(() => {
    syncDoExport();
  }, 5000);
}

function triggerImmediate() {
  syncDoExport();
}

// bridge gap to async safely
function syncDoExport() {
  if (!configuration.schedUri || !configuration.schedApiKey) {
    logger.warn("Skipping sched sync without URI and/or API key");
    return;
  }
  Promise.resolve(doExport())
    .then(() => {
      logger.info("Successful sync to sched");
    })
    .catch((e: unknown) => {
      logger.error(e);
    });
}

async function doExport(): Promise<void> {
  const [status, allEvents] = await Promise.all([
    await database.getStatus(),
    await eventModel.events(),
  ]);

  // get list of events that need to be synced
  const filteredEvents = allEvents.filter((event) => {
    if (status.lastSchedSync === undefined) return true;
    return (
      event.createDate > status.lastSchedSync ||
      event.modifyDate > status.lastSchedSync
    );
  });

  await Promise.all([
    exportToSched(filteredEvents),
    exportDiscounts(allEvents),
  ]);

  await database.setStatus({ lastSchedSync: new Date() });
}

export default { start, trigger, triggerImmediate };

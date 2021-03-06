import { injectable, singleton } from "tsyringe";
import { EventModel } from "../database/events";
import { Database } from "../database/database";
import { SchedExporter } from "./schedExporter";
import { DiscountExporter } from "../discountExporter";
import { setTimeout, clearTimeout } from "timers";
import { Configuration } from "../config";

/** handles sync to sched */

@injectable()
@singleton()
export class EventSync {
  constructor(
    private database: Database,
    private schedExporter: SchedExporter,
    private discountExporter: DiscountExporter,
    private eventModel: EventModel,
    private configuration: Configuration
  ) {}

  private cancelTimeout: NodeJS.Timeout | undefined;

  async start(): Promise<void> {
    // launch initial trigger
    this.trigger();
  }

  trigger() {
    if (this.cancelTimeout) {
      clearTimeout(this.cancelTimeout);
    }

    this.cancelTimeout = setTimeout(() => this.syncDoExport(), 5000);
  }

  triggerImmediate() {
    this.syncDoExport();
  }

  // bridge gap to async safely
  private syncDoExport() {
    if (!this.configuration.schedUri || !this.configuration.schedApiKey) {
      console.log("Skipping sched sync without URI and/or API key");
      return;
    }
    Promise.resolve(this.doExport())
      .then(() => console.log("Successful sync to sched"))
      .catch((e) => console.log(e));
  }

  private async doExport(): Promise<void> {
    const [status, allEvents] = await Promise.all([
      await this.database.getStatus(),
      await this.eventModel.events(),
    ]);

    // get list of events that need to be synced
    const filteredEvents = allEvents.filter((event) => {
      if (!status.lastSchedSync) return true;
      return (
        event.createDate > status.lastSchedSync ||
        event.modifyDate > status.lastSchedSync
      );
    });

    await Promise.all([
      this.schedExporter.start(filteredEvents),
      this.discountExporter.start(allEvents),
    ]);

    await this.database.setStatus({ lastSchedSync: new Date() });
  }
}

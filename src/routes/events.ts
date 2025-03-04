import { mutateBikeWeekEventSchema } from "./contract";
import { eventModel } from "../database/events";
import eventSync from "../sched/sync";
import { validateAdmin } from "../security/validateAdmin";
import { logger } from "../utils";
import { validateBodySchema } from "../security/validateSchema";
import { StatusCodes } from "http-status-codes";
import { Hono } from "hono";

const routes = new Hono();
routes
  .get("/", validateAdmin(), async (c) => {
    const events = await eventModel.events();
    c.json(events);
  })
  .get("/:eventId", validateAdmin(), async (c) => {
    try {
      const id = parseInt(c.req.param("eventId"));
      const event = await eventModel.findEvent(id);
      if (!event) {
        c.body("not found", StatusCodes.NOT_FOUND);
      } else {
        c.json(event);
      }
    } catch (err) {
      logger.error(err);
      c.body("invalid request", StatusCodes.BAD_REQUEST);
    }
  })
  .put(
    "/:eventId",
    validateAdmin(),
    validateBodySchema({ schema: mutateBikeWeekEventSchema }),
    async (c) => {
      const eventData = c.req.valid("json");
      const id = parseInt(c.req.param("eventId"));
      const event = await eventModel.updateEvent(id, eventData);
      if (!event) {
        c.body("not found", StatusCodes.NOT_FOUND);
      } else {
        c.json(event);

        // trigger an export on any modification
        eventSync.trigger();
      }
    },
  )
  .delete("/:eventId", validateAdmin(), async (c) => {
    const id = parseInt(c.req.param("eventId"));
    const event = await eventModel.deleteEvent(id);
    if (!event) {
      c.body("not found", StatusCodes.NOT_FOUND);
    } else {
      c.body("ok");

      // trigger an export on any modification
      eventSync.trigger();
    }
  });

export default { routes };

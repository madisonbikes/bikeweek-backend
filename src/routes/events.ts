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
    return c.json(events);
  })
  .get("/:eventId", validateAdmin(), async (c) => {
    try {
      const id = parseInt(c.req.param("eventId"));
      const event = await eventModel.findEvent(id);
      if (!event) {
        return c.body("not found", StatusCodes.NOT_FOUND);
      } else {
        return c.json(event);
      }
    } catch (err) {
      logger.error(err);
      return c.body("invalid request", StatusCodes.BAD_REQUEST);
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
        return c.body("not found", StatusCodes.NOT_FOUND);
      } else {
        // trigger an export on any modification
        eventSync.trigger();
        return c.json(event);
      }
    },
  )
  .delete("/:eventId", validateAdmin(), async (c) => {
    const id = parseInt(c.req.param("eventId"));
    const event = await eventModel.deleteEvent(id);
    if (!event) {
      return c.body("not found", StatusCodes.NOT_FOUND);
    } else {
      // trigger an export on any modification
      eventSync.trigger();
      return c.body("ok");
    }
  });

export default { routes };

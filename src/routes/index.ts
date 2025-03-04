import events from "./events";
import users from "./users";
import session from "./session";
import info from "./info";
import { Hono } from "hono";

const app = new Hono();

app
  .route("/info", info.routes)
  .route("/session", session.routes)
  .route("/users", users.routes)
  .route("/events", events.routes);

export default app;

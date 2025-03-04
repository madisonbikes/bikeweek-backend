import { GetInfo } from "./contract";
import backendVersion from "../backend-version";
import { Hono } from "hono";

const routes = new Hono();
routes.get("/", (c) => {
  return c.json({ version: backendVersion } satisfies GetInfo);
});
export default { routes };

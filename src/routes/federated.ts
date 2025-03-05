import { validateBodySchema } from "../security";
import { federatedLoginBodySchema } from "./contract";
import { checkFederatedLogin, federationEnabled } from "../security/federated";
import { StatusCodes } from "http-status-codes";
import { AppHono } from "../app";
import { logger } from "../utils";

const routes = new AppHono();
routes.all("/*", async (c, next) => {
  if (!federationEnabled()) {
    logger.warn("federation not enabled");
    return c.body("not found", StatusCodes.NOT_FOUND);
  }
  logger.info("federation enabled");
  await next();
});
routes.post(
  "/login",
  validateBodySchema({ schema: federatedLoginBodySchema }),
  async (c) => {
    const login = c.req.valid("json");
    const auth = await checkFederatedLogin(login);
    if (!auth) {
      return c.body("unauthorized", StatusCodes.UNAUTHORIZED);
    } else {
      const session = c.get("session");
      session.set("user", auth);
      return c.json(auth);
    }
  },
);
export default { routes };

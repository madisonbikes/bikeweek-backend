import { validateBodySchema } from "../security";
import { federatedLoginBodySchema } from "./contract";
import { checkFederatedLogin, federationEnabled } from "../security/federated";
import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";

const routes = new Hono();

// only enable route if federation is enabled
if (federationEnabled()) {
  routes.post(
    "/federated/login",
    validateBodySchema({ schema: federatedLoginBodySchema }),
    async (c) => {
      const login = c.req.valid("json");
      const auth = await checkFederatedLogin(login);
      if (!auth) {
        c.status(StatusCodes.UNAUTHORIZED);
      } else {
        return c.json(auth);
      }
    },
  );
}

export default routes;

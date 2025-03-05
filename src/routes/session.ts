import { StatusCodes } from "http-status-codes";
import {
  validateBodySchema,
  validateAuthenticated,
  checkUsernamePassword,
} from "../security";
import { authenticatedUserSchema, loginBodySchema } from "./contract";
import federated from "./federated";
import { AppHono } from "../app";

const routes = new AppHono();

routes.route("/", federated.routes);

routes
  .post(
    "/login",
    validateBodySchema({ schema: loginBodySchema }),
    async (c) => {
      const session = c.get("session");
      const login = c.req.valid("json");
      if (!login.username || !login.password) {
        return c.body("missing username or password", StatusCodes.BAD_REQUEST);
      }
      const user = await checkUsernamePassword(login.username, login.password);
      if (user == null) {
        return c.body("unauthorized", StatusCodes.UNAUTHORIZED);
      }
      const parsed = authenticatedUserSchema.parse(user);
      session.set("user", parsed);
      return c.json(parsed);
    },
  )
  .post("/logout", (c) => {
    const user = c.get("checkUser");
    if (user == null) {
      return c.body("not logged in", StatusCodes.UNAUTHORIZED);
    } else {
      const session = c.get("session");
      session.deleteSession();
      return c.body("logged out");
    }
  })
  .get("/info", validateAuthenticated(), (c) => {
    const user = c.get("user");
    return c.json(authenticatedUserSchema.parse(user));
  });

export default { routes };

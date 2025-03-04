import { StatusCodes } from "http-status-codes";
import { Hono } from "hono";
import {
  validateBodySchema,
  validateAuthenticated,
  checkUsernamePassword,
} from "../security";
import { authenticatedUserSchema, loginBodySchema } from "./contract";
import federated from "./federated";

const routes = new Hono();
routes
  .route("/", federated)
  .post(
    "/login",
    validateBodySchema({ schema: loginBodySchema }),
    async (c) => {
      const login = c.req.valid("json");
      const user = await checkUsernamePassword(login.username, login.password);
      const parsed = authenticatedUserSchema.parse(user);
      c.set("user", parsed);
      return c.json(parsed);
    },
  )
  .post("/logout", (c) => {
    const user = c.get("checkUser");
    if (user == null) {
      return c.body("not logged in", StatusCodes.UNAUTHORIZED);
    } else {
      // TODO handle logout
      // request.logout((err) => {
      //   if (err !== undefined) {
      //     next(err);
      //     return;
      //   } else {
      //     response.send("logged out");
      //   }
      // });
      return c.body("logged out");
    }
  })
  .get("/info", validateAuthenticated(), (c) => {
    const user = c.get("user");
    return c.json(authenticatedUserSchema.parse(user));
  });

export default { routes };

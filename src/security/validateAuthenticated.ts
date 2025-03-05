import { StatusCodes } from "http-status-codes";
import { logger } from "../utils";
import { createMiddleware, Vars } from "../app";
import { AuthenticatedUser } from "../routes/contract";

type LocalVars = {
  user: AuthenticatedUser;
} & Vars;

export const validateAuthenticated = () =>
  createMiddleware<LocalVars>(async (c, next) => {
    const user = c.get("checkUser");
    logger.trace("validating authenticated: %o", user);

    if (user === undefined) {
      return c.body("requires authenticated", StatusCodes.UNAUTHORIZED);
    } else {
      await next();
    }
  });

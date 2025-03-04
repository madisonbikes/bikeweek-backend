import { StatusCodes } from "http-status-codes";
import { logger } from "../utils";
import { Roles, userHasRole } from "./authentication";
import { createMiddleware } from "hono/factory";

type ValidateOptions = {
  role: Roles;
};

export const validateRole = ({ role }: ValidateOptions) => {
  return createMiddleware(async (c, next) => {
    const user = c.get("checkUser");
    logger.trace(`validating role "%s" for user %o`, role, user);
    if (user === undefined || !userHasRole(user, role)) {
      c.body(`requires role "${role}"`, StatusCodes.FORBIDDEN);
    } else {
      await next();
    }
  });
};

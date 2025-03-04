import { StatusCodes } from "http-status-codes";
import { logger } from "../utils";
import { createMiddleware } from "hono/factory";
import { Env, Input } from "hono";

export const validateAuthenticated = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  E extends Env = any,
  P extends string = string,
  I extends Input = object,
>() =>
  createMiddleware<E, P, I>(async (c, next) => {
    const user = c.get("checkUser");
    logger.trace("validating authenticated: %o", user);

    if (user === undefined) {
      c.body("requires authenticated", StatusCodes.UNAUTHORIZED);
    } else {
      c.set("user", user);
      await next();
    }
  });

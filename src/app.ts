import { Hono, MiddlewareHandler } from "hono";
import { Session } from "hono-sessions";
import { createMiddleware as honoCreateMiddleware } from "hono/factory";
import { AuthenticatedUser } from "./routes/contract";

// Add types to your session data (optional)
type SessionDataTypes = {
  user: AuthenticatedUser;
};

export type Vars = {
  Variables: {
    session: Session<SessionDataTypes>;
    session_key_rotation: boolean;

    user: AuthenticatedUser;
    checkUser: AuthenticatedUser | undefined;
  };
};

class AppHono extends Hono<Vars> {}

const createMiddleware = <T extends Vars = Vars>(
  middleware: MiddlewareHandler<T>,
) => honoCreateMiddleware<T>(middleware);

export { AppHono, createMiddleware };

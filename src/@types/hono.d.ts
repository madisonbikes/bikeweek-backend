/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { AuthenticatedUser } from "../routes/contract";

declare module "hono" {
  interface ContextVariableMap {
    checkUser: AuthenticatedUser | undefined;
    user: AuthenticatedUser;
  }
}

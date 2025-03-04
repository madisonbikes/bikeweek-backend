import { AuthenticatedUser, authenticatedUserSchema } from "../routes/contract";
import { DbUser } from "../database/types";

export enum Roles {
  ADMIN = "admin",
  EDITOR = "editor",
}

export const userHasRole = (user: AuthenticatedUser, role: string) => {
  return user.roles.find((r) => r === role) !== undefined;
};

/** sanitizes user info for export to passport and into request object */
export const buildAuthenticatedUser = (user: DbUser) => {
  // map ObjectId to string for _id to id
  const mappedUser = { id: user._id.toString(), ...user };
  return authenticatedUserSchema.parse(mappedUser);
};

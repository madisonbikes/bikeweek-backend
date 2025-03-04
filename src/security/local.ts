import bcrypt from "bcryptjs";
import { logger } from "../utils";
import { userModel } from "../database/users";
import { DbUser } from "../database/types";
import { buildAuthenticatedUser } from "./authentication";
import { AuthenticatedUser } from "../routes/contract";

/** check this level every few years, eventually bump to higher hash size to improve security */
const BCRYPT_HASH_ROUNDS = 12;

export const checkUsernamePassword = async (
  username: string,
  password: string,
) => {
  logger.trace({ username }, "local auth");
  let retval: AuthenticatedUser | undefined;
  const user = await userModel.findUserByUsername(username);
  if (user) {
    const success = await checkPassword(password, user);
    if (success) {
      retval = buildAuthenticatedUser(user);
    }
  }
  return retval;
};

export const generateHashedPassword = (password: string) => {
  return bcrypt.hash(password, BCRYPT_HASH_ROUNDS);
};

export const checkPassword = (password: string, user: DbUser) => {
  return bcrypt.compare(password, user.hashed_password);
};

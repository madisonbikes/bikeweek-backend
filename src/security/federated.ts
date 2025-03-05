import { buildAuthenticatedUser } from "../security";
import { userModel } from "../database/users";
import { googleFederatedVerifier } from "./google";
import { AuthenticatedUser, FederatedLoginBody } from "../routes/contract";
import { logger } from "../utils";
import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "http-status-codes";

export const federationEnabled = () => {
  return googleFederatedVerifier.enabled();
};

export const checkFederatedLogin = async (login: FederatedLoginBody) => {
  let retval: AuthenticatedUser | undefined = undefined;
  if (login.provider !== "google") {
    logger.warn("unsupported federated authentication provider");
    throw new HTTPException(StatusCodes.BAD_REQUEST, {
      message: "unsupported provider",
    });
  }
  try {
    const email = await googleFederatedVerifier.verifyFederatedToken(
      login.token,
    );

    let ok = false;
    if (email !== undefined) {
      const user = await userModel.findFederatedUser(
        googleFederatedVerifier.name(),
        email,
      );
      if (user !== undefined) {
        ok = true;
        retval = buildAuthenticatedUser(user);
      }
    }
    if (!ok) {
      logger.info("user not found");
    }
  } catch (error: unknown) {
    logger.debug(error, "failed to verify federated token");
    return undefined;
  }
  return retval;
};

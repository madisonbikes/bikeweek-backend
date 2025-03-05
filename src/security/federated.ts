import { buildAuthenticatedUser } from "../security";
import { userModel } from "../database/users";
import { googleFederatedVerifier } from "./google";
import { AuthenticatedUser, FederatedLoginBody } from "../routes/contract";
import { logger } from "../utils";

export const federationEnabled = () => {
  return googleFederatedVerifier.enabled();
};

export const checkFederatedLogin = async (auth: FederatedLoginBody) => {
  let retval: AuthenticatedUser | undefined = undefined;
  try {
    const email = await googleFederatedVerifier.verifyFederatedToken(
      auth.token,
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

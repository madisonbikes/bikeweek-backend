import { buildAuthenticatedUser } from "../security";
import { userModel } from "../database/users";
import googleFederatedVerifier from "./google";
import { AuthenticatedUser, FederatedLoginBody } from "../routes/contract";
import { logger } from "../utils";

export const federationEnabled = () => {
  return googleFederatedVerifier.enabled();
};

export const checkFederatedLogin = async (auth: FederatedLoginBody) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (auth.provider !== "google") {
    logger.warn("unsupported federated authentication provider");
    return undefined;
  }

  const email = await googleFederatedVerifier.verifyFederatedToken(auth.token);

  let retval: AuthenticatedUser | undefined = undefined;

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
  return retval;
};

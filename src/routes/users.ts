import { userModel } from "../database/users";
import {
  addFederatedIdSchema,
  changeUserPasswordSchema,
  federatedProviderSchema,
  User,
  userSchema,
} from "./contract";
import {
  checkPassword,
  generateHashedPassword,
  validateAuthenticated,
  validateBodySchema,
} from "../security";
import { ObjectId } from "mongodb";
import { DbUser } from "../database/types";
import { logger } from "../utils";
import { StatusCodes } from "http-status-codes";
import googleFederatedVerifier from "../security/google";
import { Hono } from "hono";

const routes = new Hono();

routes
  /* ATTENTION! user creation not currently used by UI, no reason to enable it
    .post(
      "/",
      validateAdmin(),
      validateBodySchema({ schema: userWithPasswordSchema }),
      asyncWrapper(async (request, response) => {
        const newUser = request.validated as UserWithPassword;

        if (await this.userModel.findUserByUsername(newUser.username)) {
          response.status(StatusCodes.CONFLICT).send("user already exists");
          return;
        }

        const hashed_password = await generateHashedPassword(newUser.password);
        const createdUser = await this.userModel.addUser({
          ...newUser,
          hashed_password,
        });
        response.send(createdUser);
      })
    )
    */

  /** return list of users */
  .get("/", validateAuthenticated(), async (c) => {
    const users = await userModel.users();
    const mappedUsers = users.map(mapDbUserToExternalUser);
    const adaptedUsers = userSchema.array().parse(mappedUsers);
    c.json(adaptedUsers);
  })

  /** return current user info (similar to /session/info but reflects database values not session structure) */
  .get("/self", validateAuthenticated(), async (c) => {
    const authUser = c.get("user");
    const dbUser = await userModel.findUserById(new ObjectId(authUser.id));
    if (!dbUser) {
      // something's wrong if can't find id because it's an authenticated session
      c.status(StatusCodes.INTERNAL_SERVER_ERROR);
      return;
    }

    const mapped = mapDbUserToExternalUser(dbUser);
    const adaptedUser = userSchema.parse(mapped);
    c.json(adaptedUser);
  })

  /** update current user info */
  .put(
    "/self/password",
    validateAuthenticated(),
    validateBodySchema({ schema: changeUserPasswordSchema }),
    async (c) => {
      const authUser = c.get("user");
      const modify = c.req.valid("json");
      const dbId = new ObjectId(authUser.id);

      const foundUser = await userModel.findUserById(dbId);
      if (!foundUser) {
        // something's wrong if can't find id because it's an authenticated session
        logger.warn({ dbId }, "unexpected missing user");
        c.status(StatusCodes.INTERNAL_SERVER_ERROR);
        return;
      }

      if (!(await checkPassword(modify.old, foundUser))) {
        c.body("old password doesn't match", StatusCodes.FORBIDDEN);
        return;
      }
      const hashed_password = await generateHashedPassword(modify.new);

      const newUser = await userModel.modifyUser(dbId, {
        hashed_password,
      });
      if (!newUser) {
        logger.warn({ dbId }, "unexpected missing user for modify");
        c.status(StatusCodes.INTERNAL_SERVER_ERROR);
        return;
      }
      const returnMap = mapDbUserToExternalUser(newUser);
      const adaptedUser = userSchema.parse(returnMap);
      c.json(adaptedUser);
    },
  )
  .put(
    "/self/federated",
    validateAuthenticated(),
    validateBodySchema({ schema: addFederatedIdSchema }),
    async (c) => {
      const authUser = c.get("user");
      const dbId = new ObjectId(authUser.id);
      const data = c.req.valid("json");
      const federatedId = await googleFederatedVerifier.verifyFederatedToken(
        data.validateToken,
      );
      if (federatedId === undefined) {
        c.status(StatusCodes.FORBIDDEN);
        return;
      }
      const result = await userModel.connectFederatedProvider(dbId, {
        provider: data.provider,
        federatedId,
      });
      if (!result) {
        c.status(StatusCodes.NOT_FOUND);
      } else {
        const returnMap = mapDbUserToExternalUser(result);
        const adaptedUser = userSchema.parse(returnMap);
        c.json(adaptedUser);
      }
    },
  )
  .delete("/self/federated/:provider", validateAuthenticated(), async (c) => {
    const authUser = c.get("user");
    const dbId = new ObjectId(authUser.id);
    const provider = federatedProviderSchema.parse(c.req.param("provider"));
    const result = await userModel.disconnectFederatedProvider(dbId, provider);
    if (!result) {
      c.status(StatusCodes.NOT_FOUND);
    } else {
      const returnMap = mapDbUserToExternalUser(result);
      const adaptedUser = userSchema.parse(returnMap);
      c.json(adaptedUser);
    }
  });

export default { routes };

/** for now, just converts _id ObjectId to id string */
const mapDbUserToExternalUser = (user: DbUser): User => {
  let { _id, roles, ...rest } = user;
  if (roles === undefined) roles = [];
  return { id: _id.toString(), roles, ...rest };
};

import { database } from "../database/database";

const PASSWORD_WITH_LOW_WORK_FACTOR =
  "$2y$04$lQNknVpHEe6ddO3Et1nMGe6q4lNrtNcC3ikrhshs.wT.neD7JwBbm";

export const createTestUser = async () => {
  await database.users.insertOne({
    username: "testuser",
    hashed_password: PASSWORD_WITH_LOW_WORK_FACTOR,
    federated: [{ provider: "google", federatedId: "blarg@blarg.com" }],
  });
};

export const createDuplicatedFederatedId = async () => {
  await database.users.insertOne({
    username: "testuser2",
    hashed_password: PASSWORD_WITH_LOW_WORK_FACTOR,
    federated: [{ provider: "google", federatedId: "blarg@blarg.com" }],
  });
};

/** @lintignore */
export const createTestAdminUser = async () => {
  await database.users.insertOne({
    username: "testadmin",
    hashed_password: PASSWORD_WITH_LOW_WORK_FACTOR,
    roles: ["admin"],
  });
};

import { authenticatedUserSchema } from "../routes/contract";
import { Roles, userHasRole } from "./authentication";

describe("authentication", () => {
  it("plain user lacks role", () => {
    const user = authenticatedUserSchema.parse({ id: "id", username: "plain" });
    expect(userHasRole(user, Roles.ADMIN)).toBeFalsy();
    expect(userHasRole(user, Roles.EDITOR)).toBeFalsy();
    expect(userHasRole(user, "")).toBeFalsy();
  });

  it("admin user has role", () => {
    const user = authenticatedUserSchema.parse({
      id: "id",
      username: "admin",
      roles: ["admin"],
    });
    expect(userHasRole(user, Roles.ADMIN)).toBeTruthy();
    expect(userHasRole(user, Roles.EDITOR)).toBeFalsy();
    expect(userHasRole(user, "")).toBeFalsy();
  });
});

import { authenticatedUserSchema } from "../routes/contract";
import { Roles, userHasRole } from "./authentication";

describe("authentication", () => {
  it("plain user lacks role", () => {
    const user = authenticatedUserSchema.parse({ id: "id", username: "plain" });
    expect(userHasRole(user, Roles.ADMIN)).toBe(false);
    expect(userHasRole(user, Roles.EDITOR)).toBe(false);
    expect(userHasRole(user, "")).toBe(false);
  });

  it("admin user has role", () => {
    const user = authenticatedUserSchema.parse({
      id: "id",
      username: "admin",
      roles: ["admin"],
    });
    expect(userHasRole(user, Roles.ADMIN)).toBe(true);
    expect(userHasRole(user, Roles.EDITOR)).toBe(false);
    expect(userHasRole(user, "")).toBe(false);
  });
});

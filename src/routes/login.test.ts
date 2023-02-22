import { setupSuite, testRequest, TestRequest, createTestUser } from "../test";
import { authenticatedUserSchema } from "./contract";

describe("login route", () => {
  setupSuite({ withDatabase: true, withApiServer: true, clearUsers: true });

  let request: TestRequest;

  beforeEach(async () => {
    // create a test user for login
    await createTestUser();

    request = testRequest();
  });

  it("responds to login api with good credentials successfully", () => {
    return request
      .post("/api/v1/session/login")
      .send({ username: "testuser", password: "password" })
      .expect(200)
      .expect((request) => {
        const response = authenticatedUserSchema.parse(request.body);

        expect(response.username).toEqual("testuser");
        expect(response.roles).toHaveLength(0);
      });
  });

  it("responds to login api without credentials as bad request", () => {
    return request
      .post("/api/v1/session/login")
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: "invalid_type",
              path: ["username"],
            }),
            expect.objectContaining({
              code: "invalid_type",
              path: ["password"],
            }),
          ])
        );
      });
  });

  it("responds to login api with extra fields as bad request", () => {
    return request
      .post("/api/v1/session/login")
      .send({ username: "user1", password: "password", extraxyz: "extra" })
      .expect(400)
      .expect(/unrecognized_keys/)
      .expect(/extraxyz/);
  });

  it("responds to login api with credentials as success request but unauthorized", () => {
    return request
      .post("/api/v1/session/login")
      .send({ username: "bad", password: "bad" })
      .expect(401);
  });
});

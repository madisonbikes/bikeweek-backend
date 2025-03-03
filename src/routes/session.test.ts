import { StatusCodes } from "http-status-codes";
import { setupSuite, testRequest, TestRequest } from "../test";
import { createTestUser } from "../test/data";

describe("login route", () => {
  setupSuite({ withDatabase: true, withApiServer: true, clearUsers: true });

  beforeEach(async () => {
    // create a test user for login
    await createTestUser();
  });

  let request: TestRequest;
  beforeEach(() => {
    request = testRequest();
  });

  it("responds to login api with good credentials successfully", () => {
    return request
      .post("/api/v1/session/login")
      .send({ username: "testuser", password: "password" })
      .expect(StatusCodes.OK)
      .expect(() => {
        // nothing
      });
  });

  it("responds to login api without credentials as bad request", () => {
    return request
      .post("/api/v1/session/login")
      .expect(StatusCodes.BAD_REQUEST)
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
          ]),
        );
      });
  });

  it("responds to login api with extra fields as bad request", () => {
    return request
      .post("/api/v1/session/login")
      .send({ username: "user1", password: "password", extraxyz: "extra" })
      .expect(StatusCodes.BAD_REQUEST)
      .expect(/unrecognized_keys/)
      .expect(/extraxyz/);
  });

  it("responds to login api with good username, bad credentials as unauthorized", () => {
    return request
      .post("/api/v1/session/login")
      .send({ username: "testuser", password: "wrong_password" })
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it("responds to login api with bad username (and bad password) as unauthorized", () => {
    return request
      .post("/api/v1/session/login")
      .send({ username: "bad", password: "bad" })
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it("responds to logout api with good session successfully", async () => {
    await request
      .post("/api/v1/session/login")
      .send({ username: "testuser", password: "password" })
      .expect(StatusCodes.OK)
      .expect(() => {
        // nothing
      });

    await request
      .post("/api/v1/session/logout")
      .expect(StatusCodes.OK)
      .expect(/logged out/);
  });

  it("responds to logout api with bad session failure", async () => {
    await request
      .post("/api/v1/session/logout")
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it("responds to session info with good session successfully", async () => {
    await request
      .post("/api/v1/session/login")
      .send({ username: "testuser", password: "password" })
      .expect(StatusCodes.OK);

    await request
      .get("/api/v1/session/info")
      .expect(StatusCodes.OK)
      .expect(/testuser/);
  });

  it("responds to session info with no session", async () => {
    await request.get("/api/v1/session/info").expect(StatusCodes.UNAUTHORIZED);
  });
});

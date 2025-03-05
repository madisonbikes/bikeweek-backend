import { TestRequest, loginTestUser, setupSuite, testRequest } from "../test";
import { createDuplicatedFederatedId, createTestUser } from "../test/data";
import { StatusCodes } from "http-status-codes";
import { userSchema } from "./contract";
import { testConfiguration } from "../config";
import { googleFederatedVerifier } from "../security/google";

// Mock the googleFederatedVerifier
jest.mock("../security/google");

const mockedGoogleFederatedVerifier = jest.mocked(googleFederatedVerifier);
mockedGoogleFederatedVerifier.name.mockReturnValue("google");
mockedGoogleFederatedVerifier.enabled.mockReturnValue(true);

describe("federated routes (enabled)", () => {
  setupSuite({
    withDatabase: true,
    withApiServer: true,
    clearUsers: true,
  });

  // enable the federated endpoint
  testConfiguration.add({ googleAuthClientId: "blarg" });

  let request: TestRequest;

  beforeEach(async () => {
    // create a test user for login
    await createTestUser();
    request = testRequest();

    // clear the verify federated token mock
    mockedGoogleFederatedVerifier.verifyFederatedToken.mockReset();
  });

  it("responds to federated/google auth with 401 if configured", async () => {
    mockedGoogleFederatedVerifier.verifyFederatedToken.mockRejectedValue(
      new Error("Invalid token"),
    );

    await request
      .post("/api/v1/session/federated/login")
      .send({ provider: "google", token: "blarg" })
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it("responds to federated/google auth with 400 if supply invalid body", async () => {
    await request
      .post("/api/v1/session/federated/login")
      .send({ provider: "google", invalid_token: "blarg" })
      .expect(StatusCodes.BAD_REQUEST)
      .expect(/invalid_type/)
      .expect(/token/);
  });

  it("responds to federated/google auth with 400 if supply invalid provider", async () => {
    await request
      .post("/api/v1/session/federated/login")
      .send({ provider: "bad_provider", token: "blarg" })
      .expect(StatusCodes.BAD_REQUEST)
      .expect(/unsupported provider/);
  });

  it("responds to federated/google auth with proper match id", async () => {
    mockedGoogleFederatedVerifier.verifyFederatedToken.mockResolvedValue(
      "blarg@blarg.com",
    );
    await request
      .post("/api/v1/session/federated/login")
      .send({ provider: "google", token: "blarg" })
      .expect(StatusCodes.OK);
  });

  it("responds to federated/google auth without proper match id", async () => {
    mockedGoogleFederatedVerifier.verifyFederatedToken.mockResolvedValue(
      "nomatch@blarg.com",
    );
    await request
      .post("/api/v1/session/federated/login")
      .send({ provider: "google", token: "blarg" })
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it("responds to federated/google auth with duplicate matching federated ids", async () => {
    await createDuplicatedFederatedId();
    mockedGoogleFederatedVerifier.verifyFederatedToken.mockResolvedValue(
      "blarg@blarg.com",
    );
    await request
      .post("/api/v1/session/federated/login")
      .send({ provider: "google", token: "blarg" })
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it("responds to authenticated self remove federated identity", async () => {
    await loginTestUser(request);

    const userResponse = await request
      .delete("/api/v1/users/self/federated/google")
      .expect(StatusCodes.OK);

    const parsed = userSchema.strict().parse(userResponse.body);
    expect(parsed).toMatchObject({
      username: "testuser",
      federated: [],
    });
    expect(parsed.id).toBeDefined();
  });

  it("responds to authenticated self add federated identity", async () => {
    await loginTestUser(request);
    mockedGoogleFederatedVerifier.verifyFederatedToken.mockResolvedValue(
      "nomatch@blarg.com",
    );
    const userResponse = await request
      .put("/api/v1/users/self/federated")
      .send({ provider: "google", validateToken: "any_token" })
      .expect(StatusCodes.OK);

    const parsed = userSchema.strict().parse(userResponse.body);
    expect(parsed).toMatchObject({
      username: "testuser",
      federated: [{ provider: "google", federatedId: "nomatch@blarg.com" }],
    });
    expect(parsed.id).toBeDefined();
  });
});

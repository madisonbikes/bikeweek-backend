import { TestRequest, setupSuite, testRequest } from "../test";
import { StatusCodes } from "http-status-codes";
import { googleFederatedVerifier } from "../security/google";

// Mock the googleFederatedVerifier
jest.mock("../security/google");

const mockedGoogleFederatedVerifier = jest.mocked(googleFederatedVerifier);
mockedGoogleFederatedVerifier.name.mockReturnValue("google");
mockedGoogleFederatedVerifier.enabled.mockReturnValue(false);

describe("federated routes (disabled)", () => {
  let request: TestRequest;

  setupSuite({ withDatabase: true, withApiServer: true });

  beforeEach(() => {
    request = testRequest();
    mockedGoogleFederatedVerifier.verifyFederatedToken.mockReset();
  });

  it("responds to federated/google auth with 404 if not configured", async () => {
    await request
      .post("/api/v1/session/federated/login")
      .send({ provider: "google", token: "blarg" })
      .expect(StatusCodes.NOT_FOUND);

    expect(googleFederatedVerifier.enabled).toHaveBeenCalled();
  });
});

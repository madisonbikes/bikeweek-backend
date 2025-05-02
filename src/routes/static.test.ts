import { StatusCodes } from "http-status-codes";
import { setupSuite, testRequest, TestRequest } from "../test";

describe("static routes", () => {
  setupSuite({
    withDatabase: false,
    withApiServer: true,
  });

  let request: TestRequest;

  beforeEach(() => {
    request = testRequest();
  });

  it("responds to good static route", async () => {
    await request.get("/index.ts").expect(StatusCodes.OK);
  });

  it("responds to bad static route", async () => {
    await request.get("/bad.ts").expect(StatusCodes.NOT_FOUND);
  });

  it("responds to good nested static route", async () => {
    await request.get("/test/index.ts").expect(StatusCodes.OK);
  });
});

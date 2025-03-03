import { maskUriPassword } from "./logger";

describe("tests masking of uris with password", () => {
  it("mask a uri with password", () => {
    const masked = maskUriPassword(
      "mongodb://john:pwd897@some_url:234/database_name",
    );
    expect(masked).not.toContain("pwd897");
    expect(masked).toEqual("mongodb://john:######@some_url:234/database_name");
  });

  it("mask a uri without password", () => {
    const masked = maskUriPassword("mongodb://john@some_url:234/database_name");
    expect(masked).toEqual("mongodb://john@some_url:234/database_name");
  });

  it("mask invalid uri", () => {
    const masked = maskUriPassword("##invalidURI##");
    expect(masked).toEqual("##invalidURI##");
  });
});

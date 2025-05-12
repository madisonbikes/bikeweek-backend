import { urlToValkeyConfiguration } from "./valkey";

describe("urlToValkeyGlideClientConfiguration", () => {
  it("should parse a valid valkey URL", () => {
    const url = "valkey://localhost:6379/0";
    const config = urlToValkeyConfiguration(url);
    expect(config).toEqual({
      db: 0,
      host: "localhost",
      port: 6379,
    });
  });

  it("should parse a valid redis URL", () => {
    const url = "redis://127.0.0.1:6380/1";
    const config = urlToValkeyConfiguration(url);
    expect(config).toEqual({
      db: 1,
      host: "127.0.0.1",
      port: 6380,
    });
  });

  it("should parse a valid valkey URL without database", () => {
    const url = "valkey://localhost:6379/";
    const config = urlToValkeyConfiguration(url);
    expect(config).toEqual({
      db: 0,
      host: "localhost",
      port: 6379,
    });
  });

  it("should parse a valid valkey URL with a password", () => {
    const url = "valkey://:password@localhost:6379/";
    const config = urlToValkeyConfiguration(url);
    expect(config).toEqual({
      db: 0,
      host: "localhost",
      port: 6379,
      password: "password",
    });
  });

  it("should parse a valid valkey URL without database (form 2)", () => {
    const url = "valkey://localhost:6379";
    const config = urlToValkeyConfiguration(url);
    expect(config).toEqual({
      db: 0,
      host: "localhost",
      port: 6379,
    });
  });

  it("should throw an error for an invalid protocol", () => {
    const url = "http://localhost:6379/0";
    expect(() => urlToValkeyConfiguration(url)).toThrow(
      "Invalid valkey session URI",
    );
  });

  it("should throw an error for an invalid port", () => {
    const url = "valkey://localhost:70000/0"; // Port out of range
    expect(() => urlToValkeyConfiguration(url)).toThrow("Invalid URL");
  });

  it("should throw an error for a non-numeric port", () => {
    const url = "valkey://localhost:abc/0";
    expect(() => urlToValkeyConfiguration(url)).toThrow("Invalid URL");
  });

  it("should throw an error for an invalid database ID", () => {
    const url = "valkey://localhost:6379/-1"; // Negative database ID
    expect(() => urlToValkeyConfiguration(url)).toThrow(
      "Invalid database ID in valkey session URI",
    );
  });

  it("should throw an error for a non-numeric database ID", () => {
    const url = "valkey://localhost:6379/abc";
    expect(() => urlToValkeyConfiguration(url)).toThrow(
      "Invalid database ID in valkey session URI",
    );
  });

  it("should throw an error for a missing port", () => {
    const url = "valkey://localhost";
    expect(() => urlToValkeyConfiguration(url)).toThrow(
      "Invalid port in valkey session URI: valkey://localhost",
    );
  });
});

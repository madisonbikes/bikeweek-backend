import { initEnv } from "./utils/env";

initEnv();

const isDev = process.env.NODE_ENV === "development";

const parseIntWithDefault = (
  value: string | undefined,
  defaultValue: number,
): number => {
  let retval = defaultValue;
  if (value !== undefined) {
    retval = Number(value);
    if (isNaN(retval)) {
      retval = defaultValue;
    }
  }
  return retval;
};

const parseBooleanWithDefault = (
  value: string | undefined,
  defaultValue: boolean,
): boolean => {
  let retval = defaultValue;
  if (value !== undefined) {
    retval = value.toLowerCase() === "true";
  }
  return retval;
};

/** @internal */
export const testConfiguration = {
  reset() {
    if (process.env.NODE_ENV !== "test") {
      throw new Error(
        "overrideConfigurationForTests should only be called in test environment",
      );
    }
    Object.assign(configuration, defaultConfiguration);
  },
  add(values: Partial<ServerConfiguration>) {
    if (process.env.NODE_ENV !== "test") {
      throw new Error(
        "overrideConfigurationForTests should only be called in test environment",
      );
    }
    Object.assign(configuration, values);
  },
};

let gravityFormsUri = "";
if (process.env.GF_URI !== undefined && process.env.GF_URI !== "") {
  gravityFormsUri = `${process.env.GF_URI}/wp-json/gf/v2`;
}

let schedUri = "";
if (process.env.SCHED_URI !== undefined && process.env.SCHED_URI !== "") {
  schedUri = `${process.env.SCHED_URI}/api/`;
}

const defaultConfiguration = {
  gravityFormsUri,
  gravityFormsId: process.env.GF_FORM_ID ?? "",
  gravityFormsConsumerApiKey: process.env.GF_CONSUMER_API_KEY ?? "",
  gravityFormsConsumerSecret: process.env.GF_CONSUMER_SECRET ?? "",
  schedUri,
  schedApiKey: process.env.SCHED_API_KEY ?? "",
  reactStaticRootDir: process.env.STATIC_ROOT_DIR ?? "",
  mongoDbUri: process.env.MONGODB_URI ?? "",
  serverPort: parseIntWithDefault(process.env.PORT, 3001),
  pollInterval: parseIntWithDefault(process.env.POLLINTERVAL, 10 * 60 * 1000),
  redisUri: process.env.REDIS_URI ?? "",
  sessionStoreSecret: process.env.SESSION_STORE_SECRET ?? "notverysecret",
  secureCookie: parseBooleanWithDefault(process.env.SECURE_COOKIE, !isDev),
  trustProxy: parseBooleanWithDefault(process.env.TRUST_PROXY, false),
  enableCors: parseBooleanWithDefault(process.env.ENABLE_CORS, false),
  googleAuthClientId: process.env.GOOGLE_AUTH_CLIENT_ID ?? "",
};

export const configuration = { ...defaultConfiguration } as const;

export type ServerConfiguration = typeof defaultConfiguration;

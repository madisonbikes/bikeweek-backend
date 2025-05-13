/* istanbul ignore file */
import { ConnectionString } from "connection-string";
import pino, { stdSerializers } from "pino";
import { initEnv } from "./env";

initEnv();

const TEST_LOG_LEVEL = process.env.TEST_LOG_LEVEL ?? "fatal";
const LOG_LEVEL = process.env.LOG_LEVEL;

const serializers = {
  err: stdSerializers.err,
  when: (date: unknown) => {
    if (date instanceof Date) {
      return date.toLocaleString();
    } else {
      return date;
    }
  },
};
const usePinoPretty = Boolean(process.env.PINO_PRETTY);
const options: pino.LoggerOptions = { serializers };

if (process.env.NODE_ENV === "test") {
  options.level = TEST_LOG_LEVEL;
} else if (process.env.NODE_ENV === "development") {
  options.level = LOG_LEVEL ?? "info";
} else {
  // production
  options.level = LOG_LEVEL ?? "warn";
}

if (usePinoPretty) {
  options.transport = {
    target: "pino-pretty",
  };
}

export const logger = pino(options);

export const maskUriPassword = (uri: string) => {
  try {
    const logUri = new ConnectionString(uri);
    return logUri.toString({ passwordHash: true });
  } catch (err) {
    logger.warn({ err, uri }, "unparseable/unmaskable URI");
    return uri;
  }
};

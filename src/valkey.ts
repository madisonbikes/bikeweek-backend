import { configuration } from "./config";
import { RedisStore } from "connect-redis";
import Valkey from "iovalkey";
import { logger, maskUriPassword } from "./utils";
import { z } from "zod";

let client: Valkey | undefined;

type ValkeyConfiguration = {
  db?: number;
  host: string;
  port: number;
  password?: string;
};

export const urlToValkeyConfiguration = (url: string): ValkeyConfiguration => {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== "valkey:" && parsedUrl.protocol !== "redis:") {
    throw new Error(`Invalid valkey session URI: ${url}`);
  }

  const { success: successPort, data: port } = z.coerce
    .number()
    .min(1)
    .max(65535)
    .safeParse(parsedUrl.port);
  if (!successPort) {
    throw new Error(`Invalid port in valkey session URI: ${url}`);
  }
  const { success: successDatabaseId, data: db } = z.coerce
    .number()
    .nonnegative()
    .optional()
    .safeParse(parsedUrl.pathname.substring(1));
  if (!successDatabaseId) {
    throw new Error(`Invalid database ID in valkey session URI: ${url}`);
  }

  let password: string | undefined = parsedUrl.password;
  if (password === "") {
    password = undefined;
  }
  return {
    db,
    host: parsedUrl.hostname,
    password,
    port,
  };
};

if (isEnabled()) {
  const config = urlToValkeyConfiguration(configuration.valkeyUri);
  client = new Valkey({ ...config, lazyConnect: true });
  client.on("error", (err) => {
    logger.warn(err, "Valkey client error");
  });
} else {
  logger.info("Valkey disabled");
}

function isEnabled() {
  return configuration.valkeyUri !== "";
}

async function start() {
  if (client !== undefined) {
    logger.info(
      `Connecting to Valkey on ${maskUriPassword(configuration.valkeyUri)}`,
    );
    await client.connect();
  }
}

function stop() {
  if (client !== undefined) {
    client.disconnect();
    client = undefined;
  }
}

function createStore() {
  return new RedisStore({ client });
}

export default { start, stop, isEnabled, createStore };

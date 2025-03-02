import { configuration } from "./config";
import { RedisStore } from "connect-redis";
import { createClient, RedisClientType } from "redis";
import { logger, maskUriPassword } from "./utils";

let client: RedisClientType | undefined;

if (isEnabled()) {
  client = createClient({ url: configuration.redisUri });
  client.on("error", (err) => logger.warn(err, "Redis Client Error"));
} else {
  logger.info("Redis disabled");
}

function isEnabled() {
  return configuration.redisUri !== undefined && configuration.redisUri !== "";
}

async function start() {
  if (client !== undefined) {
    logger.info(
      `Connecting to redis on ${maskUriPassword(configuration.redisUri)}`,
    );
    await client.connect();
  }
}

async function stop() {
  if (client !== undefined) {
    await client.disconnect();
    client = undefined;
  }
}

function createStore() {
  return new RedisStore({ client });
}

export default { start, stop, isEnabled, createStore };

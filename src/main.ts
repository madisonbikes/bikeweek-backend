import { database } from "./database/database";
import server from "./server";
import { poller } from "./gravityforms/poller";
import eventSync from "./sched/sync";
import valkey from "./valkey";

// unify all services into one start function
export async function start() {
  await database.start();
  await valkey.start();
  await server.start();
  await poller.start();
  await eventSync.start();
}

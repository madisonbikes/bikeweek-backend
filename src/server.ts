import { serve, ServerType } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

import { configuration } from "./config";
import { logger } from "./utils";
import routes from "./routes";
import { buildMiddleware } from "./session";

let server: ServerType | undefined;

function create(): Promise<ServerType> {
  const app = new Hono();

  if (configuration.enableCors) {
    // cors should only be used for development -- production serves from same server/port
    //app.use(cors());
  }

  if (configuration.reactStaticRootDir) {
    app.use("/", serveStatic({ root: configuration.reactStaticRootDir }));
  }

  app.use(buildMiddleware());

  app.route("/api/v1", routes);

  return Promise.resolve(serve(app));
}

async function start(): Promise<void> {
  server = await create();
  server.listen(configuration.serverPort, () => {
    logger.info(
      `Server listening on http://localhost:${configuration.serverPort}`,
    );
  });
}

function stop(): Promise<void> {
  server?.close();
  server = undefined;
  return Promise.resolve();
}

export default { create, start, stop };

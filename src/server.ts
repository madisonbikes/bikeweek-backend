import { serve, ServerType } from "@hono/node-server";
import { logger as loggerMiddleware } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";

import { configuration } from "./config";
import { logger } from "./utils";
import routes from "./routes";
import { buildSessionMiddlewares } from "./security/session";
import { AppHono } from "./app";
import { showRoutes } from "hono/dev";
import { env } from "process";

let server: ServerType | undefined;

function create() {
  const app = new AppHono();

  app.use(
    loggerMiddleware((str, ...rest) => {
      logger.info(str, rest);
    }),
  );

  if (configuration.enableCors) {
    // cors should only be used for development -- production serves from same server/port
    //app.use(cors());
  }

  if (configuration.reactStaticRootDir) {
    app.use("/", serveStatic({ root: configuration.reactStaticRootDir }));
  }

  app.use(...buildSessionMiddlewares());

  app.route("/api/v1", routes);

  if (env.NODE_ENV !== "test") {
    showRoutes(app);
  }

  return app;
}

function start(): Promise<void> {
  const app = create();
  server = serve({ port: configuration.serverPort, fetch: app.fetch }, () => {
    logger.info(
      `Server listening on http://localhost:${configuration.serverPort}`,
    );
  });
  return Promise.resolve();
}

function stop(): Promise<void> {
  server?.close();
  server = undefined;
  return Promise.resolve();
}

export default { create, start, stop };

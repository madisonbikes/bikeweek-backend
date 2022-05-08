import { injectable } from "tsyringe";
import { Configuration } from "./config";
import express from "express";
import passport from "passport";
import { ApiRoutes } from "./routes";
import { Strategies } from "./security/authentication";

@injectable()
export class ApiServer {
  constructor(
    private configuration: Configuration,
    private apiRoutes: ApiRoutes,
    private strategies: Strategies
  ) {}

  async start(): Promise<void> {
    const app = express();

    app.use(express.json());

    // used for login method
    passport.use(this.strategies.local);

    // used for securing most api endpoints
    passport.use(this.strategies.jwt);

    app.use(passport.initialize());

    app.use("/api/v1", this.apiRoutes.routes);

    app.listen(this.configuration.apiPort, () => {
      console.log(
        `Server listening on http://localhost:${this.configuration.apiPort}`
      );
    });
  }
}

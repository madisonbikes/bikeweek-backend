import {
  AddSessionRequest,
  DeleteSessionRequest,
  ModifySessionRequest,
  SessionExportRequest,
  SessionExportResponse,
  SessionListRequest,
  SessionListResponse,
  sessionListResponseSchema,
  sessionExportResponseSchema,
} from "./types";
import superagent from "superagent";
import { error, ok, Result } from "../utils/result";
import { sleep } from "../utils/await-sleep";
import { configuration } from "../config";
import { logger } from "../utils";

class SchedApi {
  async addSession(
    session: AddSessionRequest,
  ): Promise<Result<string, string>> {
    const { response, isError } = await this.postRequest("session/add", {
      ...session,

      // WORKAROUND sched issue where format is csv
      //format: "",
    });
    if (isError) {
      return error(response.text);
    } else {
      return ok(response.text);
    }
  }

  async modifySession(
    session: ModifySessionRequest,
  ): Promise<Result<string, string>> {
    const { response, isError } = await this.postRequest("session/mod", {
      ...session,
      // WORKAROUND sched issue where format is csv
      //format: "",
    });
    if (isError) {
      return error(response.text);
    } else {
      return ok(response.text);
    }
  }

  async listSessions(
    query?: SessionListRequest,
  ): Promise<Result<SessionListResponse[], string>> {
    const newQuery = { format: "json", ...query };
    const { response, isError } = await this.postRequest(
      "session/list",
      newQuery,
    );
    if (isError) {
      return error(response.text);
    } else {
      const body: unknown = response.body;
      return ok(sessionListResponseSchema.array().parse(body));
    }
  }

  async exportSessions(
    query?: SessionExportRequest,
  ): Promise<Result<SessionExportResponse[], string>> {
    const newQuery = { format: "json", ...query };
    const { response, isError } = await this.postRequest(
      "session/export",
      newQuery,
    );
    if (isError) {
      return error(response.text);
    } else {
      const body: unknown = response.body;
      return ok(sessionExportResponseSchema.array().parse(body));
    }
  }

  async deleteSession(
    session: DeleteSessionRequest,
  ): Promise<Result<unknown, string>> {
    const { response, isError } = await this.postRequest(
      "session/del",
      session,
    );
    if (isError) {
      return error(response.text);
    } else {
      return ok(response.text);
    }
  }

  private async postRequest(
    endpoint: string,
    requestData: Record<string, unknown>,
  ) {
    await this.checkThrottle();

    const newRequestData = {
      ...requestData,
      api_key: configuration.schedApiKey,
    };
    const fullEndpoint = configuration.schedUri + endpoint;
    logger.debug(
      `=> sched api POST request for %s %o`,
      endpoint,
      newRequestData,
    );
    const response = await superagent
      .post(fullEndpoint)
      .set("User-Agent", "madisonbikeweek-importer/1.0.0")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send(newRequestData);

    logger.debug(`<= sched api response for %s %o`, endpoint, response.body);
    // error can be false or an error code, we'll separate those values
    if (response.error === false) {
      return { response, isError: false, code: undefined };
    } else {
      return { response, isError: true, code: response.error };
    }
  }

  private callCount = 0;
  private lastThrottleTime = 0;

  private async checkThrottle() {
    const savelastThrottleTime = this.lastThrottleTime;
    this.lastThrottleTime = Date.now();
    if (savelastThrottleTime < Date.now() - 30000) {
      // don't throttle if more than 30 seconds have elapsed
      this.callCount = 0;
      return;
    }
    this.callCount++;
    if (this.callCount % 15 === 0) {
      logger.debug("throttling api call, waiting 30 seconds");
      await sleep(30000);
    }
  }
}

export default new SchedApi();

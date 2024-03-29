import "reflect-metadata";
import { Configuration } from "../config";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  container as rootContainer,
  DependencyContainer,
  injectable,
  Lifecycle,
  singleton,
} from "tsyringe";
import { Database } from "../database/database";
import assert from "assert";
import { ApiServer } from "../server";
import { Server } from "./request";
let testMongoUri: string;
let testMongoServer: MongoMemoryServer | undefined;

// the test container is initialized once for the suite
let tc: DependencyContainer | undefined;

export let apiServer: ApiServer | undefined;
export let runningApiServer: Server | undefined;

export type SuiteOptions = {
  // spin up a memory mongodb instance for testing purposes
  withDatabase: boolean;

  // run api server
  withApiServer: boolean;

  // clear users after each test
  clearUsers: boolean;

  // supply an alternate configuration
  withModifiedConfiguration: (config: TestConfiguration) => void;

  // modify test container (add mocks) before server created
  withTestContainerInit: (container: DependencyContainer) => void;
};

/** entry point that should be included first in each describe block */
export const setupSuite = (options: Partial<SuiteOptions> = {}): void => {
  const withDatabase = options.withDatabase ?? false;
  const withApiServer = options.withApiServer ?? false;
  const withTestContainerInit = options.withTestContainerInit;
  beforeAll(async () => {
    assert(tc === undefined);
    tc = await initializeSuite();
    if (withTestContainerInit) {
      withTestContainerInit(tc);
    }
    if (withDatabase) {
      // start the mongo in-memory server on an ephemeral port
      testMongoServer = await MongoMemoryServer.create();
      testMongoUri = testMongoServer.getUri();

      // provide a Database object scoped to the container rather, overriding singleton normally
      tc.register(
        Database,
        { useClass: Database },
        { lifecycle: Lifecycle.ContainerScoped }
      );

      await testDatabase().start();
    } else {
      // if database not enabled, trigger an error if we try to inject a database object
      tc.register(Database, {
        useFactory: () => {
          throw new Error("No database allowed for this test suite");
        },
      });
    }

    if (options.withModifiedConfiguration) {
      options.withModifiedConfiguration(tc.resolve(Configuration));
    }

    if (withApiServer) {
      apiServer = tc.resolve(ApiServer);
      runningApiServer = await apiServer.create();
    }
  });

  afterEach(async () => {
    const queries: Array<Promise<unknown>> = [];
    if (options.clearUsers ?? false) {
      queries.push(testDatabase().users.deleteMany({}));
    }
    await Promise.all(queries);
  });

  afterAll(async () => {
    assert(tc);

    if (withApiServer) {
      runningApiServer = undefined;
      await apiServer?.stop();
      apiServer = undefined;
    }

    if (withDatabase) {
      await testDatabase().stop();

      await testMongoServer?.stop();
      testMongoServer = undefined;
    }

    await cleanupSuite();

    tc = undefined;
  });
};

/**
 * Callers that make modifications to the container should do so in a CHILD container because the container is not reset
 * between test
 */
export const testContainer = (): DependencyContainer => {
  assert(tc);
  return tc;
};

/** return the object managing the connection to the mongodb instance */
export const testDatabase = (): Database => {
  return testContainer().resolve(Database);
};

export const initializeSuite = (): Promise<DependencyContainer> => {
  // don't use value registrations because they will be cleared in the beforeEach() handler
  const testContainer = rootContainer.createChildContainer();
  // provide a custom TestConfiguration adapted for the testing environment
  testContainer.register(
    Configuration,
    { useClass: TestConfiguration },
    { lifecycle: Lifecycle.ContainerScoped }
  );
  return Promise.resolve(testContainer);
};

export const cleanupSuite = async (): Promise<void> => {
  // empty, exists for symmetry with initializeSuite
};

@injectable()
@singleton()
export class TestConfiguration extends Configuration {
  public override mongoDbUri;
  public override gravityFormsUri;
  public override schedUri;
  public override redisUri;
  public override secureCookie;
  public override googleAuthClientId;

  constructor() {
    super();
    this.mongoDbUri = testMongoUri;
    this.gravityFormsUri = "";
    this.schedUri = "";
    this.redisUri = "";
    this.secureCookie = false;
    this.googleAuthClientId = "";
  }
}

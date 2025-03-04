import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

type ValidateOptions<T extends z.ZodTypeAny> = {
  schema: T;
};

/** validate the request body against the supplied schema, placing validated object into the request.validated property */
export const validateBodySchema = <T extends z.ZodTypeAny>({
  schema,
}: ValidateOptions<T>) => {
  return zValidator("json", schema);
};

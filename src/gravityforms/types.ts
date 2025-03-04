/** schema for gravity forms responses */

import { z } from "zod";

export const entrySchema = z
  .object({
    id: z.coerce.number(),
    form_id: z.string(),
    post_id: z.string().nullish(),
    date_created: z.string(),
    date_updated: z.string(),
    status: z.string(),
  })
  .passthrough();
export type Entry = z.infer<typeof entrySchema>;

export const entryResponseSchema = z.object({
  total_count: z.number(),
  entries: entrySchema.array(),
});

const choiceSchema = z.object({
  text: z.string(),
  value: z.string(),
  isSelected: z.coerce.boolean(),
});

const inputSchema = z.object({
  id: z.string(),
  label: z.string(),
  name: z.string(),
});

export const fieldSchema = z.object({
  type: z.string(),
  id: z.coerce.number(),
  label: z.string(),
  adminLabel: z.string(),
  choices: z.union([choiceSchema.array(), z.string()]).nullish(),
  inputs: z.union([inputSchema.array(), z.string()]).nullish(),
});
export type Field = z.infer<typeof fieldSchema>;

export const FormResponseSchema = z.object({
  title: z.string(),
  fields: fieldSchema.array(),
});

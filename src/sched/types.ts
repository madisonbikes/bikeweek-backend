/** schema for sched responses */
import { z } from "zod";

export const sessionListRequestSchema = z.object({
  since: z.number().optional(),
  format: z.string().optional(),
  status: z.string().optional(),
  custom_data: z.string().optional(),
});

export type SessionListRequest = z.infer<typeof sessionListRequestSchema>;

export const sessionExportRequestSchema = z.object({
  since: z.number().optional(),
  format: z.string().optional(),
  status: z.string().optional(),
  custom_data: z.string().optional(),
});

export type SessionExportRequest = z.infer<typeof sessionExportRequestSchema>;

export const deleteSessionRequestSchema = z.object({ session_key: z.string() });
export type DeleteSessionRequest = z.infer<typeof deleteSessionRequestSchema>;

export const addSessionRequestSchema = z.object({
  session_key: z.string(),
  name: z.string(),
  session_start: z.string(),
  session_end: z.string(),
  session_type: z.string(),
  session_subtype: z.string().optional(),
  description: z.string().optional(),
  media_url: z.string().optional(),
  venue: z.string().optional(),
  address: z.string().optional(),
  tags: z.string().optional(),
  seats: z.string().optional(),
  rsvp_url: z.string().optional(),
  ticket_message: z.string().optional(),
  active: z.string().optional(),
});

export type AddSessionRequest = z.infer<typeof addSessionRequestSchema>;

const _modifySessionRequestSchema = z.object({
  session_key: z.string(),
  name: z.string().optional(),

  // format: YYYY-MM-DD HH:MM
  session_start: z.string().optional(),

  // format: YYYY-MM-DD HH:MM
  session_end: z.string().optional(),
  session_type: z.string().optional(),
  session_subtype: z.string().optional(),
  description: z.string().optional(),
  media_url: z.string().optional(),
  venue: z.string().optional(),
  address: z.string().optional(),
  tags: z.string().optional(),
  seats: z.string().optional(),
  rsvp_url: z.string().optional(),
  ticket_message: z.string().optional(),
  active: z.string().optional(),
});
export type ModifySessionRequest = z.infer<typeof _modifySessionRequestSchema>;

export const sessionListResponseSchema = z.object({
  event_key: z.string(),
});
export type SessionListResponse = z.infer<typeof sessionListResponseSchema>;

export const sessionExportResponseSchema = z.object({
  event_key: z.string(),
  active: z.string(),
});
export type SessionExportResponse = z.infer<typeof sessionExportResponseSchema>;

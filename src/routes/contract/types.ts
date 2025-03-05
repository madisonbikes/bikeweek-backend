import { z } from "zod";

export const eventTimeSchema = z.object({
  start: z.string(),
  end: z.string(),
});
export type EventTime = z.infer<typeof eventTimeSchema>;

export const eventStatusSchema = z.enum([
  "submitted",
  "approved",
  "cancelled",
  "pending",
]);
export type EventStatus = z.infer<typeof eventStatusSchema>;

export const eventSponsorSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
});
export type EventSponsor = z.infer<typeof eventSponsorSchema>;

export const eventLocationSchema = z.object({
  name: z.string(),
  sched_venue: z.string().optional(), // defaults to name if null
  sched_address: z.string().optional(), // required for specific address info
  maps_query: z.string().optional(),
  maps_description: z.string().optional(),
  maps_placeid: z.string().optional(),
  detailed_location_description: z.string().optional(),
});
export type EventLocation = z.infer<typeof eventLocationSchema>;

export const eventDaysArraySchema = z.coerce.date().array();

export const bikeWeekEventSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  eventUrl: z.string().optional(),
  description: z.string(),
  eventGraphicUrl: z.string().optional(),
  sponsors: eventSponsorSchema.array(),
  location: eventLocationSchema.optional(),
  eventTypes: z.string().array(),
  eventDays: eventDaysArraySchema,
  eventTimes: eventTimeSchema.array(),
  status: eventStatusSchema,
  comments: z.string().optional(),
  modifyDate: z.coerce.date(),
  createDate: z.coerce.date(),
});
export type BikeWeekEvent = z.infer<typeof bikeWeekEventSchema>;

/** mutate removes several fields */
export const mutateBikeWeekEventSchema = bikeWeekEventSchema
  .omit({
    modifyDate: true,
    createDate: true,
    id: true,
  })
  .partial()
  .strict();
export type MutateBikeWeekEvent = z.infer<typeof mutateBikeWeekEventSchema>;

export const loginBodySchema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .strict();

export type LoginBody = z.infer<typeof loginBodySchema>;

export const federatedProviderSchema = z.string();
export type FederatedProvider = z.infer<typeof federatedProviderSchema>;

// provider=google for now
export const federatedLoginBodySchema = z.object({
  provider: federatedProviderSchema,
  token: z.string(),
});
export type FederatedLoginBody = z.infer<typeof federatedLoginBodySchema>;

export const federatedIdSchema = z.object({
  provider: federatedProviderSchema,

  /** normally an email */
  federatedId: z.string(),
});
export type FederatedId = z.infer<typeof federatedIdSchema>;

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  roles: z.string().array().default([]),
  federated: federatedIdSchema.array().optional(),
});
export type User = z.infer<typeof userSchema>;

export const changeUserPasswordSchema = z
  .object({
    old: z.string(),
    new: z.string(),
  })
  .strict();
export type ChangeUserPassword = z.infer<typeof changeUserPasswordSchema>;

export const addFederatedIdSchema = z
  .object({
    provider: federatedProviderSchema,
    validateToken: z.string(),
  })
  .strict();
export type AddFederatedId = z.infer<typeof addFederatedIdSchema>;

export const userWithPasswordSchema = userSchema.extend({
  password: z.string(),
});
export type UserWithPassword = z.infer<typeof userWithPasswordSchema>;

export const authenticatedUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  roles: z.string().array().default([]),
  federated: federatedIdSchema.array().optional(),
});
export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;

export const getInfoSchema = z.object({
  version: z.string(),
});
export type GetInfo = z.infer<typeof getInfoSchema>;

import { CookieStore, sessionMiddleware } from "hono-sessions";
import { configuration } from "./config";

const COOKIE_MAX_AGE_DAYS = 7;

const store = new CookieStore();

export function buildMiddleware() {
  return sessionMiddleware({
    store,
    encryptionKey: configuration.sessionStoreSecret, // Required for CookieStore, recommended for others
    expireAfterSeconds: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60,
    cookieOptions: {
      sameSite: "Lax", // Recommended for basic CSRF protection in modern browsers
      path: "/", // Required for this library to work properly
      httpOnly: true, // Recommended to avoid XSS attacks
    },
  });
}

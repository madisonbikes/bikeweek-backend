import { CookieStore, sessionMiddleware } from "hono-sessions";
import { configuration } from "../config";
import { createMiddleware } from "../app";

const COOKIE_MAX_AGE_DAYS = 7;

const store = new CookieStore();

export function buildSessionMiddlewares() {
  return [
    sessionMiddleware({
      store,
      encryptionKey: configuration.sessionStoreSecret, // Required for CookieStore, recommended for others
      expireAfterSeconds: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60,
      cookieOptions: {
        sameSite: "Lax", // Recommended for basic CSRF protection in modern browsers
        path: "/", // Required for this library to work properly
        httpOnly: true, // Recommended to avoid XSS attacks
        secure: configuration.secureCookie,
      },
    }),
    createMiddleware(async (c, next) => {
      const session = c.get("session");
      const user = session.get("user");
      if (user == null) {
        c.set("checkUser", undefined);
      } else {
        c.set("user", user);
        c.set("checkUser", user);
      }
      await next();
    }),
  ];
}

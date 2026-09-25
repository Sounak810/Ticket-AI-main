import jwt from "jsonwebtoken";

export const ACCESS_COOKIE_NAME = "ta_access";

export function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    issuer: process.env.JWT_ISSUER || "ticket-ai",
    audience: process.env.JWT_AUDIENCE || "ticket-ai-client",
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER || "ticket-ai",
    audience: process.env.JWT_AUDIENCE || "ticket-ai-client",
  });
}

export function getCookieOptions() {
  const secure =
    process.env.COOKIE_SECURE === "true" ||
    process.env.NODE_ENV === "production";

  // If you host client+server on different subdomains, you may need SameSite=None + Secure.
  const sameSite =
    process.env.COOKIE_SAMESITE || (secure ? "none" : "lax");

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
  };
}


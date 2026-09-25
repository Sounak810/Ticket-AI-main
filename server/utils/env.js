const REQUIRED = ["MONGO_URI", "JWT_SECRET"];
const REQUIRED_IF_INNGEST_ENABLED = ["INNGEST_EVENT_KEY", "INNGEST_SIGNING_KEY"];

export function requireEnv() {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  // Inngest keys are only required when the integration is enabled.
  if (process.env.INNGEST_ENABLED !== "false") {
    const missingInngest = REQUIRED_IF_INNGEST_ENABLED.filter((k) => !process.env[k]);
    if (missingInngest.length) {
      throw new Error(
        `Missing required environment variables: ${missingInngest.join(
          ", "
        )}. Set INNGEST_ENABLED=false to disable Inngest.`
      );
    }
  }
}

export function getCorsOrigins() {
  const raw = process.env.CORS_ORIGINS || process.env.FRONTEND_ORIGIN || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}


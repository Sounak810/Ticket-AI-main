export function notFoundHandler(req, res, next) {
  res.status(404).json({ error: "Not Found" });
}

export function errorHandler(err, req, res, next) {
  const status = typeof err?.status === "number" ? err.status : 500;

  // Avoid leaking internals to clients; keep details in server logs only.
  if (status >= 500) {
    console.error("Unhandled error:", err);
  }

  res.status(status).json({
    error: status >= 500 ? "Internal Server Error" : err.message || "Request failed",
  });
}


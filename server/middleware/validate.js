import { z } from "zod";

export function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request body",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      });
    }
    req.body = parsed.data;
    next();
  };
}

export const zEmail = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .max(254);


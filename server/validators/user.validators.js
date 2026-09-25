import { z } from "zod";
import { zEmail } from "../middleware/validate.js";

export const signupBodySchema = z.object({
  email: zEmail,
  password: z.string().min(8).max(200),
  skills: z.array(z.string().trim().min(1).max(40)).max(50).optional().default([]),
});

export const loginBodySchema = z.object({
  email: zEmail,
  password: z.string().min(1).max(200),
});

export const updateUserBodySchema = z.object({
  email: zEmail,
  role: z.enum(["user", "moderator", "admin"]),
  skills: z.array(z.string().trim().min(1).max(40)).max(50).optional().default([]),
});


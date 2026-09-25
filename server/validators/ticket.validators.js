import { z } from "zod";

export const createTicketBodySchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(3).max(10_000),
});

export const updateTicketStatusBodySchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
  resolutionNotes: z.string().trim().max(20_000).optional().default(""),
});

export const updateAiAnswerBodySchema = z.object({
  aiAnswer: z.string().trim().max(20_000),
});


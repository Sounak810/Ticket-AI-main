import express from "express";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
	createTicket,
	generateAiAnswer,
	getTicket,
	getTickets,
	updateAiAnswer,
	updateTicketStatus,
} from "../controllers/ticket.controller.js";
import {
  createTicketBodySchema,
  updateAiAnswerBodySchema,
  updateTicketStatusBodySchema,
} from "../validators/ticket.validators.js";

const router = express.Router();

router.get("/", authenticate, getTickets);
router.get("/:id", authenticate, getTicket);
router.post("/", authenticate, validateBody(createTicketBodySchema), createTicket);
router.post("/:id/answer-with-ai", authenticate, generateAiAnswer);
router.patch("/:id/ai-answer", authenticate, validateBody(updateAiAnswerBodySchema), updateAiAnswer);
router.patch("/:id/status", authenticate, validateBody(updateTicketStatusBodySchema), updateTicketStatus);

export default router;
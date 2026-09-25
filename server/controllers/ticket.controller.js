import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.model.js";
import analyzeTicket from "../utils/api.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTicket = await Ticket.create({
      title,
      description,
      createdBy: req.user.id,
    });

    if (process.env.INNGEST_ENABLED !== "false") {
      await inngest.send({
        name: "ticket/created",
        data: {
          ticketId: newTicket._id.toString(),
          title,
          description,
          createdBy: req.user.id,
        },
      });
    }

    return res.status(201).json({
      message: "Ticket created and processing started",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];
    if (user.role !== "user") {
      tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ createdBy: user.id })
        .select("title description status createdAt")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTicket = async (req, res) => {
  try {
    const user = req.user;
    let ticket;

    if (user.role !== "user") {
      ticket = await Ticket.findById(req.params.id).populate("assignedTo", [
        "email",
        "_id",
      ]);
    } else {
      ticket = await Ticket.findOne({
        createdBy: user.id,
        _id: req.params.id,
      }).select(
        "title description status createdAt priority aiAnswer helpfulNotes relatedSkills resolutionNotes"
      );
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { status, resolutionNotes } = req.body;

    if (!["moderator", "admin"].includes(role)) {
      return res.status(403).json({ message: "Only moderator/admin can update status" });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (
      role === "moderator" &&
      (!ticket.assignedTo || ticket.assignedTo.toString() !== userId)
    ) {
      return res.status(403).json({ message: "Moderator can only update assigned tickets" });
    }

    ticket.status = status;
    ticket.resolutionNotes = resolutionNotes;

    const updatedTicket = await ticket.save();
    return res.status(200).json({
      message: "Ticket status updated",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating ticket status", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const generateAiAnswer = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can generate AI answers" });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const aiResponse = await analyzeTicket(ticket);

    ticket.aiAnswer = aiResponse.answerForUser || ticket.aiAnswer;
    ticket.priority = !["low", "medium", "high"].includes(aiResponse.priority)
      ? ticket.priority || "medium"
      : aiResponse.priority;
    ticket.helpfulNotes = aiResponse.helpfulNotes || ticket.helpfulNotes;
    ticket.relatedSkills = Array.isArray(aiResponse.relatedSkills)
      ? aiResponse.relatedSkills
      : ticket.relatedSkills;
    if (ticket.status === "TODO") {
      ticket.status = "IN_PROGRESS";
    }

    const updatedTicket = await ticket.save();
    return res.status(200).json({
      message: "AI answer generated",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error generating AI answer", error.message);
    return res.status(502).json({
      message: "AI generation failed",
      detail: error.message,
    });
  }
};

export const updateAiAnswer = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can edit AI answers" });
    }

    const { aiAnswer } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.aiAnswer = aiAnswer;
    const updatedTicket = await ticket.save();

    return res.status(200).json({
      message: "AI answer updated",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating AI answer", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 140 },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 10_000,
  },
  status: {
    type: String,
    enum: ["TODO", "IN_PROGRESS", "RESOLVED", "CLOSED"],
    default: "TODO",
    index: true,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    index: true,
  },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium", index: true },
  deadline: Date,
  aiAnswer: { type: String, trim: true, maxlength: 20_000, default: "" },
  helpfulNotes: { type: String, trim: true, maxlength: 40_000, default: "" },
  resolutionNotes: { type: String, trim: true, maxlength: 20_000, default: "" },
  relatedSkills: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Ticket", ticketSchema);

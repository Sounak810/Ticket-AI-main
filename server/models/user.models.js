import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 254,
  },
  password: { type: String, required: true, minlength: 8, maxlength: 200 },
  role: {
    type: String,
    default: "user",
    enum: ["user", "moderator", "admin"],
    index: true,
  },
  skills: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);

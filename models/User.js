// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: "" },
    // CHANGE: store references to Skill documents
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill", default: [] }],
    github: { type: String },
    resume: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

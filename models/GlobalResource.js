import mongoose from "mongoose";

const globalResourceSchema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,   // 🔥 auto normalize
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    docsLinks: [
      {
        label: String,
        url: String,
      },
    ],

    videoLinks: [
      {
        label: String,
        url: String,
        duration: String,
      },
    ],

    projects: [
      {
        title: String,
        description: String,
      },
    ],

    // 🔥 GLOBAL CATEGORY (NO ENUM)
    category: {
      type: String,
      default: "general",
      trim: true,
      lowercase: true,
    },

    // Controlled enum (safe)
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
      lowercase: true,
    },

    estimatedHours: Number,

    tags: {
      type: [String],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("GlobalResource", globalResourceSchema);

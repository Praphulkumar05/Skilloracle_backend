import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // helps search
    },

    skill:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Skill",
      required:true,
    },
    title: {
      type: String,
      required: true, // e.g. "Node.js Complete Guide"
    },

    description: {
      type: String,
      required: true,
    },

    docsLinks: [
      {
        label: String,   // e.g. "Official Docs"
        url: String,
      },
    ],

    videoLinks: [
      {
        label: String,    // e.g. "FreeCodeCamp Node.js"
        url: String,
        duration: String // e.g. "4h 30m"
      },
    ],

    projects: [
      {
        title: String,
        description: String,
      },
    ],

    category: {
      type: String,
      enum: ["Frontend", "Backend", "DevOps", "AI", "Cloud", "Database", "General"],
      default: "General",
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);

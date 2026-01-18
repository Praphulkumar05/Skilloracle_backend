import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    fileName: String,

    parsedData: Object, // raw Affinda response

    atsScore: Number,

    strengths: [String],
    weaknesses: [String],
    suggestions: [String],

    missingSkills: [String],

    aiProvider: {
      type: String,
      enum: ["gemini", "perplexity"],
      default: "gemini",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ResumeAnalysis", resumeAnalysisSchema);

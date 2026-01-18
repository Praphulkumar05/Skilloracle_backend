import mongoose from "mongoose";

const jobRoleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  requiredSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
  optionalSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],

  difficultyLevel: { type: Number, default: 3 }, // 1 = easy, 5 = very hard
  industryDemand: { type: Number, default: 5 }, // 1–10

  avgSalary: {
    min: Number,
    max: Number,
  }
}, { timestamps: true });

export default mongoose.model("JobRole", jobRoleSchema);

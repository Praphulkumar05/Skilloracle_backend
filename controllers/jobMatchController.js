import JobRole from "../models/JobRole.js";
import User from "../models/User.js";
import { calculateJobMatch } from "../utils/jobMatching.js";
import { generateAIRoadmap } from "../utils/aiRoadmapGenerator.js";

export const calculateMatchForRole = async (req, res) => {
  try {
    const { roleId } = req.body;
    const user = await User.findById(req.user.id).populate("skills");
    const role = await JobRole.findById(roleId).populate("requiredSkills optionalSkills");

    if (!user || !role)
      return res.status(404).json({ message: "User or Role not found" });

    const userSkills = user.skills.map((s) => s.name);

    const { score, missingSkills } = calculateJobMatch(role, userSkills);

    let aiRoadmap = [];
    if (missingSkills.length > 0) {
      aiRoadmap = await generateAIRoadmap(missingSkills);
    }

    return res.json({
      role: role.title,
      score,
      missingSkills,
      aiRoadmap: aiRoadmap || [],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

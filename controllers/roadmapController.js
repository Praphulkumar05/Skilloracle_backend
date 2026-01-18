import User from "../models/User.js";
import JobRole from "../models/JobRole.js";
import Resource from "../models/Resource.js";
import { calculateJobMatch } from "../utils/jobMatching.js";

export const generateRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("skills");
    if (!user) return res.status(404).json({ message: "User not found" });

    const userSkillIds = user.skills.map(s => s._id.toString());

    // 1. Find best matched job
    const jobRoles = await JobRole.find()
      .populate("requiredSkills optionalSkills");

    let bestRole = null;
    let highestScore = -999;

    jobRoles.forEach(role => {
      const score = calculateJobMatch(role, userSkillIds);
      if (score > highestScore) {
        highestScore = score;
        bestRole = role;
      }
    });

    if (!bestRole)
      return res.status(404).json({ message: "No job roles found" });

    // 2. Identify missing skills
    const missingSkills = bestRole.requiredSkills.filter(
      skill => !userSkillIds.includes(skill._id.toString())
    );

    // 3. Fetch learning resources for missing skills
    const resources = await Resource.find({
      skill: { $in: missingSkills.map(s => s._id) }
    });

    // 4. Create roadmap steps
    const roadmap = missingSkills.map(skill => ({
      skill: skill.name,
      resources: resources.filter(r => r.skill.toString() === skill._id.toString())
    }));

    return res.json({
      jobRole: bestRole.title,
      missingSkills: missingSkills.map(s => s.name),
      roadmap
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

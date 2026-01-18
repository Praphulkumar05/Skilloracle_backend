// backend/controllers/dashboardController.js
import User from "../models/User.js";
import UserSkill from "../models/Skill.js";
import JobRole from "../models/JobRole.js";
import Resource from "../models/Resource.js";
import { calculateJobMatch } from "../utils/jobMatching.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    /* =========================
       1. USER BASIC INFO
    ========================== */
    const user = await User.findById(userId).select("name targetRole");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* =========================
       2. USER SKILLS
    ========================== */
    const userSkillsDocs = await UserSkill.find({ user: userId }).populate("skill");
    const userSkills = userSkillsDocs.map((us) => us.skill.name);

    /* =========================
       3. JOB MATCHES (TOP 3)
    ========================== */
    const jobRoles = await JobRole.find()
      .populate("requiredSkills optionalSkills")
      .limit(10);

    const matches = jobRoles.map((role) => {
      const result = calculateJobMatch(role, userSkills);
      return {
        roleId: role._id,
        title: role.title,
        score: result.score,
      };
    });

    const topJobMatches = matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    /* =========================
       4. READINESS SCORE
       (average of top matches)
    ========================== */
    const readinessScore =
      topJobMatches.length > 0
        ? Math.round(
            topJobMatches.reduce((sum, r) => sum + r.score, 0) /
              topJobMatches.length
          )
        : 0;

    /* =========================
       5. GLOBAL RESOURCES
       (Admin uploaded)
    ========================== */
    const resources = await Resource.find()
      .populate("skill", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedResources = resources.map((r) => ({
      id: r._id,
      title: r.title,
      url: r.url,
      skill: r.skill?.name || "General",
    }));

    /* =========================
       FINAL RESPONSE
    ========================== */
    res.json({
      user: {
        name: user.name,
        targetRole: user.targetRole || "Not set",
      },

      readinessScore,

      skillSummary: {
        total: userSkills.length,
        skills: userSkills,
      },

      topJobMatches,

      resources: formattedResources,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

import User from "../models/User.js";
import JobRole from "../models/JobRole.js";
import Skill from "../models/Skill.js";
import Resource from "../models/Resource.js";

export const getAdminDashboardStats = async (req, res) => {
  try {
    /* ============================
       COUNTS
    ============================ */
    const [
      totalUsers,
      totalJobRoles,
      totalSkills,
      totalResources
    ] = await Promise.all([
      User.countDocuments(),
      JobRole.countDocuments(),
      Skill.countDocuments(),
      Resource.countDocuments(),
    ]);

    /* ============================
       RECENT DATA
    ============================ */
    const recentUsers = await User.find()
      .select("name email createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentJobRoles = await JobRole.find()
      .select("title createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    /* ============================
       RESPONSE
    ============================ */
    res.json({
      success: true,

      stats: {
        totalUsers,
        totalJobRoles,
        totalSkills,
        totalResources,
      },

      recent: {
        users: recentUsers,
        jobRoles: recentJobRoles,
      },
    });

  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard data",
    });
  }
};

import User from "../models/User.js";
import UserSkill from "../models/Skill.js"; // if you store skills separately

export const getAllUsersForAdmin = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email createdAt")
      .sort({ createdAt: -1 });

    // attach skills count per user
    const usersWithSkills = await Promise.all(
      users.map(async (user) => {
        const skillCount = await UserSkill.countDocuments({
          user: user._id,
        });

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          skills: skillCount,
        };
      })
    );

    res.json({
      success: true,
      users: usersWithSkills,
    });
  } catch (error) {
    console.error("ADMIN USERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// backend/controllers/userSkillController.js
import User from "../models/User.js";
import Skill from "../models/Skill.js";
import mongoose from "mongoose";

// Get current user's skills (populate)
export const getUserSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("skills", "name category description");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, skills: user.skills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Admin — grouped view of all users and their skills
export const adminGetGroupedSkills = async (req, res) => {
  try {
    const users = await User.find()
      .populate("skills", "name")
      .select("name skills");

    const grouped = {};

    users.forEach(user => {
      grouped[user.name] = user.skills.map(skill => skill.name);
    });

    res.json({ success: true, grouped });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addUserSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    const userId = req.user._id;

    if (!skill || !skill.trim()) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    const skillName = skill.trim();

    // Find or create skill
    let existingSkill = await Skill.findOne({ name: skillName });
    if (!existingSkill) {
      existingSkill = await Skill.create({ name: skillName });
    }
    const skillId = existingSkill._id;

    // Load user
    const user = await User.findById(userId);

    // 💥 THIS IS THE FIX – ensure user.skills always exists
    if (!Array.isArray(user.skills)) {
      user.skills = [];
    }

    // Check duplicates safely
    if (user.skills.some(id => id.toString() === skillId.toString())) {
      return res.status(400).json({ message: "Skill already added" });
    }

    // Add skill
    user.skills.push(skillId);
    await user.save();

    const updatedUser = await User.findById(userId).populate("skills", "name");

    res.json({
      message: "Skill added successfully",
      skills: updatedUser.skills,
    });

  } catch (error) {
    console.error("ADD_USER_SKILL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// Remove skill (user)
export const removeUserSkill = async (req, res) => {
  try {
    const skillId = req.params.skillId;
    const userId = req.user._id;

    const user = await User.findById(userId);

    user.skills = user.skills.filter(
      (id) => id.toString() !== skillId.toString()
    );

    await user.save();

    const updated = await User.findById(userId).populate("skills", "name");

    res.json({
      message: "Skill removed",
      skills: updated.skills,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ----------------- ADMIN endpoints ------------------ */

// Admin — view all users + their skills
export const getAllUserSkills = async (req, res) => {
  try {
    const users = await User.find()
      .populate("skills", "name category description")
      .select("name email skills");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — remove a skill from a specific user
export const adminRemoveUserSkill = async (req, res) => {
  try {
    const { userId, skillId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(skillId))
      return res.status(400).json({ message: "Invalid IDs" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.skills = user.skills.filter((s) => String(s) !== String(skillId));
    await user.save();

    const populated = await user.populate("skills", "name category description");
    res.json({ success: true, message: "Skill removed from user", skills: populated.skills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

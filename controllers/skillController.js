// backend/controllers/skillController.js
import Skill from "../models/Skill.js";

// Create skill (Admin)
export const createSkill = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    if (!name) return res.status(400).json({ message: "Skill name is required" });

    const exists = await Skill.findOne({ name });
    if (exists) return res.status(400).json({ message: "Skill already exists" });

    const skill = await Skill.create({ name, category, description });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all skills (Admin)
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single skill (Admin)
export const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update skill (Admin)
export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete skill (Admin)
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    // Optionally remove skill references from users — admin may want that behavior
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

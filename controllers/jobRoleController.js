import JobRole from "../models/JobRole.js";
import Skill from "../models/Skill.js";

// Normalize skill names (same logic used for users)
function normalizeSkill(str) {
  return str.trim().replace(/\s+/g, " ").replace(/^./, c => c.toUpperCase());
}

// Convert comma-separated skills into Skill ObjectIds
async function processSkills(inputString) {
  if (!inputString || inputString.length === 0) return [];

  const names = inputString
    .split(",")
    .map(s => normalizeSkill(s))
    .filter(s => s.length > 0);

  const skillIds = [];

  for (let name of names) {
    let skill = await Skill.findOne({ name });
    if (!skill) {
      skill = await Skill.create({ name });
    }
    skillIds.push(skill._id);
  }

  return skillIds;
}

/* ---------------------------------------------------
   CREATE JOB ROLE (ADMIN)
--------------------------------------------------- */
export const createJobRole = async (req, res) => {
  try {
    const {
      title,
      description,
      requiredSkills,
      optionalSkills,
      difficultyLevel,
      industryDemand,
      avgSalary,
    } = req.body;

    const requiredSkillIds = await processSkills(requiredSkills);
    const optionalSkillIds = await processSkills(optionalSkills);

    const jobRole = await JobRole.create({
      title,
      description,
      requiredSkills: requiredSkillIds,
      optionalSkills: optionalSkillIds,
      difficultyLevel,
      industryDemand,
      avgSalary,
    });

    res.status(201).json(jobRole);
  } catch (err) {
    console.log("ERROR creating job role:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/* ---------------------------------------------------
   GET ALL JOB ROLES
--------------------------------------------------- */
export const getJobRoles = async (req, res) => {
  try {
    const roles = await JobRole.find()
      .populate("requiredSkills optionalSkills");
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ---------------------------------------------------
   GET SINGLE JOB ROLE
--------------------------------------------------- */
export const getJobRoleById = async (req, res) => {
  try {
    const role = await JobRole.findById(req.params.id)
      .populate("requiredSkills optionalSkills");

    if (!role) return res.status(404).json({ message: "Job Role not found" });

    res.json(role);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ---------------------------------------------------
   UPDATE JOB ROLE (ADMIN)
--------------------------------------------------- */
export const updateJobRole = async (req, res) => {
  try {
    const updated = await JobRole.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Job Role not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ---------------------------------------------------
   DELETE JOB ROLE (ADMIN)
--------------------------------------------------- */
export const deleteJobRole = async (req, res) => {
  try {
    const deleted = await JobRole.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Job Role not found" });

    res.json({ message: "Job Role deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

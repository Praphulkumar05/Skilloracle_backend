// backend/routes/skillRoutes.js
import express from "express";
import {
  createSkill,
  getSkills,
  deleteSkill,
  updateSkill,
  getSkillById,
} from "../controllers/skillController.js";

import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// ADMIN — GLOBAL SKILLS
router.get("/", adminAuth, getSkills);
router.post("/", adminAuth, createSkill);
router.put("/:id", adminAuth, updateSkill);
router.delete("/:id", adminAuth, deleteSkill);
router.get("/:id", adminAuth, getSkillById);

export default router;

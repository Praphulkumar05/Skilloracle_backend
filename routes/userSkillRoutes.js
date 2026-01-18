// backend/routes/userSkillRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminAuth } from "../middleware/adminAuth.js";

import {
  getUserSkills,
  addUserSkill,
  removeUserSkill,
  getAllUserSkills,
  adminRemoveUserSkill,
  adminGetGroupedSkills   // <-- Make sure this is added
} from "../controllers/userSkillController.js";



const router = express.Router();

// User – manage own skills
router.get("/", protect, getUserSkills);
router.post("/add", protect, addUserSkill);   // body: { skillId }
router.delete("/remove/:skillId", protect, removeUserSkill);
// Admin – grouped skills like { John: ["React"], Amit: ["Node"] }
router.get("/admin/grouped", adminAuth, adminGetGroupedSkills);


// Admin – view all users + modify skills
router.get("/all", adminAuth, getAllUserSkills);
router.delete("/admin/:userId/skill/:skillId", adminAuth, adminRemoveUserSkill);

export default router;

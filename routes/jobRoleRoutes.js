import express from "express";
import {
  createJobRole,
  getJobRoles,
  getJobRoleById,
  updateJobRole,
  deleteJobRole
} from "../controllers/jobRoleController.js";

import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// PUBLIC (user sees roles)
router.get("/", getJobRoles);
router.get("/:id", getJobRoleById);

// ADMIN ONLY
router.post("/", adminAuth, createJobRole);
router.put("/:id", adminAuth, updateJobRole);
router.delete("/:id", adminAuth, deleteJobRole);

export default router;

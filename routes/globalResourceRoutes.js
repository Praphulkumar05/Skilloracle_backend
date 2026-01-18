import express from "express";
import {
  createGlobalResource,
  updateGlobalResource,
  deleteGlobalResource,
  getAllGlobalResources,
  getSingleGlobalResource,
} from "../controllers/globalResourceController.js";

import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Admin only
router.post("/", protectAdmin, createGlobalResource);
router.put("/:id", protectAdmin, updateGlobalResource);
router.delete("/:id", protectAdmin, deleteGlobalResource);

// Public
router.get("/", getAllGlobalResources);
router.get("/:id", getSingleGlobalResource);

export default router;

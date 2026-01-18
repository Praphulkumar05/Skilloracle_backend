import express from "express";
import { getAdminDashboardStats } from "../controllers/adminDashboardController.js";
import adminProtect from "../middleware/adminProtect.js";

const router = express.Router();

// ✅ ADMIN-SPECIFIC ROUTE (NO COLLISION)
router.get("/admin-overview", adminProtect, getAdminDashboardStats);

export default router;

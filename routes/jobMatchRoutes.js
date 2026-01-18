import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { calculateMatchForRole } from "../controllers/jobMatchController.js";

const router = express.Router();

router.post("/calculate", protect, calculateMatchForRole);

export default router;

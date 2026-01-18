import express from "express";
import upload from "../middleware/resumeUpload.js";
import { analyzeResume } from "../controllers/resumeAnalysisController.js";

const router = express.Router();

router.post(
  "/analyze",
  upload.single("resume"),
  analyzeResume
);

export default router;

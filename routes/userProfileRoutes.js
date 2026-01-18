import express from "express";
import {
  getProfile,
  upsertProfile,
  uploadProfileImage,
  uploadResume,
} from "../controllers/userProfileController.js";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", protect, getProfile);
router.put("/", protect, upsertProfile);
router.post("/profile-image", protect, upload.single("image"), uploadProfileImage);
router.post("/resume", protect, upload.single("resume"), uploadResume);


export default router;

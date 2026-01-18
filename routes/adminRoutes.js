import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  adminRegister,
  adminLogin,
  adminLogout,
  adminProfile,
} from "../controllers/adminAuthController.js";

const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.get("/profile", adminAuth, adminProfile);
router.post("/logout", adminAuth, adminLogout);

export default router;

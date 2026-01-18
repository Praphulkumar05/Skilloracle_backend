import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/userAuthController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, (req, res) => res.json(req.user));

export default router;

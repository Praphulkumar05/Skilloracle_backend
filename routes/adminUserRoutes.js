import express from "express";
import { getAllUsersForAdmin } from "../controllers/adminUserController.js";
import adminProtect from "../middleware/adminProtect.js";

const router = express.Router();

// GET all users (ADMIN)
router.get("/", adminProtect, getAllUsersForAdmin);

export default router;

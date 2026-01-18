import express from "express";
import {
  createResource,
  updateResource,
  deleteResource,
  getAllResources,
  getSingleResource,
} from "../controllers/resourceController.js";
import adminProtect from "../middleware/adminProtect.js";

const router = express.Router();

router.get("/", getAllResources);
router.get("/:id", getSingleResource);

router.post("/", adminProtect, createResource);
router.put("/:id", adminProtect, updateResource);
router.delete("/:id", adminProtect, deleteResource);

export default router;

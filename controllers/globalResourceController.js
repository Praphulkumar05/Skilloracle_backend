import GlobalResource from "../models/GlobalResource.js";

/* ================= ADMIN ================= */

// ✅ CREATE RESOURCE
export const createGlobalResource = async (req, res) => {
  try {
    const {
      skillName,
      title,
      description,
      category,
      level,
      docsLinks,
      videoLinks,
      projects,
      estimatedHours,
      tags,
    } = req.body;

    if (!skillName || !title || !description) {
      return res.status(400).json({
        message: "skillName, title and description are required",
      });
    }

    const resource = await GlobalResource.create({
      skillName,
      title,
      description,
      category,
      level,
      docsLinks,
      videoLinks,
      projects,
      estimatedHours,
      tags,
      createdBy: req.admin.id,
    });

    res.status(201).json(resource);
  } catch (err) {
    console.error("ADD RESOURCE ERROR:", err);
    res.status(500).json({
      message: "Failed to create resource",
      error: err.message,
    });
  }
};

// ✅ UPDATE
export const updateGlobalResource = async (req, res) => {
  try {
    const updated = await GlobalResource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// ✅ DELETE
export const deleteGlobalResource = async (req, res) => {
  try {
    await GlobalResource.findByIdAndDelete(req.params.id);
    res.json({ message: "Resource deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

/* ================= USER + ADMIN ================= */

// GET ALL
export const getAllGlobalResources = async (req, res) => {
  try {
    const resources = await GlobalResource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE
export const getSingleGlobalResource = async (req, res) => {
  try {
    const resource = await GlobalResource.findById(req.params.id);
    res.json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import GlobalResource from "../models/GlobalResource.js";


/* ================= ADMIN ================= */

// ✅ CREATE RESOURCE
export const createResource = async (req, res) => {
  try {
    const resource = await GlobalResource.create({
      ...req.body,
      createdBy: req.admin.id,
    });
    res.status(201).json(resource);
  } catch (err) {
    console.error("ADD RESOURCE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateResource = async (req, res) => {
  try {
    const updated = await GlobalResource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    await GlobalResource.findByIdAndDelete(req.params.id);
    res.json({ message: "Resource deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= USER ================= */

export const getAllResources = async (req, res) => {
  try {
    const resources = await GlobalResource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSingleResource = async (req, res) => {
  try {
    const resource = await GlobalResource.findById(req.params.id);
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

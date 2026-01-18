import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

export const adminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    admin = await Admin.create({ email, password: hashed });

    const token = generateToken(admin._id, true);

    res.status(201).json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        isAdmin: true,
      },
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(admin._id, true);

    res.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        isAdmin: true,
      },
      token,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminLogout = (req, res) => {
  res.json({ success: true, message: "Admin logged out" });
};

export const adminProfile = async (req, res) => {
  try {
    res.json(req.admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

      // JWT with isAdmin = false
    const token = generateToken(user._id, false);

    res.status(201).json({
      success: true,
      user: { 
        id: user._id,
        name: user.name,
        email: user.email
      },
      token,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = generateToken(user._id, false);

    res.json({
      success: true,
      user: { 
        id: user._id,
        name: user.name,
        email: user.email 
      },
      token,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logoutUser = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

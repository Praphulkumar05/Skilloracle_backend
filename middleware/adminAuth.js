import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const adminAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer "))
      return res.status(401).json({ message: "Admin not authorized" });

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin)
      return res.status(403).json({ message: "Not admin" });

    req.admin = await Admin.findById(decoded.id).select("-password");
    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

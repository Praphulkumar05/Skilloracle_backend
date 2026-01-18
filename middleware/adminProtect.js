import jwt from "jsonwebtoken";

const adminProtect = (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Only check admin flag
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Admin access only" });
    }

    // Attach decoded admin info
    req.admin = decoded;

    next();
  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default adminProtect;

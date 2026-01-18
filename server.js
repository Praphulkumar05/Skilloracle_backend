// ✅ Load environment variables FIRST (ESM-safe)
import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";

// ✅ Initialize app
const app = express();

// ✅ Connect Database
connectDB();

// ✅ Global Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(helmet());

// ✅ Rate Limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200,
});
app.use(limiter);

// ✅ Routes (imports AFTER dotenv is loaded)
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import jobRoleRoutes from "./routes/jobRoleRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import jobMatchRoutes from "./routes/jobMatchRoutes.js";
import userSkillsRoutes from "./routes/userSkillRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import resumeAnalysisRoutes from "./routes/resumeAnalysisRoutes.js";

// ✅ Cloudinary init (env is already loaded)
import cloudinary, { initCloudinary } from "./config/cloudinary.js";
initCloudinary();

// ✅ Register Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/job-roles", jobRoleRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/job-match", jobMatchRoutes);
app.use("/api/user/skills", userSkillsRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/resume", resumeAnalysisRoutes);

// ✅ Health Check (optional but useful)
app.get("/", (req, res) => {
  res.send("🚀 Career Roadmap Backend Running");
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

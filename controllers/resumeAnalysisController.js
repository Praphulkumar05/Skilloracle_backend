import axios from "axios";
import FormData from "form-data";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import { analyzeResumeWithPerplexity } from "../services/perplexityService.js";

export const analyzeResume = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user?._id || null; // ✅ FIX

    if (!file) {
      return res.status(400).json({ message: "Resume file required" });
    }

    // 1️⃣ Send resume to Affinda
    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);

    const affindaRes = await axios.post(
      "https://api.affinda.com/v2/resumes",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.AFFINDA_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    const parsedResume = affindaRes.data;

    // 2️⃣ Extract text summary for AI
    const resumeText = JSON.stringify(parsedResume, null, 2);
    const aiResult = await analyzeResumeWithPerplexity(resumeText);

    // 3️⃣ Save to DB
    const analysis = await ResumeAnalysis.create({
      user: userId, // ✅ now safe
      fileName: file.originalname,
      parsedData: parsedResume,
      ...aiResult,
      aiProvider: "perplexity",
    });

    res.json({
      success: true,
      analysis: {
        atsScore: analysis.atsScore,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions,
        missingSkills: analysis.missingSkills,
        createdAt: analysis.createdAt,
      },
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Resume analysis failed" });
  }
};

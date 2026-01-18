import axios from "axios";

export const analyzeResumeWithGemini = async (resumeText) => {
  const prompt = `
You are an ATS (Applicant Tracking System) resume expert.

Analyze the following resume data and return the response STRICTLY in JSON format with the following keys:

{
  "atsScore": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "missingSkills": string[],
  "suggestions": string[]
}

Rules:
- Be concise and actionable
- Focus on ATS optimization
- Assume the candidate is applying for tech roles
- Do not include explanations outside JSON

Resume Data:
${resumeText}
`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }
  );

  const textResponse =
    response.data.candidates[0].content.parts[0].text;

  // Gemini sometimes returns markdown → clean it
  const cleanText = textResponse
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanText);
};

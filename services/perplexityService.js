import axios from "axios";

export const analyzeResumeWithPerplexity = async (resumeText) => {
  const prompt = `
You are an ATS (Applicant Tracking System) resume expert.

Analyze the resume data below and return STRICT JSON in this format:

{
  "atsScore": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "missingSkills": string[],
  "suggestions": string[]
}

Rules:
- Focus on ATS optimization
- Be concise and practical
- Assume tech job roles
- DO NOT add any explanation outside JSON

Resume Data:
${resumeText}
`;

  const response = await axios.post(
    "https://api.perplexity.ai/chat/completions",
    {
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content: "You are a professional ATS resume analyzer.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const content = response.data.choices[0].message.content;

  // Ensure clean JSON
  const clean = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(clean);
};

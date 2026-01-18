export const generateAIRoadmap = async (missingSkills = []) => {
  if (!missingSkills.length) return "You're fully qualified! 🎉";

  try {
    const prompt = `
Generate a detailed learning roadmap for these skills:  
${missingSkills.join(", ")}

Format EXACTLY like this:

Skill Name:
 - Video: (YouTube link)
 - Course: (Udemy / Coursera / FreeCodeCamp link)
 - Docs: (Official documentation)
 - Practice: (2–3 tasks)

Keep the output structured and clean.
`;

    const payload = {
      model: "sonar-pro",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1200,
    };

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Perplexity API Error:", data);
      return "AI failed to generate roadmap. Try again later.";
    }

    return data.choices?.[0]?.message?.content || "AI response unavailable";

  } catch (err) {
    console.error("AI Roadmap Error:", err);
    return "AI service unavailable at this moment.";
  }
};

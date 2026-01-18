import axios from "axios";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-pro",

        messages: [
          {
            role: "system",
            content:
              "You are an AI career coach. Answer clearly and concisely.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY_SEC}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;

    res.status(200).json({ reply: aiReply });
  } catch (error) {
    console.error("AI Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI service failed" });
  }
};

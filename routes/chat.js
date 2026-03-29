const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  console.log("Message received:", req.body.message);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: req.body.message }
      ]
    });

    console.log("AI reply:", response.choices[0].message.content);

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ reply: "Error occurred" });
  }
});

module.exports = router;
// server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // only if needed for calling OpenAI API

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve all frontend files from the "public" folder
app.use(express.static("public"));

// 🧠 Example route to handle chatbot requests
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong with the AI service." });
  }
});

// ✅ Default route for all other requests (important for SPA)
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    });
    res.json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Error: Could not get response" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

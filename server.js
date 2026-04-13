import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

const ALLOWED_ORIGINS = [
  "https://punewindows.com",
  "https://www.punewindows.com",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      res.status(400).json({
        error: "A non-empty 'question' field is required."
      });
      return;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Rollwin Assistant for PuneWindows.com.

You help customers with:
- Aluminium sliding windows and doors
- Glass partitions
- Sound dampening windows
- 12mm glass as an economical sound-control option
- Roofing solutions including glass, polycarbonate, and Tata Durashine

Business strengths:
- Since 1992
- Premium quality
- Strong after-sales service

Rules:
- Be polite and professional
- Do not give exact final quotations
- Encourage site visit or measurement for exact pricing
- When relevant, suggest the customer share contact number`
        },
        {
          role: "user",
          content: question.trim()
        }
      ]
    });

    const reply = completion.choices[0]?.message?.content ?? "";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

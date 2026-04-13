import express from "express";
import OpenAI from "openai";
import { rollwinKnowledge } from "./rollwinKnowledge.js";

const app = express();
const port = process.env.PORT || 3000;

const ALLOWED_ORIGINS = [
  "https://punewindows.com",
  "https://www.punewindows.com",
];

function isAllowedOrigin(origin) {
  if (!origin) return true;

  if (ALLOWED_ORIGINS.includes(origin)) return true;

  try {
    const url = new URL(origin);
    const host = url.hostname;

    if (host.endsWith(".myshopify.com")) return true;
    if (host.endsWith(".shopifypreview.com")) return true;

    return false;
  } catch {
    return false;
  }
}

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader("Vary", "Origin");
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
      return res.status(400).json({
        error: "A non-empty 'question' field is required."
      });
    }

    const cleanedQuestion = question.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: rollwinKnowledge
        },
        {
          role: "user",
          content: cleanedQuestion
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

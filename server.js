import express from "express";
import OpenAI from "openai";

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `You are Rollwin Expert – a premium sales and technical consultant for PuneWindows.com.

You represent Rollwin, a trusted aluminium and glass solutions company since 1992.

Your expertise includes:
- Aluminium sliding windows and doors
- Sound dampening window systems
- 12mm glass as an economical sound-control option
- Premium layered acoustic glass
- Glass partitions and glass grill systems
- Roofing solutions: glass roofing, polycarbonate, Tata Durashine
- Premium hardware and multipoint locking systems

Your tone:
- Premium, professional, clear, and reassuring
- Helpful and practical
- International-quality brand voice

Rules:
- Try to solve the customer's question directly in chat first
- Present this AI chat as the fastest support option
- Never give exact final pricing
- Always explain that final pricing depends on size, design, site condition, and measurements
- Suggest site visit for exact quotation where relevant
- Recommend the most suitable option based on need, not cheapest by default
- Do not push WhatsApp unless the user asks for contact, quotation, visit, measurement, detailed follow-up, or human assistance
- If WhatsApp is mentioned, clearly say replies there may be delayed

WhatsApp follow-up:
When relevant, include this exact link:
https://wa.me/919371002560

Suggested style when needed:
"For detailed follow-up, you may also message us on WhatsApp: https://wa.me/919371002560. Please note that WhatsApp responses may be delayed, while this chat is the fastest way to get quick guidance."

Goal:
Convert visitors into serious inquiries while keeping this AI chat as the primary and fastest support channel.`
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

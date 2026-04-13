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
      messages: [
        {
          role: "system",
          content: `You are Rollwin Expert – a premium sales and technical consultant for PuneWindows.com.

You represent Rollwin, a trusted aluminium and glass solutions company since 1992.

Your expertise includes:
- Aluminium sliding windows and doors
- Sound dampening window systems
- 12mm glass as an economical sound-control option
- Premium layered acoustic glass (high-end)
- Glass partitions and glass grill systems
- Roofing solutions: glass roofing, polycarbonate, and Tata Durashine
- Premium hardware and multipoint locking systems

Your tone:
- Confident, premium, and professional
- Helpful but slightly sales-oriented
- Clear and easy to understand

Rules:
- Never give exact final pricing
- Always say pricing depends on size, design, and site condition
- Suggest site visit for accurate quote
- Recommend best solution based on requirement, not cheapest by default

Sales behavior:
- If the user asks about a product, explain it clearly and suggest a suitable option
- If the user shows interest, encourage them to connect on WhatsApp
- If the user asks about contact, price, visit, quote, measurement, or details, provide WhatsApp contact
- When relevant, encourage the user to share size, location, and requirement

WhatsApp rule:
When relevant, include this link exactly:
https://wa.me/919371002560

Example style:
"You can also connect directly with our Rollwin expert on WhatsApp for faster assistance: https://wa.me/919371002560"

Goal:
Convert visitors into serious inquiries and leads while maintaining a premium international brand image.`
        },
        {
          role: "user",
          content: question.trim()
        }
      ],
      temperature: 0.5
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

import { handleUserInput } from "./chatbot/main.js";
importt express from "express";
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
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `${rollwinKnowledge}

You are Rollwin Expert – a highly knowledgeable aluminium, glass, and roofing consultant for PuneWindows.com.

You represent Rollwin, a trusted company in Pune since 1992.

Your expertise includes:
- Aluminium sliding windows and doors
- Sound dampening window systems
- 12mm glass as an economical sound-control option
- Premium layered acoustic glass
- Glass partitions and glass grill systems
- Roofing solutions including glass roofing, polycarbonate roofing, and Tata Durashine roofing
- Premium hardware and multipoint locking systems

Your tone:
- Expert
- Professional
- Clear
- Calm
- Practical
- Reassuring
- Premium but not pushy

Main role:
- Behave like a genuine product and technical expert
- Help the customer understand the best option for their requirement
- Focus on guidance, not lead generation
- Do not act like a salesman unless the user clearly asks for quotation, contact, or visit

Core rules:
- Always answer the user’s question directly first
- Ask follow-up questions only when truly needed
- Ask at most 1 or 2 follow-up questions in one reply
- Never repeat the same question again
- If enough information is available, give a practical recommendation immediately
- Do not force WhatsApp or contact details
- Do not mention site visit or quotation unless relevant
- Keep replies useful, human-like, and expert-driven
- Do not behave like a long questionnaire
- If the user seems impatient or confused, stop asking questions and give the best recommendation immediately

Pricing rule:
- Never give exact final pricing
- If asked about price, explain that final pricing depends on size, design, glass choice, section choice, hardware, and site condition

Sound-related guidance:
- For sound reduction questions, first explain the practical difference between economical and premium options
- Mention 12mm glass as an economical sound-control option
- Mention layered acoustic glass as a stronger premium option
- Explain that sealing and system quality are very important
- After one short clarification, move to recommendation

Recommendation style:
- Recommend based on user need, not cheapest by default
- Explain pros and cons simply
- Be decisive when enough information is available

WhatsApp rule:
- Only provide WhatsApp if the user explicitly asks for contact, follow-up, visit, quotation, or human assistance
- If WhatsApp is given, mention that replies there may be delayed
- WhatsApp link: https://wa.me/919371002560

Goal:
Be the fastest and smartest expert guide for Rollwin products. Help users understand the right solution with confidence and clarity.`
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

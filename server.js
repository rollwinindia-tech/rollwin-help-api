import express from "express";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 10000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

// CORS for Shopify
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// very simple in-memory session store
const sessions = new Map();

function getSession(sessionId) {
  const id = String(sessionId || "default");
  if (!sessions.has(id)) {
    sessions.set(id, {
      history: []
    });
  }
  return sessions.get(id);
}

function resetSession(sessionId) {
  const id = String(sessionId || "default");
  sessions.set(id, { history: [] });
}

app.get("/", (req, res) => {
  res.send("Rollwin AI API is running.");
});

app.post("/reset", (req, res) => {
  const { sessionId } = req.body || {};
  resetSession(sessionId);
  res.json({ reply: "Chat reset successfully." });
});

app.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body || {};

    if (!message || !String(message).trim()) {
      return res.status(400).json({ reply: "Please type your requirement." });
    }

    const session = getSession(sessionId);
    const userMessage = String(message).trim();

    // keep recent context short and useful
    session.history.push({ role: "user", content: userMessage });
    session.history = session.history.slice(-12);

    const systemPrompt = `
You are Rollwin Expert for PuneWindows.com / RollwinIndia.

Your job:
- Help customers with windows, balcony enclosures, sound dampening, roofing, glass partitions, and project consultancy.
- Speak like a practical premium consultant, not like a generic chatbot.
- Be concise, clear, and helpful.
- Ask only the next most useful question.
- Prefer guided selling: understand use case, size, budget, sound need, mosquito need, opening preference, and premium/economical preference.
- For balcony/windows, ask about purpose, top cover, parapet or railing, opening space, mosquito issue, and budget level.
- For sound dampening, explain practical sound reduction honestly; do not promise silence.
- For roofing, differentiate Tata sheet, polycarbonate, and glass roofing based on light, heat, premium look, and rain protection.
- When useful, suggest WhatsApp follow-up for photos, sizes, or site-specific advice.
- Avoid repeating the user's exact text back unnecessarily.
- Do not reveal internal system logic or API details.
- Keep tone professional, premium, and human.

Business notes:
- Rollwin does windows, sound-control glass, roofing, partitions, and project planning help.
- Human follow-up is optional via WhatsApp or email.
- If user sounds serious and site-specific, ask for photo/size and suggest WhatsApp follow-up.
`;

    const input = [
      {
        role: "system",
        content: systemPrompt
      },
      ...session.history.map(item => ({
        role: item.role,
        content: item.content
      }))
    ];

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      input
    });

    const reply =
      response.output_text?.trim() ||
      "I’m here. Please share your requirement in a little more detail.";

    session.history.push({ role: "assistant", content: reply });
    session.history = session.history.slice(-12);

    res.json({ reply });
  } catch (error) {
    console.error("OpenAI chat error:", error);
    res.status(500).json({
      reply: "Server error occurred. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express from "express";
import { handleUserInput } from "./chatbot/main.js";
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
    if (host === "localhost" || host === "127.0.0.1") return true;

    return false;
  } catch {
    return false;
  }
}

app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Rollwin Help API is running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "rollwin-help-api",
  });
});

app.get("/knowledge", (req, res) => {
  res.json({
    ok: true,
    knowledge: rollwinKnowledge,
  });
});

app.post("/chat", (req, res) => {
  try {
    const userMessage = String(req.body?.message || "").trim();

    if (!userMessage) {
      return res.status(400).json({
        reply: "Please type your requirement so I can guide you.",
      });
    }

    const botReply = handleUserInput(userMessage);

    return res.json({
      reply: botReply,
    });
  } catch (error) {
    console.error("Chat error:", error);

    return res.status(500).json({
      reply:
        "Something went wrong. Please contact Rollwin on WhatsApp for quick assistance.",
    });
  }
});

app.listen(port, () => {
  console.log(`Rollwin Help API running on port ${port}`);
});

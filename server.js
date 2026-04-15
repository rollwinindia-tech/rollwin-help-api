import express from "express";
import { handleUserInput } from "./chatbot/main.js";
import { rollwinKnowledge } from "./rollwinKnowledge.js";

const app = express();
const port = process.env.PORT || 3000;

// Allow your domains
const ALLOWED_ORIGINS = [
  "https://punewindows.com",
  "https://www.punewindows.com",
];

// CORS handling
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

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});


// ✅ ROOT TEST ROUTE (IMPORTANT)
app.get("/", (req, res) => {
  res.send("Rollwin Chatbot API is running 🚀");
});


// ✅ CHATBOT API
app.post("/chat", (req, res) => {
  try {
    const userMessage = req.body.message || "";

    if (!userMessage) {
      return res.json({
        reply: "Please tell me your requirement.",
      });
    }

    const botReply = handleUserInput(userMessage);

    res.json({
      reply: botReply,
    });
  } catch (error) {
    console.error("Chat error:", error);

    res.json({
      reply:
        "Something went wrong. Please contact Rollwin on WhatsApp.",
    });
  }
});


// Optional: knowledge route
app.get("/knowledge", (req, res) => {
  res.json(rollwinKnowledge);
});


// START SERVER
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

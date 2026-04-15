import express from "express";
import cors from "cors";
import { handleUserInput } from "./chatbot/main.js";

const app = express();

// ✅ VERY IMPORTANT: allow Shopify domain
app.use(cors({
  origin: "*", // (we can restrict later to punewindows.com)
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Rollwin API is running 🚀");
});

// Chat endpoint
app.post("/chat", (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message received." });
    }

    const reply = handleUserInput(message);

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error occurred." });
  }
});

// Render uses PORT
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

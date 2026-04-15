import express from "express";
import { handleUserInput } from "./chatbot/main.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Simple CORS without extra package
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.get("/", (req, res) => {
  res.send("Rollwin API is running 🚀");
});

app.get("/test", (req, res) => {
  res.send(`
    <h2>Rollwin Chat Test</h2>
    <input id="msg" placeholder="Type message" />
    <button onclick="send()">Send</button>
    <p id="reply"></p>

    <script>
      async function send() {
        const message = document.getElementById("msg").value;

        const res = await fetch("/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        });

        const data = await res.json();
        document.getElementById("reply").innerText = data.reply;
      }
    </script>
  `);
});

app.post("/chat", (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        reply: "Please type your requirement."
      });
    }

    const reply = handleUserInput(message);
    return res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({
      reply: "Server error occurred. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

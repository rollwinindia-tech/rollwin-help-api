import express from "express";
import { handleUserInput } from "./chatbot/main.js";
import { rollwinKnowledge } from "./rollwinKnowledge.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Rollwin Chatbot API is running");
});

app.get("/health", (req, res) => {
  res.json({
    ok: true
  });
});

app.get("/knowledge", (req, res) => {
  res.json(rollwinKnowledge);
});

app.post("/chat", (req, res) => {
  try {
    const userMessage = req.body?.message || "";

    if (!userMessage) {
      return res.json({
        reply: "Please tell me your requirement."
      });
    }

    const botReply = handleUserInput(userMessage);

    return res.json({
      reply: botReply
    });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({
      reply: "Something went wrong. Please contact Rollwin on WhatsApp."
    });
  }
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
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

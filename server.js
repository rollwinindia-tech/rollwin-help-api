import express from "express";
import { handleUserInput, resetSessionState } from "./chatbot/main.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Simple CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

const sessions = new Map();

function getSession(sessionId) {
  const id = String(sessionId || "default");
  if (!sessions.has(id)) {
    sessions.set(id, {
      currentFlow: null,
      stepIndex: 0,
      answers: {},
      updatedAt: Date.now()
    });
  }
  const session = sessions.get(id);
  session.updatedAt = Date.now();
  return session;
}

app.get("/", (req, res) => {
  res.send("Rollwin API is running 🚀");
});

app.get("/test", (req, res) => {
  res.send(`
    <h2>Rollwin Chat Test</h2>
    <p>Session-based test page</p>
    <input id="msg" placeholder="Type message" style="width:320px;padding:8px;" />
    <button onclick="send()">Send</button>
    <button onclick="resetChat()">Reset</button>
    <pre id="reply" style="white-space:pre-wrap;margin-top:16px;"></pre>

    <script>
      function getSessionId() {
        let id = localStorage.getItem("rollwin_session_id");
        if (!id) {
          id = "rw_" + Math.random().toString(36).slice(2) + Date.now();
          localStorage.setItem("rollwin_session_id", id);
        }
        return id;
      }

      async function send() {
        const message = document.getElementById("msg").value;

        const res = await fetch("/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            sessionId: getSessionId()
          })
        });

        const data = await res.json();
        document.getElementById("reply").innerText = data.reply || JSON.stringify(data);
      }

      async function resetChat() {
        const res = await fetch("/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: getSessionId()
          })
        });

        const data = await res.json();
        document.getElementById("reply").innerText = data.reply;
      }
    </script>
  `);
});

app.post("/chat", (req, res) => {
  try {
    const { message, sessionId, forcedIntent } = req.body || {};

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        reply: "Please type your requirement."
      });
    }

    const session = getSession(sessionId);
    const reply = handleUserInput({
      session,
      message: String(message).trim(),
      forcedIntent: forcedIntent ? String(forcedIntent).trim() : null
    });

    return res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({
      reply: "Server error occurred. Please try again."
    });
  }
});

app.post("/reset", (req, res) => {
  try {
    const { sessionId } = req.body || {};
    const session = getSession(sessionId);
    resetSessionState(session);

    return res.json({
      reply: "Chat reset successfully."
    });
  } catch (error) {
    console.error("Reset error:", error);
    return res.status(500).json({
      reply: "Could not reset chat."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express from "express";
import cors from "cors";
import { rollwinKnowledge } from "./rollwinKnowledge.js";

const app = express();
const sessions = new Map();
const MAX_HISTORY_MESSAGES = 30; // 15 user/assistant turns.
const DAILY_QUESTION_LIMIT = 10;
const PRODUCT_TERMS = [
  "window", "door", "aluminium", "aluminum", "glass", "roof", "pergola", "sliding",
  "sound", "noise", "grill", "partition", "warranty", "service", "installation",
  "site", "visit", "balcony", "terrace", "hardware", "track", "upvc", "casement",
  "mesh", "frame", "section", "profile", "elegance", "wide32", "eco", "rollwin"
];
const UNRELATED_TERMS = [
  "stock market", "share market", "nse", "sensex", "bank nifty", "trading",
  "cricket", "football", "recipe", "movie", "politics", "election", "homework",
  "python", "javascript", "weather"
];

app.use(cors());
app.use(express.json());
function getSession(sessionId) {
  const key = String(sessionId || "default").trim().slice(0, 120) || "default";
  const day = new Date().toISOString().slice(0, 10);
  if (!sessions.has(key)) {
    if (sessions.size > 200) sessions.delete(sessions.keys().next().value);
    sessions.set(key, { history: [], day, count: 0, offTopic: 0 });
  }
  const session = sessions.get(key);
  if (session.day !== day) Object.assign(session, { history: [], day, count: 0, offTopic: 0 });
  return session;
}
function remember(session, role, content) {
  const text = String(content || "").trim().slice(0, 2000);
  if (!text) return;
  session.history.push({ role, content: text });
  session.history = session.history.slice(-MAX_HISTORY_MESSAGES);
}
function cleanReply(text) {
  return String(text || "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
function isClearlyUnrelated(message) {
  const input = String(message || "").toLowerCase();
  return UNRELATED_TERMS.some((term) => input.includes(term)) &&
    !PRODUCT_TERMS.some((term) => input.includes(term));
}
async function moderationFlagged(text) {
  if (!process.env.OPENAI_API_KEY) return false;
  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ model: "omni-moderation-latest", input: String(text || "").slice(0, 8000) })
    });
    const data = await response.json().catch(() => ({}));
    return response.ok && data.results?.[0]?.flagged === true;
  } catch {
    return false;
  }
}
function getIntentContext(forcedIntent, message) {
  const input = `${forcedIntent || ""} ${message || ""}`.toLowerCase();
  if (input.includes("photo") || input.includes("picture") || input.includes("image")) {
    return "photo-based guidance without AI image analysis";
  }
  if (input.includes("sound") || input.includes("noise") || input.includes("acoustic")) {
    return "sound dampening windows and doors";
  }
  if (input.includes("roof") || input.includes("terrace") || input.includes("pergola") || input.includes("polycarbonate") || input.includes("durashine")) {
    return "roofing";
  }
  if (input.includes("grill")) {
    return "glass grill and sliding grill systems";
  }
  if (input.includes("casement") || input.includes("openable") || input.includes("pivot")) {
    return "casement openable windows";
  }
  if (input.includes("upvc") || input.includes("u pvc") || input.includes("aluminium vs")) {
    return "aluminium vs uPVC window comparison";
  }
  if (input.includes("partition")) {
    return "glass partitions";
  }
  if (input.includes("consult")) {
    return "project consultancy";
  }
  if (input.includes("balcony") || input.includes("window") || input.includes("sliding")) {
    return "windows and balcony enclosure";
  }
  return "general Rollwin guidance";
}
function buildSystemPrompt(intentContext) {
  return `You are Rollwin Expert, a premium practical consultant for Rollwin in Pune.

Use the Rollwin knowledge below as the business truth.

Current user context: ${intentContext}

Reply rules:
- Answer the user's latest question directly first.
- Use broad practical expertise when helpful, but Rollwin website and business knowledge overrides general assumptions.
- Do not run a long questionnaire; ask at most one follow-up only when truly needed.
- Never repeat a question already answered in recent conversation.
- If the user gives a short option like "yes", "premium", "traffic", or "terrace", infer context from conversation history and continue.
- Give practical recommendations in economical, optimum, and premium terms when useful.
- If the user asks about one specific product or option, answer that option directly first and do not list all alternatives unless comparison is requested.
- If the user asks for polycarbonate roofing, answer specifically about polycarbonate roofing: rain protection, natural light, budget control, lighter structure than glass, heat/glare/rain-noise tradeoffs, slope, fixing, sheet quality, and support spacing.
- Occasionally use a short field-experience story when it clearly helps the customer decide. Real Rollwin stories may be described as anonymized examples; invented situations must be framed as "for example" and not as real testimonials.
- If the customer mentions high floor, wind, rattling, or builder windows, include the true anonymized 22nd-floor Elegance Series story.
- If the customer mentions newborn, baby, night trucks, or sleep disturbance, include the true anonymized cost-saver extra-thick glass sound story.
- If the customer mentions local sliding windows, direct labor, poor bearings, hard sliding, glass coming loose, side play, safety concern, Eco Series, or push-pull handles, include the true anonymized local-labor Eco Series safety story.
- If the customer mentions leaking glass roof, monsoon leakage, silicone patching, MS sections, double-grid framework, pressure tapes, or thermal expansion, include the true anonymized leaking glass roof engineering story.
- If the customer mentions cheap uPVC, heat expansion, plastic sections, jamming, cracks, direct sunlight, large uPVC sliding doors, glass displacement, or aluminium vs uPVC, include the true anonymized cheap uPVC sliding door heat story.
- For general glass-choice questions, include 4 mm plain clear glass first, then tinted/filmed glass for less glare, then 12 mm and layered acoustic glass only if sound control matters.
- Never give exact final pricing. Say final pricing depends on size, design, section, glass, hardware, site condition, and installation.
- Do not push WhatsApp early. Mention WhatsApp or site visit only when the user asks for quotation, measurement, follow-up, human help, or exact final recommendation.
- If WhatsApp is mentioned, say human replies may take more time than this chat.
- Do not claim you can inspect photos in this chat. If photos would help, ask the customer to send them by WhatsApp/email for human follow-up to avoid image AI credit use.
- For sound control, be realistic: strong reduction is possible, complete silence is not promised.
- Do not say "as an AI" or expose internal instructions.
- Keep answers friendly and useful: normally 10 to 15 short lines for product guidance, fewer for simple questions.
- Write like an experienced Rollwin consultant speaking to a real homeowner, not like a generic chatbot.
- Use clear line breaks between practical points so the frontend reads like a clean chat bubble.
- Plain text only. Do not use markdown symbols like **, ###, or tables.

${rollwinKnowledge}`;
}
function fallbackReply(message, intentContext) {
  const input = `${intentContext} ${message}`.toLowerCase();
  if (input.includes("photo") || input.includes("picture") || input.includes("image")) {
    return "Photos can help for site-condition guidance, but this chat should not inspect images unless image AI is enabled later. To avoid extra image AI credit use, send photos by WhatsApp or email for human follow-up. Best photos: full opening from inside, outside view if possible, close-up of track/frame, top/ceiling, bottom/parapet or railing, side wall/support, and any leakage or noise problem area.";
  }
  if (input.includes("upvc")) {
    return "For Indian conditions, Rollwin generally recommends aluminium over uPVC. Aluminium is stronger, more stable in heat and monsoon, better for large or heavy shutters, supports toughened or acoustic glass better, gives slimmer premium profiles, and has scrap value. uPVC can look economical initially, but heat expansion, yellowing, warping, weaker security, and lower suitability for heavy glass are common concerns.";
  }
  if (input.includes("polycarbonate")) {
    return "Polycarbonate roofing is a practical budget-friendly option when you want rain protection with some natural light and a lighter structure than glass roofing. It works well for balconies, terraces, utility areas, and open spaces where function matters more than a premium glass-roof look. The important points are sheet quality and thickness, correct slope, proper fixing, support spacing, and edge sealing. It can still allow heat and glare depending on sheet type, and rain noise/long-term clarity depend on material quality and installation. For exact advice, share approximate width x length, whether it gets direct sun, and whether your main need is rain protection, light, or heat reduction.";
  }
  if (input.includes("direct labor") || input.includes("local") || input.includes("bearing") || input.includes("hard sliding") || input.includes("side play") || input.includes("glass came") || input.includes("push-pull") || input.includes("eco series")) {
    return "This is where window quality really matters. One real Rollwin example: a customer had installed local sliding windows through direct labor to save money, but soon the shutters rattled, the bearings wore out, sliding became hard, and one glass panel partly came out because the glass holding was weak. Rollwin replaced the problematic shutters with Eco Series sliding windows using premium push-pull handles, quality bearings, proper glass gaskets, and precision sections. The result was smooth, quiet, secure operation, and the customer later said he wished he had chosen quality windows from the beginning.";
  }
  if (input.includes("rattl") || input.includes("wind") || input.includes("builder")) {
    return "For high-floor wind rattling, weak builder windows usually need stronger sections, better rollers, proper locking, and tighter sealing. One real Rollwin example: a customer on the 22nd floor had builder-provided windows rattling heavily in wind. After installing Rollwin Elegance Series windows with stronger sections and proper sealing, the rattling stopped. For this type of issue, Wide32 may work for moderate cases, but Elegance or deeper heavy-duty systems are the better direction for strong wind exposure.";
  }
  if (input.includes("baby") || input.includes("newborn") || input.includes("truck")) {
    return "For night truck noise with a newborn baby, start with practical sound control instead of blindly choosing the most expensive glass. One real Rollwin example: a family had heavy night-time street and truck noise after a newborn arrived, and Rollwin suggested a cost-saver extra-thick glass option. The baby started sleeping better, and the customer's wife thanked Rollwin many times. Complete silence is not practical, but 12 mm or extra-thick glass with strong sealing can give noticeable relief.";
  }
  if (input.includes("glass")) {
    return "For a normal sliding window, 4 mm plain clear glass is the basic practical option. If you want less glare or less direct sunlight, choose tinted glass or filmed glass. If sound reduction is important, 12 mm glass is the economical sound-control option. For stronger premium noise control, layered acoustic glass is better. Final selection still depends on shutter size, wind exposure, section strength, and budget.";
  }
  if (input.includes("sound") || input.includes("noise")) {
    return "For sound reduction, the right solution is usually acoustic glass with strong sealing, not only thicker glass. Economical option can be 12 mm glass where budget matters. Optimum option is better section plus acoustic laminated glass. Premium option is layered acoustic glass with very careful sealing. Complete silence is not practical, but strong noticeable reduction is possible. One useful detail: is the noise mainly traffic, construction, or general outside sound?";
  }
  if (input.includes("roof")) {
    return "For roofing, the best choice depends on purpose. Tata Durashine is practical and durable for utility and rain protection. Polycarbonate is better when you want light with budget control. Glass roofing is the premium option for openness and appearance. Final choice depends on area, slope, support structure, heat, and rain exposure. If you share balcony, terrace, or open area, I can narrow it down.";
  }
  if (input.includes("partition")) {
    return "For glass partitions, the best setup depends on privacy, movement, and space. Fixed glass gives a clean open look. Sliding partition saves space and keeps flexibility. Combination fixed plus sliding works well for homes and offices. Use better hardware if daily use is high. Tell me whether it is for home or office, and I can suggest the right type.";
  }
  return "For Rollwin windows, the practical choice depends on use and budget. Eco Series is economical for basic everyday use. Wide 32 is a stronger balanced option with better appearance. Elegance Series is the premium heavy-duty choice for homes where finish and durability matter more. Glass, section, hardware, sealing, and site condition all affect the final recommendation. Tell me the opening type or room, and I can suggest the best category.";
}
function storyReply(message) {
  const input = String(message || "").toLowerCase();
  const localLaborIssue =
    (input.includes("local") || input.includes("direct labor")) &&
    (input.includes("bearing") || input.includes("hard sliding") || input.includes("glass came") || input.includes("glass panel") || input.includes("side play"));
  const leakingRoofIssue =
    (input.includes("glass roof") || input.includes("roof")) &&
    (input.includes("leak") || input.includes("monsoon") || input.includes("silicone") || input.includes("ms section") || input.includes("double-grid") || input.includes("pressure tape") || input.includes("thermal"));
  const upvcHeatIssue =
    (input.includes("upvc") || input.includes("u pvc") || input.includes("plastic")) &&
    (input.includes("heat") || input.includes("summer") || input.includes("sun") || input.includes("jam") || input.includes("hard") || input.includes("crack") || input.includes("glass") || input.includes("sliding"));

  if (leakingRoofIssue) {
    return "For a leaking glass roof, repeated silicone patching from the top is usually temporary if the engineering below is wrong. One real Rollwin example: a Pune-area homeowner had a glass roof that leaked every monsoon for years. Rollwin found the roof was fixed directly on MS sections without a proper double-grid aluminium framework, used local silicone, had no pressure tapes, had poor glass spacing, and did not account for thermal expansion between glass, steel, and aluminium. We rebuilt the sealing approach with a proper double-grid framework, correct spacing, premium weather-grade silicone, pressure tapes, and joints designed for movement. The roof stayed dry through multiple monsoons. The lesson is simple: a glass roof is not just glass on steel; lasting waterproofing depends on structure, spacing, sealing system, pressure management, and material quality.";
  }
  if (upvcHeatIssue) {
    return "This is a common reason Rollwin recommends aluminium over uPVC for large exposed sliding doors. One real Rollwin example: a Pune family installed low-cost uPVC sliding doors after being told all windows were the same. After summer heat and direct sunlight, the plastic shutters expanded slightly, sliding became hard, locks misaligned, cracks appeared near stressed areas, and one forced operation caused the glass holding to partly fail. Rollwin replaced the unsuitable system with a heavy-duty aluminium sliding door using precision sections, quality bearings, proper glass retention, premium gaskets, and robust push-pull handles. More than five years later, the doors still slide smoothly. The lesson is that a window or door is judged after years of heat, rain, daily use, and weather changes, not only on installation day.";
  }

  if (!localLaborIssue) return "";

  return "This is a safety issue, so avoid using that shutter until it is checked. One real Rollwin example: a customer installed local sliding windows through direct labor to save money, but soon the shutters rattled, bearings wore out, sliding became hard, side play increased, and one glass panel partly came out because the glass holding was weak. Rollwin replaced the problematic shutters with Eco Series sliding windows using premium push-pull handles, quality bearings, proper glass gaskets, and precision sections. The result was smooth, quiet, secure operation, and the customer later said he wished he had chosen quality windows from the beginning. In your case, the practical next step is inspection of bearings, shutter section rigidity, glass retention, track clearance, locks, and handles before deciding repair versus replacement.";
}
function specificOptionReply(message) {
  const input = String(message || "").toLowerCase();
  const options = [
    [["aluminium sliding window guidance"], "For aluminium sliding windows, choose the system by opening size, shutter height, wind exposure, glass weight, and daily use, not only by rate. Eco/Slim is practical for normal budget work, Wide32 is the balanced stronger choice, and Elegance/deeper systems are better for premium look, smoother operation, larger shutters, or high wind. Also decide 2-track, 3-track, or 4-track based on opening space and whether you need mosquito net or grill. Glass, bearings, locks, gaskets, track sealing, and installation quality decide long-term smoothness."],
    [["eco/slim", "wide32", "elegance sliding"], "Simple choice: Eco/Slim for economical normal-use windows, Wide32 for a stronger and better-looking balanced home option, and Elegance or deeper heavy-duty systems when height, wind, smoothness, premium finish, or larger shutters matter. If the opening is large or exposed to wind, do not go too light on section selection. Hardware, rollers, gaskets, locking, and glass holding are as important as the aluminium section."],
    [["sound dampening window guidance"], "For sound dampening, the system must control both glass and air gaps. Economical path is 12 mm or extra-thick glass with strong sealing. Premium path is layered acoustic glass with stronger sections, gaskets, track sealing, and careful silicone work. Complete silence is not practical, but a clear reduction is possible when the frame, glass, and installation work together."],
    [["main-road traffic", "night vehicle noise"], "For main-road traffic and night vehicle noise, first focus on airtightness. Even expensive glass performs poorly if tracks, gaps, or frame joints leak sound. Economical recommendation is extra-thick or 12 mm glass with proper sealing. Premium recommendation is layered acoustic glass with stronger sections and careful installation. If trucks are the issue, glass mass, air gaps, and sealing quality matter more than only changing the shutter."],
    [["economical sound dampening"], "For economical sound dampening, start with 12 mm or extra-thick glass plus proper sealing instead of jumping directly to the most expensive acoustic glass. This is useful for traffic, night disturbance, exam rooms, elderly people, or baby sleep comfort. Keep expectations realistic: it will reduce sound noticeably, but it will not create complete silence. Track sealing, gaskets, and frame strength must be checked."],
    [["glass roofing guidance"], "Glass roofing is the premium option when daylight, open-sky feel, and appearance matter. But a good glass roof is engineering work: support structure, slope, glass spacing, pressure tapes, weather-grade silicone, thermal movement, drainage, and glass selection must be correct. If these are ignored, the roof may look good on day one but leak in monsoon. For exact guidance, size, support condition, sun exposure, and rain direction matter."],
    [["polycarbonate roofing guidance"], "Polycarbonate roofing is practical when you want rain protection, some natural light, budget control, and a lighter structure than glass. It suits balconies, terraces, utility spaces, and open areas where function matters more than premium glass look. Check sheet quality, thickness, UV grade, support spacing, slope, fixing, and edge sealing. Heat, glare, rain noise, and long-term clarity depend heavily on the material grade and installation."],
    [["tata durashine roofing"], "Tata Durashine roofing is a strong practical sheet-roof option for utility, rain protection, and long-term durability. It is better when your priority is function, strength, and cost control, not transparent daylight. It can be suitable for terraces, open utility areas, and larger practical covers. Correct slope, overlap, support spacing, gutter/drainage, and edge sealing decide how trouble-free it remains in monsoon."],
    [["balcony or terrace roofing"], "For balcony or terrace roofing, first decide the main problem: rain splash, heat, need for light, premium look, or making the space usable. Tata sheet is practical and economical, polycarbonate gives light with budget control, and glass roofing gives the premium daylight look. The real success depends on slope, wall junction sealing, support structure, wind exposure, drainage, and correct material choice."],
    [["home glass partition"], "For a home glass partition, the goal is separation without making the room dark. Fixed glass is clean and elegant, sliding glass saves space, and fixed-plus-sliding works well for living/kitchen or room division. Use proper safety glass, reliable hardware, and enough frame strength for daily use. If privacy is needed, tinted, fluted, frosted, or filmed glass can be considered."],
    [["office glass partition"], "For office glass partitions, plan visibility, privacy, acoustic comfort, wiring/AC coordination, door position, and daily movement. Fixed partitions suit cabins and meeting areas, while sliding or fixed-plus-door layouts help where space is limited. Use safety glass and better hardware for repeated use. If privacy matters, frosting or film can give a professional look without blocking light completely."],
    [["sliding glass partition"], "For sliding glass partitions, the track and hardware are the heart of the system. Choose layout by opening width, daily use, privacy need, and whether one or multiple panels should slide. Safety glass, smooth rollers, proper guides, and accurate alignment prevent noise and jamming. It is a good option when you want flexible separation without losing light."],
    [["budget planning"], "For project budget planning, divide decisions into economical, optimum, and premium. Spend more where failure is costly: large openings, high wind, sound control, glass roofs, waterproofing, and heavy daily-use doors. Save money where usage is simple and risk is low. Proper planning avoids repeated repairs, wrong section selection, and later replacement."],
    [["optimum window and opening size"], "Optimum opening size is not just about maximum width. Very large shutters need stronger sections, better rollers, suitable glass, and proper wind-load thinking. For comfort, balance ventilation, daylight, safety, cleaning access, opening percentage, mosquito/net/grill needs, and budget. A slightly better-planned size often performs better than an oversized opening with weak sections."],
    [["whole project consultancy"], "For whole project support, start with the full use plan: windows, balcony enclosures, roofing, glass partitions, sound control, safety, maintenance, and budget priority. Then select economical, optimum, and premium choices area by area. Rollwin-style consultancy should prevent wrong material choices, weak vendors, poor waterproofing, unsuitable glass, and expensive rework later."]
  ];

  for (const [keys, reply] of options) {
    if (keys.some((key) => input.includes(key))) {
      return reply.replace(/\. (?=[A-Z0-9])/g, ".\n");
    }
  }
  return "";
}
async function getExpertReply({ session, message, intentContext }) {
  const directStory = storyReply(message);
  if (directStory) return directStory;
  const directOption = specificOptionReply(message);
  if (directOption) return directOption;

  if (!process.env.OPENAI_API_KEY) {
    return fallbackReply(message, intentContext);
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.6-terra",
      max_completion_tokens: 1200,
      reasoning_effort: "low",
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(intentContext)
        },
        ...session.history,
        {
          role: "user",
          content: message
        }
      ]
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("OpenAI API error", response.status, data);
    return fallbackReply(message, intentContext);
  }
  const reply = cleanReply(data.choices?.[0]?.message?.content) || fallbackReply(message, intentContext);
  return await moderationFlagged(reply)
    ? "I cannot provide that response. Please ask a practical question about Rollwin windows, doors, roofing, installation or site visits."
    : reply;
}

app.post("/chat", async (req, res) => {
  try {
    const userMessage = String(req.body.message || "").trim();

    if (!userMessage) {
      return res.json({ reply: "Please tell me your requirement." });
    }

    const session = getSession(req.body.sessionId);
    if (isClearlyUnrelated(userMessage)) {
      session.offTopic += 1;
      const reply = session.offTopic >= 2
        ? "Rollwin Expert is paused for unrelated questions. Start again and ask only about windows, doors, roofing, installation, warranty or site visits."
        : "I can help only with Rollwin products and related project guidance.";
      return res.json({ reply, remaining: Math.max(0, DAILY_QUESTION_LIMIT - session.count) });
    }
    if (session.offTopic >= 2) {
      return res.json({ reply: "Rollwin Expert is paused for unrelated questions. Use Start again to continue.", remaining: Math.max(0, DAILY_QUESTION_LIMIT - session.count) });
    }
    session.offTopic = 0;
    if (session.count >= DAILY_QUESTION_LIMIT) {
      return res.json({ reply: "Daily Expert quota is finished for today. Please continue on WhatsApp for urgent help.", remaining: 0 });
    }
    if (await moderationFlagged(userMessage)) {
      return res.json({ reply: "I cannot help with that request. Please ask about Rollwin windows, doors, roofing, installation or site visits.", remaining: Math.max(0, DAILY_QUESTION_LIMIT - session.count) });
    }
    session.count += 1;
    const intentContext = getIntentContext(req.body.forcedIntent, userMessage);
    const reply = await getExpertReply({
      session,
      message: userMessage,
      intentContext
    });

    remember(session, "user", userMessage);
    remember(session, "assistant", reply);

    res.json({ reply, remaining: Math.max(0, DAILY_QUESTION_LIMIT - session.count) });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/reset", (req, res) => {
  const session = getSession(req.body?.sessionId);
  session.history = [];
  session.offTopic = 0;
  res.json({ ok: true });
});

app.get("/", (req, res) => {
  res.send("Rollwin API is running");
});
app.get("/healthz", (req, res) => {
  res.json({ ok: true, service: "rollwin-expert" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

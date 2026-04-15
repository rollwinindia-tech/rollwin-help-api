import { detectIntent } from "./intents.js";

let currentFlow = null;
let stepIndex = 0;

export function handleUserInput(userText) {
  const input = String(userText || "").trim();

  if (!currentFlow) {
    const intent = detectIntent(input);

    if (intent === "balcony") {
      currentFlow = "balcony";
      stepIndex = 0;
      return "What do you want to use the balcony for?";
    }

    if (intent === "sound") {
      currentFlow = "sound";
      stepIndex = 0;
      return "What is the main reason for sound reduction?";
    }

    if (intent === "roofing") {
      currentFlow = "roofing";
      stepIndex = 0;
      return "Where do you need roofing?";
    }

    return "Please tell me your requirement (balcony, sound, roofing)";
  }

  stepIndex++;

  return "Please share more details or connect on WhatsApp.";
}

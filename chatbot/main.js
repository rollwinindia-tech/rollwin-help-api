import { detectIntent } from "./intents.js";
import { getBalconyReply } from "./balcony.js";
import { getSoundReply } from "./sound.js";
import { getRoofingReply } from "./roofing.js";

let currentFlow = null;
let stepIndex = 0;

function resetFlow() {
  currentFlow = null;
  stepIndex = 0;
}

export function handleUserInput(userText) {
  const input = String(userText || "").trim();

  if (!input) {
    return "Please tell me what you need help with, like balcony enclosure, sound reduction, or roofing.";
  }

  if (!currentFlow) {
    const intent = detectIntent(input);

    if (intent === "balcony") {
      currentFlow = "balcony";
      stepIndex = 0;
      return getBalconyReply(stepIndex);
    }

    if (intent === "sound") {
      currentFlow = "sound";
      stepIndex = 0;
      return getSoundReply(stepIndex);
    }

    if (intent === "roofing") {
      currentFlow = "roofing";
      stepIndex = 0;
      return getRoofingReply(stepIndex);
    }

    return "Please tell me what you are looking for: balcony enclosure, sound reduction, or roofing.";
  }

  stepIndex += 1;

  if (currentFlow === "balcony") {
    const reply = getBalconyReply(stepIndex);

    if (stepIndex >= 6) {
      resetFlow();
    }

    return reply;
  }

  if (currentFlow === "sound") {
    const reply = getSoundReply(stepIndex);

    if (stepIndex >= 4) {
      resetFlow();
    }

    return reply;
  }

  if (currentFlow === "roofing") {
    const reply = getRoofingReply(stepIndex);

    if (stepIndex >= 4) {
      resetFlow();
    }

    return reply;
  }

  resetFlow();
  return "Please tell me your requirement again, like balcony enclosure, sound reduction, or roofing.";
}

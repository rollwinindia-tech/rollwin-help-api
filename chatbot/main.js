import { detectIntent } from "./intents.js";

let currentFlow = null;
let stepIndex = 0;

export function handleUserInput(userText) {
  // First message → detect intent
  if (!currentFlow) {
    const intent = detectIntent(userText);

    if (intent === "balcony") {
      currentFlow = "balcony";
      stepIndex = 0;
      return "What do you want to use the balcony for? (Office / Extra room / Sitting / Utility)";
    }

    if (intent === "sound") {
      currentFlow = "sound";
      stepIndex = 0;
      return "What is the main reason for sound reduction? (Baby / Exams / Traffic / Construction)";
    }

    if (intent === "roofing") {
      currentFlow = "roofing";
      stepIndex = 0;
      return "Where do you need roofing? (Balcony / Terrace / Top floor)";
    }

    return "Please tell me what you are looking for (balcony, sound, roofing, etc.)";
  }

  // Continue conversation
  stepIndex++;

  if (currentFlow === "balcony") {
    const steps = [
      "Is your balcony already covered from the top? (Yes / No)",
      "What is there on bottom? (Parapet / Railing)",
      "Do you want more opening space? (Yes / No)",
      "Do you need mosquito protection? (Yes / No)",
      "Which type? (Economical / Premium)"
    ];

    if (stepIndex < steps.length) {
      return steps[stepIndex];
    }
  }

  if (currentFlow === "sound") {
    const steps = [
      "Do you already have windows? (Yes / No)",
      "We provide strong sound dampening using thick processed glass with premium sealing.",
      "Would you like to visit demo or see videos?"
    ];

    if (stepIndex < steps.length) {
      return steps[stepIndex];
    }
  }

  if (currentFlow === "roofing") {
    const steps = [
      "What is your requirement? (Rain protection / Light / Premium look)",
      "We provide Tata sheet, Polycarbonate and Glass roofing.",
      "Would you like estimate or talk to expert?"
    ];

    if (stepIndex < steps.length) {
      return steps[stepIndex];
    }
  }

  // Reset
  currentFlow = null;
  stepIndex = 0;

  return "For exact guidance, please connect with Rollwin expert on WhatsApp.";
}

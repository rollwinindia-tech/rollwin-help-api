import { detectIntent } from "./intents.js";
import {
  balconySteps,
  getBalconyQuestion,
  getBalconyConclusion
} from "./balcony.js";
import {
  soundSteps,
  getSoundIntro,
  getSoundQuestion,
  getSoundConclusion
} from "./sound.js";
import {
  roofingSteps,
  getRoofingQuestion,
  getRoofingConclusion
} from "./roofing.js";

const flowMap = {
  balcony: {
    steps: balconySteps,
    getQuestion: getBalconyQuestion,
    getConclusion: getBalconyConclusion
  },
  sound: {
    steps: soundSteps,
    getQuestion: getSoundQuestion,
    getConclusion: getSoundConclusion,
    getIntro: getSoundIntro
  },
  roofing: {
    steps: roofingSteps,
    getQuestion: getRoofingQuestion,
    getConclusion: getRoofingConclusion
  }
};

export function resetSessionState(session) {
  session.currentFlow = null;
  session.stepIndex = 0;
  session.answers = {};
}

export function handleUserInput({ session, message, forcedIntent = null }) {
  const input = String(message || "").trim();

  if (!input) {
    return "Please tell me your requirement.";
  }

  // Start new flow
  if (!session.currentFlow) {
    const intent = forcedIntent || detectIntent(input);

    if (!flowMap[intent]) {
      return "Please tell me whether you need balcony enclosure, sound dampening, or roofing guidance.";
    }

    session.currentFlow = intent;
    session.stepIndex = 0;
    session.answers = {};

    const intro = flowMap[intent].getIntro?.(0);
    if (intro) return intro;

    return flowMap[intent].getQuestion(0);
  }

  const flow = flowMap[session.currentFlow];
  const currentStep = flow.steps[session.stepIndex];

  if (!currentStep) {
    resetSessionState(session);
    return "Please start again with your requirement.";
  }

  session.answers[currentStep.key] = input;
  session.stepIndex += 1;

  if (session.stepIndex < flow.steps.length) {
    return flow.getQuestion(session.stepIndex);
  }

  const reply = flow.getConclusion(session.answers);
  resetSessionState(session);
  return reply;
}

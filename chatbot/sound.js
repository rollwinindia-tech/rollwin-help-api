export const soundSteps = [
  {
    key: "reason",
    question: "What is the main reason you are looking for sound reduction? (Newborn baby / Child exams / Nearby construction / Traffic or night disturbance / Recently shifted / General comfort)"
  },
  {
    key: "existingWindows",
    question: "Do you currently have windows installed in that area? (Yes / No)"
  },
  {
    key: "demoChoice",
    question: "Would you like to proceed by seeing live demo, YouTube demo, or direct guidance? (Live demo / Video / WhatsApp)"
  }
];

export function getSoundQuestion(stepIndex) {
  if (stepIndex === 1) {
    return "Do you currently have windows installed in that area? (Yes / No)";
  }

  if (stepIndex === 2) {
    return "Would you like to proceed by seeing live demo, YouTube demo, or direct guidance? (Live demo / Video / WhatsApp)";
  }

  return soundSteps[stepIndex]?.question || null;
}

export function getSoundIntro(stepIndex) {
  if (stepIndex === 0) {
    return soundSteps[0].question;
  }
  return null;
}

export function getSoundConclusion(answers) {
  const reason = String(answers.reason || "").toLowerCase();
  const existingWindows = String(answers.existingWindows || "").toLowerCase();
  const demoChoice = String(answers.demoChoice || "").toLowerCase();

  const lines = [];

  lines.push("We provide strong sound dampening solutions using thick processed solid glass with premium sealing.");

  if (existingWindows.includes("yes")) {
    lines.push("Since windows already exist, site condition and current gap control matter a lot.");
  } else {
    lines.push("Since windows are not yet installed, we can guide the full system more effectively from the beginning.");
  }

  if (
    reason.includes("baby") ||
    reason.includes("exam") ||
    reason.includes("construction") ||
    reason.includes("traffic")
  ) {
    lines.push("This is exactly the kind of real-life requirement for which customers approach us for sound dampening guidance.");
  }

  lines.push("Complete silence is not practical, but strong and noticeable sound reduction can be achieved with the right system.");

  if (demoChoice.includes("live")) {
    lines.push("We can guide you through our live demo experience for better understanding.");
  } else if (demoChoice.includes("video")) {
    lines.push("We can also show real installation and demo videos.");
  } else {
    lines.push("Direct guidance on WhatsApp is also available for this premium requirement.");
  }

  return lines.join(" ");
}

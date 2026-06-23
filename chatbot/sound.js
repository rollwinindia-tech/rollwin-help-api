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

  lines.push("For sound dampening, glass alone is not enough. The practical result comes from extra-thick or layered glass, stronger sections, proper gaskets, track sealing, and careful installation.");

  if (existingWindows.includes("yes")) {
    lines.push("Since windows already exist, site condition and current gap control matter a lot.");
  } else {
    lines.push("Since windows are not yet installed, we can guide the full system more effectively from the beginning.");
  }

  if (reason.includes("baby") || reason.includes("newborn") || reason.includes("truck")) {
    lines.push("One real Rollwin example: a family had heavy night-time street and truck noise after a newborn arrived. We suggested a cost-saver extra-thick glass option, and the baby started sleeping better.");
  } else if (reason.includes("exam") || reason.includes("construction") || reason.includes("traffic")) {
    lines.push("For this type of disturbance, 12 mm glass is the economical sound-control option, while layered acoustic glass is the premium stronger option.");
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

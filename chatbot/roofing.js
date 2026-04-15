export const roofingSteps = [
  "Where do you need the roofing? (Balcony / Terrace / Top floor / Open area)",
  "What is your main requirement? (Rain protection / Reduce heat / Natural light / Premium look / Make usable space)",
  "We provide three main options: Tata sheet (economical), Polycarbonate (light + heat control), and Glass roofing (premium look and maximum light).",
  "Roofing work is generally considered for total areas above around 100 sq.ft. Would you like estimate or WhatsApp guidance? (Estimate / WhatsApp)"
];

export function getRoofingReply(stepIndex) {
  if (stepIndex < roofingSteps.length) {
    return roofingSteps[stepIndex];
  }

  return "For exact roofing suggestion, please share your area size or photos on WhatsApp. We will guide you properly.";
}

export const roofingSteps = [
  {
    key: "location",
    question: "Where do you need the roofing? (Balcony / Terrace / Top floor / Open area)"
  },
  {
    key: "requirement",
    question: "What is your main requirement? (Rain protection / Reduce heat / Natural light / Premium look / Make usable space)"
  },
  {
    key: "preference",
    question: "Which type do you want to explore first? (Tata sheet / Polycarbonate / Glass roofing / Not sure)"
  }
];

export function getRoofingQuestion(stepIndex) {
  return roofingSteps[stepIndex]?.question || null;
}

export function getRoofingConclusion(answers) {
  const location = String(answers.location || "").toLowerCase();
  const requirement = String(answers.requirement || "").toLowerCase();
  const preference = String(answers.preference || "").toLowerCase();

  const lines = [];

  if (preference.includes("tata")) {
    lines.push("Tata sheet roofing is the more economical practical option for strong weather protection.");
  } else if (preference.includes("poly")) {
    lines.push("Polycarbonate roofing is a good balance when natural light is needed with better comfort than metal sheet.");
  } else if (preference.includes("glass")) {
    lines.push("Glass roofing is the premium option for maximum light, luxury look, and open-sky feel.");
  } else {
    lines.push("We provide Tata sheet, polycarbonate, and premium glass roofing depending on your need and budget.");
  }

  if (requirement.includes("light")) {
    lines.push("Since natural light is important, polycarbonate or glass roofing usually becomes more suitable than solid sheet roofing.");
  }

  if (requirement.includes("premium")) {
    lines.push("For premium look, glass roofing is usually the top recommendation.");
  }

  if (requirement.includes("rain")) {
    lines.push("For direct rain protection, all three systems can work, but cost and appearance differ significantly.");
  }

  if (location.includes("balcony") || location.includes("terrace")) {
    lines.push("Balcony and terrace roofing are among the most common practical use cases for these systems.");
  }

  lines.push("Roofing work is generally considered for total areas around 100 sq.ft. or more.");
  lines.push("For exact suggestion, please share size and photos on WhatsApp.");

  return lines.join(" ");
}

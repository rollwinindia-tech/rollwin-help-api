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
    lines.push("Tata sheet roofing is the practical economical option for strong utility and rain protection, but it will not give the open premium daylight feel of glass.");
  } else if (preference.includes("poly")) {
    lines.push("Polycarbonate roofing is a balanced option when you want natural light with budget control and lighter structure than glass.");
  } else if (preference.includes("glass")) {
    lines.push("Glass roofing is the premium option for daylight and open-sky feel, but it must be engineered with proper support, slope, glass spacing, pressure tapes, premium weather-grade silicone, and movement-friendly joints.");
  } else {
    lines.push("We can guide between Tata sheet, polycarbonate, and premium glass roofing depending on light, heat, rain protection, look, structure, and budget.");
  }

  if (requirement.includes("light")) {
    lines.push("For example, many homes replace dark tin-sheet areas because natural light is blocked; polycarbonate or glass can bring daylight back while still giving rain protection.");
  }

  if (requirement.includes("premium")) {
    lines.push("For premium look, glass roofing is usually the top recommendation.");
  }

  if (requirement.includes("rain")) {
    lines.push("For rain splash or balcony mess, roofing plus correct slope and sealing is more important than only choosing the sheet material.");
  }

  if (requirement.includes("leak") || requirement.includes("water")) {
    lines.push("A real Rollwin lesson from a leaking glass roof: repeated top-side silicone patching failed because the original roof lacked proper double-grid framework, spacing, pressure tapes, and thermal-movement planning. Once the engineering and sealing system were corrected, the roof stayed dry through monsoons.");
  }

  if (location.includes("balcony") || location.includes("terrace")) {
    lines.push("Balcony and terrace roofing are among the most common practical use cases for these systems.");
  }

  lines.push("For exact suggestion, share approximate width x length and photos of the top, side support, wall junction, and rain-entry area.");

  return lines.join(" ");
}

export const balconySteps = [
  {
    key: "purpose",
    question: "What do you want to use the balcony for? (Office / Extra room / Sitting / Utility)"
  },
  {
    key: "covered",
    question: "Is your balcony already covered from top? (Yes / No)"
  },
  {
    key: "bottom",
    question: "What is there at the bottom? (Parapet wall / Glass railing)"
  },
  {
    key: "openingNeed",
    question: "Do you need more opening space when windows slide? (Yes / No)"
  },
  {
    key: "mosquito",
    question: "Is mosquito a problem in your area? (Yes / No)"
  },
  {
    key: "category",
    question: "Which type do you prefer? (Economical / Standard / Premium)"
  }
];

export function getBalconyQuestion(stepIndex) {
  return balconySteps[stepIndex]?.question || null;
}

export function getBalconyConclusion(answers) {
  const purpose = String(answers.purpose || "").toLowerCase();
  const covered = String(answers.covered || "").toLowerCase();
  const bottom = String(answers.bottom || "").toLowerCase();
  const openingNeed = String(answers.openingNeed || "").toLowerCase();
  const mosquito = String(answers.mosquito || "").toLowerCase();
  const category = String(answers.category || "").toLowerCase();

  const lines = [];

  if (covered.includes("no")) {
    lines.push("Since the balcony is not covered from top, roofing plus enclosure may both be required.");
  } else {
    lines.push("Since the balcony is already covered, we can focus on the enclosure system directly.");
  }

  if (bottom.includes("parapet")) {
    lines.push("A sliding window system is generally very suitable on a parapet wall balcony.");
  } else if (bottom.includes("glass") || bottom.includes("railing")) {
    lines.push("With railing-type balconies, exact support and fixing details matter, so photo-based guidance is better.");
  }

  if (openingNeed.includes("yes")) {
    lines.push("For better opening space, 3-track or 4-track options are usually recommended.");
  } else {
    lines.push("If maximum opening is not necessary, 2-track or 3-track can be practical depending on size.");
  }

  if (mosquito.includes("yes")) {
    lines.push("For mosquito protection, Brazilian sliding net is practical, while folding net is a more space-saving premium option.");
  } else {
    lines.push("Without mosquito requirement, full glass shutter arrangement can give a cleaner look.");
  }

  if (category.includes("econom")) {
    lines.push("Economical category usually suits budget-focused balcony closure.");
  } else if (category.includes("standard")) {
    lines.push("Standard category gives a stronger and better-balanced solution.");
  } else if (category.includes("premium")) {
    lines.push("Premium category is ideal when look, smoother operation, and stronger finish matter more.");
  }

  if (purpose.includes("office")) {
    lines.push("For office use, comfort, daylight control, and practical opening selection become important.");
  } else if (purpose.includes("extra room")) {
    lines.push("For extra room use, enclosure quality and comfort matter more than just basic closure.");
  }

  lines.push("For exact recommendation based on size and site condition, please share a photo or connect on WhatsApp.");

  return lines.join(" ");
}

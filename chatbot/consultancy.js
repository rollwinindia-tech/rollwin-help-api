export const consultancySteps = [
  {
    key: "scope",
    question: "What are you planning? (Windows / Roofing / Partitions / Full project)"
  },
  {
    key: "priority",
    question: "What is your main priority? (Budget / Durability / Premium look / Sound / Low maintenance)"
  }
];

export function getConsultancyQuestion(stepIndex) {
  return consultancySteps[stepIndex]?.question || null;
}

export function getConsultancyConclusion(answers) {
  const scope = String(answers.scope || "").toLowerCase();
  const priority = String(answers.priority || "").toLowerCase();
  const lines = [];

  lines.push("Good project consultancy means choosing the right level for each area instead of blindly making everything cheapest or premium.");

  if (priority.includes("budget")) {
    lines.push("Budget path: spend carefully on normal-use areas, but do not compromise on large openings, waterproofing, sound control, or heavy-use doors.");
  } else if (priority.includes("premium")) {
    lines.push("Premium path: focus on stronger sections, cleaner finish, better hardware, suitable glass, and long-term serviceability.");
  } else if (priority.includes("sound")) {
    lines.push("For sound, plan glass, sealing, section strength, and installation together; only changing glass is not enough.");
  }

  if (scope.includes("full")) {
    lines.push("For a full project, decide windows, roofing, partitions, safety, ventilation, light, privacy, and maintenance as one connected plan.");
  }

  lines.push("For the next step, share the project stage, rough opening sizes, and whether you want economical, optimum, or premium planning.");
  return lines.join(" ");
}

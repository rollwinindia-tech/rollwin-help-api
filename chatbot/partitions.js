export const partitionSteps = [
  {
    key: "use",
    question: "Where do you need the glass partition? (Home / Office / Kitchen / Sliding divider)"
  },
  {
    key: "priority",
    question: "What matters most? (Privacy / Light / Space saving / Premium look / Daily use)"
  }
];

export function getPartitionQuestion(stepIndex) {
  return partitionSteps[stepIndex]?.question || null;
}

export function getPartitionConclusion(answers) {
  const use = String(answers.use || "").toLowerCase();
  const priority = String(answers.priority || "").toLowerCase();
  const lines = [];

  lines.push("For glass partitions, the right choice depends on privacy, light, daily movement, safety glass, and hardware quality.");

  if (use.includes("office")) {
    lines.push("For offices, plan cabin layout, privacy film or frosting, door position, AC/wiring coordination, and repeated-use hardware.");
  } else if (use.includes("kitchen") || use.includes("home")) {
    lines.push("For homes, fixed-plus-sliding layouts usually separate spaces while keeping openness and daylight.");
  }

  if (priority.includes("space") || use.includes("sliding")) {
    lines.push("Sliding partitions are best when space saving and flexible opening are important.");
  } else if (priority.includes("privacy")) {
    lines.push("For privacy, use frosted, fluted, tinted, or filmed glass depending on the look you prefer.");
  } else if (priority.includes("premium")) {
    lines.push("For premium look, cleaner aluminium framing, better hardware, and suitable glass finish matter most.");
  }

  lines.push("For exact guidance, share width, height, use area, and whether you want fixed, sliding, or combination partition.");
  return lines.join(" ");
}

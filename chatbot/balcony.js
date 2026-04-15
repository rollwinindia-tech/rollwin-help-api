export const balconySteps = [
  "What do you want to use the balcony for? (Office / Extra room / Sitting / Utility)",
  "Is your balcony already covered from the top? (Yes / No)",
  "What is there on the outer bottom side? (Parapet / Railing / Not sure)",
  "Do you want more open space when opened? (Yes / No)",
  "Do you need mosquito protection? (Yes / No)",
  "Which type are you looking for? (Economical / Standard / Premium)"
];

export function getBalconyReply(stepIndex) {
  if (stepIndex < balconySteps.length) {
    return balconySteps[stepIndex];
  }

  return "Based on your answers, we can suggest the right balcony enclosure option. For exact guidance, please share a photo or contact Rollwin on WhatsApp.";
}

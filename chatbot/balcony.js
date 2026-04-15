export function getBalconyReply(stepIndex, userInput = "") {
  const input = userInput.toLowerCase();

  // STEP 0
  if (stepIndex === 0) {
    return "What do you want to use the balcony for? (Office / Extra room / Sitting / Utility)";
  }

  // STEP 1
  if (stepIndex === 1) {
    return "Is your balcony already covered from top? (Yes / No)";
  }

  // STEP 2
  if (stepIndex === 2) {
    return "What is there at the bottom? (Parapet wall / Glass railing)";
  }

  // STEP 3
  if (stepIndex === 3) {
    return "Do you need more opening space when windows slide? (Yes / No)";
  }

  // STEP 4 → SMART LOGIC
  if (stepIndex === 4) {
    if (input.includes("yes")) {
      return "In that case, 3-track or 4-track sliding windows are recommended. They give 66% to 75% opening which is ideal for space usage.";
    } else {
      return "2-track or 3-track windows will work well and are more economical options.";
    }
  }

  // STEP 5
  if (stepIndex === 5) {
    return "Is mosquito a problem in your area? (Yes / No)";
  }

  // STEP 6 → SMART LOGIC
  if (stepIndex === 6) {
    if (input.includes("yes")) {
      return "We recommend Brazilian sliding mosquito net or premium folding net. Folding net saves space but is slightly premium.";
    } else {
      return "Then we can go with full glass shutters for maximum opening and clean look.";
    }
  }

  // FINAL STEP → SALES CLOSE
  return "We have completed many balcony enclosures since 1992 with excellent results. Would you like site visit, estimate or connect on WhatsApp?";
}

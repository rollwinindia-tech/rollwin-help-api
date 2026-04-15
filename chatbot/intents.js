export function detectIntent(text) {
  const input = String(text || "").toLowerCase();

  if (
    input.includes("balcony") ||
    input.includes("enclosure") ||
    input.includes("mosquito") ||
    input.includes("sliding window")
  ) {
    return "balcony";
  }

  if (
    input.includes("sound") ||
    input.includes("noise") ||
    input.includes("soundproof") ||
    input.includes("sound damp") ||
    input.includes("acoustic")
  ) {
    return "sound";
  }

  if (
    input.includes("roof") ||
    input.includes("roofing") ||
    input.includes("terrace") ||
    input.includes("polycarbonate") ||
    input.includes("durashine") ||
    input.includes("glass roofing") ||
    input.includes("tata sheet")
  ) {
    return "roofing";
  }

  return "unknown";
}

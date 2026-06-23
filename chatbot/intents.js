export function detectIntent(text) {
  const input = String(text || "").toLowerCase();

  if (
    input.includes("balcony") ||
    input.includes("enclosure") ||
    input.includes("mosquito") ||
    input.includes("sliding window") ||
    input.includes("sliding door") ||
    input.includes("grill") ||
    input.includes("elegance") ||
    input.includes("wide32") ||
    input.includes("slim32") ||
    input.includes("builder window") ||
    input.includes("rattl") ||
    input.includes("wind") ||
    input.includes("direct labor") ||
    input.includes("local window") ||
    input.includes("bearing") ||
    input.includes("hard sliding") ||
    input.includes("side play") ||
    input.includes("glass came") ||
    input.includes("push-pull")
  ) {
    return "balcony";
  }

  if (
    input.includes("sound") ||
    input.includes("noise") ||
    input.includes("soundproof") ||
    input.includes("sound damp") ||
    input.includes("acoustic") ||
    input.includes("truck") ||
    input.includes("newborn") ||
    input.includes("baby") ||
    input.includes("traffic")
  ) {
    return "sound";
  }

  if (
    input.includes("roof") ||
    input.includes("roofing") ||
    input.includes("terrace") ||
    input.includes("pergola") ||
    input.includes("polycarbonate") ||
    input.includes("durashine") ||
    input.includes("glass roofing") ||
    input.includes("glass roof") ||
    input.includes("tata sheet") ||
    input.includes("tin sheet")
  ) {
    return "roofing";
  }

  return "unknown";
}

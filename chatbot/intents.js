export function detectIntent(text) {
  const input = String(text || "").toLowerCase();

  if (
    input.includes("partition") ||
    input.includes("office cabin") ||
    input.includes("room divider") ||
    input.includes("frosted glass") ||
    input.includes("privacy glass")
  ) {
    return "partitions";
  }

  if (
    input.includes("consultancy") ||
    input.includes("project planning") ||
    input.includes("budget planning") ||
    input.includes("optimum size") ||
    input.includes("whole project")
  ) {
    return "consultancy";
  }

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
    input.includes("push-pull") ||
    input.includes("upvc") ||
    input.includes("u pvc") ||
    input.includes("plastic section") ||
    input.includes("jammed shutter") ||
    input.includes("sliding door jam") ||
    input.includes("glass displacement") ||
    input.includes("heat expansion")
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
    input.includes("tin sheet") ||
    input.includes("leak") ||
    input.includes("waterproof") ||
    input.includes("silicone") ||
    input.includes("ms section") ||
    input.includes("double-grid") ||
    input.includes("pressure tape") ||
    input.includes("thermal")
  ) {
    return "roofing";
  }

  return "unknown";
}

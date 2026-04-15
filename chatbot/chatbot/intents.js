export function detectIntent(text) {
  const input = text.toLowerCase();

  if (
    input.includes("balcony") ||
    input.includes("enclose balcony") ||
    input.includes("balcony enclosure")
  ) {
    return "balcony";
  }

  if (
    input.includes("sound") ||
    input.includes("noise") ||
    input.includes("soundproof") ||
    input.includes("sound dampening")
  ) {
    return "sound";
  }

  if (
    input.includes("roof") ||
    input.includes("roofing") ||
    input.includes("terrace cover") ||
    input.includes("polycarbonate") ||
    input.includes("glass roof")
  ) {
    return "roofing";
  }

  return "unknown";
}

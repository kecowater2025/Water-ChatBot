export function normalizeQuestion(input: unknown) {
  return String(input || "").trim();
}

export function compactText(input: string) {
  return input.replace(/\s+/g, "").trim().toLowerCase();
}

export function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}
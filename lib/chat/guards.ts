import { compactText, includesAny } from "./helpers";

const RESTRICTED_KEYWORDS = ["가능성", "적법", "위법", "불법", "판정"];
const RESTRICTED_COMPACT_KEYWORDS = ["판단해줘", "판정해줘", "적법한지", "위법한지"];

export function isRestrictedQuestion(question: string) {
  const compact = compactText(question);

  return (
    includesAny(question, RESTRICTED_KEYWORDS) ||
    includesAny(compact, RESTRICTED_COMPACT_KEYWORDS)
  );
}
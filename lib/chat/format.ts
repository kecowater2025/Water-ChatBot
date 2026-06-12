import { AnswerItem } from "./types";

function splitIntoReadableLines(text: string): string[] {
  const value = text.trim();

  if (!value) return [""];

  // 1. 문장 끝마다 줄바꿈
  let normalized = value
    .replace(/([.?!])\s+/g, "$1\n\n")
    .replace(/(입니다\.)/g, "$1\n")
    .replace(/(합니다\.)/g, "$1\n")
    .replace(/(됩니다\.)/g, "$1\n")
    .replace(/(있습니다\.)/g, "$1\n")
    .replace(/(하세요\.)/g, "$1\n")
    .replace(/(해야 합니다\.)/g, "$1\n")
    .replace(/(필요합니다\.)/g, "$1\n")
    .replace(/(중요합니다\.)/g, "$1\n");

  // 2. 너무 긴 한 줄이면 쉼표 기준으로도 분리
  if (!normalized.includes("\n") && normalized.length > 60) {
    normalized = normalized.replace(/,\s+/g, ",\n");
  }

  // 3. 항목형 표현은 줄바꿈
  normalized = normalized
    .replace(/(다음과 같습니다\.)/g, "$1\n")
    .replace(/(제출자료는)/g, "\n$1")
    .replace(/(법적 근거는)/g, "\n$1")
    .replace(/(심의 대상은)/g, "\n$1")
    .replace(/(절차는)/g, "\n$1");

  return normalized
    .split("\n")
    .map((line) => line.trim())
    .filter((line, index, arr) => !(line === "" && arr[index - 1] === ""));
}

function shouldHighlight(line: string): boolean {
  return (
    line.includes("중요합니다") ||
    line.includes("반드시") ||
    line.includes("제출해야") ||
    line.includes("요청해야") ||
    line.includes("심의 대상") ||
    line.includes("최종 승인") ||
    line.includes("확정 전에") ||
    line.includes("복수유역") ||
    line.includes("모두 심의요청") ||
    line.includes("다음과 같습니다") ||
    line.includes("법적 근거") ||
    line.includes("제출자료") ||
    line.includes("심의 절차")
  );
}

function shouldBullet(line: string): boolean {
  return (
    line.startsWith("- ") ||
    line.startsWith("• ") ||
    line.startsWith("①") ||
    line.startsWith("②") ||
    line.startsWith("③") ||
    line.startsWith("④") ||
    line.startsWith("⑤")
  );
}

export function normalizeAnswerItems(items: AnswerItem[]): AnswerItem[] {
  const result: AnswerItem[] = [];

  for (const item of items) {
    if (typeof item !== "string") {
      result.push({
        ...item,
        highlight: item.highlight ?? shouldHighlight(item.text),
        bullet: item.bullet ?? shouldBullet(item.text)
      });
      continue;
    }

    const lines = splitIntoReadableLines(item);

    for (const line of lines) {
      if (line === "") {
        result.push({ text: "" });
        continue;
      }

      result.push({
        text: line,
        highlight: shouldHighlight(line),
        bullet: shouldBullet(line)
      });
    }
  }

  return result;
}
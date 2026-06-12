import faqData from "@/data/faq_data.json";
import { compactText } from "./helpers";
import { AnswerCardData } from "./types";

type FaqItem = {
  id: string;
  keywords: string[];
  title: string;
  summary: string;
  sections: {
    label: string;
    items: string[];
  }[];
  references?: string[];
};

const FAQ_ITEMS = faqData as FaqItem[];

export function findFaqResponse(question: string): AnswerCardData | null {
  const compact = compactText(question);

  for (const item of FAQ_ITEMS) {
    const matched = item.keywords.some((keyword) =>
      compact.includes(compactText(keyword))
    );

    if (matched) {
      return {
        type: "answer_card",
        title: item.title,
        summary: item.summary,
        sections: item.sections
      };
    }
  }

  return null;
}

export function findFaqResponseByQuickId(id: string): AnswerCardData | null {
  const item = FAQ_ITEMS.find((faq) => faq.id === id);

  if (!item) {
    return null;
  }

  return {
    type: "answer_card",
    title: item.title,
    summary: item.summary,
    sections: item.sections
  };
}
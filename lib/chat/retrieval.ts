import faqData from "@/data/faq_data.json";
import planData from "@/data/plan_data.json";
import localGovernmentData from "@/data/multi_basin_local_governments.json";
import { normalizeAnswerItems } from "./format";

type FaqItem = {
  id: string;
  keywords: string[];
  title: string;
  summary: string;
  sections: {
    label: string;
    items: any[];
  }[];
};

type PlanItem = {
  id: string;
  name: string;
  owners: string[];
  submitTiming: string;
  documents: {
    hanRiver: string[];
    nonHanRiver: string[];
  };
  notes?: string[];
};

type LocalGovernmentItem = {
  name: string;
  basins: string[];
};

export type RetrievedFaqItem = FaqItem;
export type RetrievedPlanItem = PlanItem;

function normalizeText(text: string) {
  return text.replace(/\s+/g, "").trim().toLowerCase();
}

function hasIntroIntent(q: string) {
  return (
    q.includes("제도란") ||
    q.includes("무슨제도") ||
    q.includes("부합성심의란") ||
    q.includes("부합성심의제도란") ||
    q.includes("정의") ||
    q.includes("개요") ||
    q.includes("소개") ||
    q.includes("목적")
  );
}

function hasRequiredDocumentsIntent(q: string) {
  return (
    q.includes("제출자료") ||
    q.includes("제출서류") ||
    q.includes("필요서류") ||
    q.includes("준비서류") ||
    q.includes("무엇을제출") ||
    q.includes("어떤자료를제출") ||
    q.includes("제출해야하는자료") ||
    q.includes("어떤자료를제출하나요") ||
    q.includes("무엇을제출하나요") ||
    q.includes("심의요청서") ||
    q.includes("계획요소분류표") ||
    q.includes("제출") ||
    q.includes("서류") ||
    q.includes("자료")
  );
}

function hasWhenIntent(q: string) {
  return (
    q.includes("언제") ||
    q.includes("시기") ||
    q.includes("요청시점") ||
    q.includes("언제요청") ||
    q.includes("언제심의") ||
    q.includes("언제받아야") ||
    q.includes("언제요청하나요")
  );
}

function hasDurationIntent(q: string) {
  return (
    q.includes("소요기간") ||
    q.includes("얼마나걸리") ||
    q.includes("얼마나 걸리") ||
    q.includes("몇일") ||
    q.includes("며칠") ||
    q.includes("60일") ||
    q.includes("얼마나소요") ||
    q.includes("소요") ||
    q.includes("걸리나요")
  );
}

function hasWhereIntent(q: string) {
  return (
    q.includes("어디에") ||
    q.includes("어느유역") ||
    q.includes("요청기관") ||
    q.includes("어디로") ||
    q.includes("어디에요청") ||
    q.includes("어디에심의") ||
    q.includes("복수유역")
  );
}

function hasTargetPlanIntent(q: string) {
  return (
    q.includes("대상계획") ||
    q.includes("심의대상") ||
    q.includes("어떤계획") ||
    q.includes("대상인지") ||
    q.includes("무슨계획") ||
    q.includes("계획이대상")
  );
}

function hasLegalBasisIntent(q: string) {
  return (
    q.includes("법적근거") ||
    q.includes("근거법") ||
    q.includes("근거") ||
    q.includes("법령") ||
    q.includes("물관리기본법")
  );
}

function hasProcessIntent(q: string) {
  return (
    q.includes("절차") ||
    q.includes("심의절차") ||
    q.includes("진행절차") ||
    q.includes("어떻게진행") ||
    q.includes("순서") ||
    q.includes("프로세스") ||
    q.includes("흐름도")
  );
}

function hasContactIntent(q: string) {
  return (
    q.includes("문의처") ||
    q.includes("담당자") ||
    q.includes("연락처") ||
    q.includes("전화번호") ||
    q.includes("문의") ||
    q.includes("어디에문의")
  );
}

function hasDiagnosisIntent(q: string) {
  return (
    q.includes("맞춤안내") ||
    q.includes("지자체맞춤") ||
    q.includes("우리지자체") ||
    q.includes("준비사항확인") ||
    q.includes("심의요청준비") ||
    q.includes("대상계획별안내사항") ||
    q.includes("진단")
  );
}

function getFaqScore(item: FaqItem, normalizedQuestion: string) {
  let score = 0;

  for (const keyword of item.keywords) {
    const normalizedKeyword = normalizeText(keyword);

    if (normalizedQuestion === normalizedKeyword) {
      score += 1000;
    }

    if (normalizedQuestion.includes(normalizedKeyword)) {
      score += 140;
      score += Math.min(normalizedKeyword.length * 2, 80);
    }

    if (
      normalizedKeyword.includes(normalizedQuestion) &&
      normalizedQuestion.length >= 2
    ) {
      score += 70;
    }
  }

  if (item.id === "intro") {
    if (normalizedQuestion.includes("부합성심의")) score += 120;
    if (normalizedQuestion.includes("부합성심의제도")) score += 180;
    if (normalizedQuestion.includes("제도")) score += 120;
    if (hasIntroIntent(normalizedQuestion)) score += 220;

    if (
      normalizedQuestion.includes("제출") ||
      normalizedQuestion.includes("서류") ||
      normalizedQuestion.includes("자료")
    ) {
      score -= 250;
    }
  }

  if (item.id === "legal_basis") {
    if (hasLegalBasisIntent(normalizedQuestion)) score += 320;
    if (normalizedQuestion.includes("법")) score += 90;
  }

  if (item.id === "review_process") {
    if (hasProcessIntent(normalizedQuestion)) score += 320;
  }

  if (item.id === "target_plan") {
    if (hasTargetPlanIntent(normalizedQuestion)) score += 340;
    if (normalizedQuestion.includes("계획")) score += 80;
    if (normalizedQuestion.includes("대상")) score += 140;
  }

  if (item.id === "when_to_submit") {
    if (hasWhenIntent(normalizedQuestion)) score += 340;
    if (normalizedQuestion.includes("언제")) score += 140;
    if (normalizedQuestion.includes("시기")) score += 160;
    if (normalizedQuestion.includes("요청")) score += 100;

    // 소요기간 질문이면 요청 시기 답변으로 가지 않도록 감점
    if (hasDurationIntent(normalizedQuestion)) score -= 250;
  }

  if (item.id === "review_duration") {
    if (hasDurationIntent(normalizedQuestion)) score += 420;
    if (normalizedQuestion.includes("소요기간")) score += 260;
    if (normalizedQuestion.includes("얼마나걸리")) score += 220;
    if (normalizedQuestion.includes("60일")) score += 260;
    if (normalizedQuestion.includes("기간")) score += 120;
    if (normalizedQuestion.includes("소요")) score += 140;

    // 요청 시기 질문이면 소요기간 답변으로 가지 않도록 감점
    if (hasWhenIntent(normalizedQuestion) && !hasDurationIntent(normalizedQuestion)) {
      score -= 180;
    }
  }

  if (item.id === "where_to_submit") {
    if (hasWhereIntent(normalizedQuestion)) score += 340;
    if (normalizedQuestion.includes("유역")) score += 120;
    if (normalizedQuestion.includes("기관")) score += 120;
    if (normalizedQuestion.includes("복수유역")) score += 260;
  }

  if (item.id === "required_documents") {
    if (hasRequiredDocumentsIntent(normalizedQuestion)) score += 360;
    if (normalizedQuestion.includes("제출자료")) score += 500;
    if (normalizedQuestion.includes("제출서류")) score += 500;
    if (normalizedQuestion.includes("필요서류")) score += 320;
    if (normalizedQuestion.includes("준비서류")) score += 320;
    if (normalizedQuestion.includes("심의요청서")) score += 220;
    if (normalizedQuestion.includes("계획요소분류표")) score += 220;
    if (normalizedQuestion.includes("제출")) score += 260;
    if (normalizedQuestion.includes("서류")) score += 220;
    if (normalizedQuestion.includes("자료")) score += 180;
  }

  if (item.id === "contact_info") {
    if (hasContactIntent(normalizedQuestion)) score += 340;
  }

  if (item.id === "diagnosis") {
    if (hasDiagnosisIntent(normalizedQuestion)) score += 360;
  }

  return score;
}

export function retrieveFaq(question: string): RetrievedFaqItem | null {
  const faqs = faqData as FaqItem[];
  const normalizedQuestion = normalizeText(question);

  if (!normalizedQuestion) return null;

  let bestItem: FaqItem | null = null;
  let bestScore = 0;

  for (const item of faqs) {
    const score = getFaqScore(item, normalizedQuestion);

    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  if (!bestItem) return null;
  if (bestScore < 120) return null;

  return {
    ...bestItem,
    sections: bestItem.sections.map((section) => ({
      ...section,
      items: normalizeAnswerItems(section.items)
    }))
  };
}

export const findFaqResponse = retrieveFaq;

export function shouldRenderProcessFlow(question: string): boolean {
  const q = normalizeText(question);
  return hasProcessIntent(q);
}

export function shouldRenderDiagnosis(question: string): boolean {
  const q = normalizeText(question);
  return hasDiagnosisIntent(q);
}

export function findPlanByName(input: string): RetrievedPlanItem | null {
  const plans = planData.plans as PlanItem[];
  const normalizedInput = normalizeText(input);

  if (!normalizedInput) return null;

  let exactMatch: PlanItem | null = null;
  let partialMatch: PlanItem | null = null;

  for (const plan of plans) {
    const normalizedPlanName = normalizeText(plan.name);

    if (normalizedPlanName === normalizedInput) {
      exactMatch = plan;
      break;
    }

    if (
      normalizedPlanName.includes(normalizedInput) ||
      normalizedInput.includes(normalizedPlanName)
    ) {
      partialMatch = plan;
    }
  }

  return exactMatch ?? partialMatch ?? null;
}

export function detectLocalGovernment(input: string): {
  localGovernment: string;
  basinType: string;
  basinNames: string[];
  isHanRiverIncluded: boolean;
} {
  const source = localGovernmentData.localGovernments as LocalGovernmentItem[];
  const normalizedInput = normalizeText(input);

  if (!normalizedInput) {
    return {
      localGovernment: input,
      basinType: "확인 필요",
      basinNames: [],
      isHanRiverIncluded: false
    };
  }

  let matched: LocalGovernmentItem | null = null;

  for (const item of source) {
    const normalizedName = normalizeText(item.name);

    if (
      normalizedName === normalizedInput ||
      normalizedName.includes(normalizedInput) ||
      normalizedInput.includes(normalizedName)
    ) {
      matched = item;
      break;
    }
  }

  if (!matched) {
    return {
      localGovernment: input,
      basinType: "확인 필요",
      basinNames: [],
      isHanRiverIncluded: false
    };
  }

  const basinNames = matched.basins ?? [];
  const isHanRiverIncluded = basinNames.includes("한강");

  return {
    localGovernment: matched.name,
    basinType: basinNames.length >= 2 ? "복수유역 지자체" : "단일유역 지자체",
    basinNames,
    isHanRiverIncluded
  };
}
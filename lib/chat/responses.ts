import {
  AnswerCardData,
  DiagnosisDocuments,
  DiagnosisResultData,
  BasinSubmissionWindow,
  PlanStage,
  PlanStatus,
  AnswerItem
} from "./types";
import { normalizeAnswerItems } from "./format";

export function createAnswerCard(
  title: string,
  summary: string,
  sections: { label: string; items: AnswerItem[] }[]
): AnswerCardData {
  return {
    type: "answer_card",
    title,
    summary,
    sections: sections.map((section) => ({
      ...section,
      items: normalizeAnswerItems(section.items)
    }))
  };
}

export function createRestrictedResponse(): AnswerCardData {
  return createAnswerCard(
    "안내 범위",
    "이 질문은 본 챗봇의 안내 범위를 벗어납니다. 가이드라인과 리플렛에 근거한 안내만 제공하며, 적법성이나 판정 가능성은 자동으로 판단하지 않습니다.",
    [
      {
        label: "안내",
        items: [
          "개별 계획안의 적법성이나 부합 판정 가능성은 자동으로 판단하지 않습니다.",
          "필요시 담당부서 또는 물관리위원회 지원단과 협의해 주세요."
        ]
      }
    ]
  );
}

export function createFallbackResponse(question: string): AnswerCardData {
  return createAnswerCard(
    "기준자료에서 직접 확인되지 않음",
    "입력하신 질문에 대한 안내를 찾지 못했습니다.",
    [
      {
        label: "입력 질문",
        items: [question]
      },
      {
        label: "안내",
        items: [
          "질문을 더 구체적으로 입력해 주세요.",
          "예: 제출자료, 요청 시기, 절차, 복수유역, 조정요청"
        ]
      }
    ]
  );
}

export function createEmptyQuestionResponse(): AnswerCardData {
  return createAnswerCard(
    "질문 입력 안내",
    "질문이 비어 있습니다. 궁금한 내용을 입력해 주세요.",
    [
      {
        label: "예시 질문",
        items: [
          "부합성 심의는 언제 요청하나요?",
          "심의는 얼마나 걸리나요?",
          "복수유역이면 어떻게 하나요?"
        ]
      }
    ]
  );
}

export function createDiagnosisResult(input: {
  planName: string;
  localGovernment: string;
  planStatus: PlanStatus;
  planStage: PlanStage;
  basinType: string;
  basinNames: string[];
  isHanRiverIncluded: boolean;
  isTarget: boolean;
  targetMessage: string;
  whenToRequest: string;
  whereToRequest: string;
  committee: string;
  submitTiming: string;
  documents: DiagnosisDocuments;
  basinSubmissionWindows: BasinSubmissionWindow[];
  notes: string[];
  contacts: { label: string; phone: string }[];
}): DiagnosisResultData {
  return {
    type: "diagnosis_result",
    ...input
  };
}
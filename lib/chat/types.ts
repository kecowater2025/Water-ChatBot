export type AnswerItem =
  | string
  | {
      text: string;
      url?: string;
      linkLabel?: string;
      highlight?: boolean;
      bullet?: boolean;
    };

export type AnswerSection = {
  label: string;
  items: AnswerItem[];
};

export type AnswerCardData = {
  type: "answer_card";
  title: string;
  summary: string;
  sections: AnswerSection[];
};

export type TextResponseData = {
  type: "text";
  content: string;
};

export type ProcessFlowData = {
  type: "process_flow";
};

export type BasinSubmissionWindow = {
  basinName: string;
  label: string;
  months: string[];
  note?: string;
};

export type DiagnosisDocuments = {
  hanRiver: string[];
  nonHanRiver: string[];
};

export type PlanStatus =
  | "신규 수립"
  | "변경"
  | "부분변경"
  | "잘 모르겠습니다";

export type PlanStage =
  | "초안 작성 중"
  | "관계기관 협의 중"
  | "자체 위원회 심의 전"
  | "승인 요청 전"
  | "최종 확정 직전"
  | "잘 모르겠습니다";

export type DiagnosisResultData = {
  type: "diagnosis_result";
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
};

export type GuideBasin =
  | "한강"
  | "금강"
  | "낙동강"
  | "영산강·섬진강";

export type GuideSectionFeedback = {
  key: string;
  label: string;
  prompt: string;
  draft: string;
  score: number;
  status: "good" | "needs_improvement";
  strengths: string[];
  improvements: string[];
  example: string;
};

export type GuideResultData = {
  type: "guide_result";
  basin: GuideBasin;
  planName: string;
  totalScore: number;
  overallComment: string;
  nextSteps: string[];
  sections: GuideSectionFeedback[];
};

export type ChatResponseData =
  | AnswerCardData
  | TextResponseData
  | ProcessFlowData
  | DiagnosisResultData
  | GuideResultData;

export type ChatApiResponse = {
  data: ChatResponseData;
};

export type ChatMessage =
  | {
      id: string;
      role: "user";
      type: "text";
      content: string;
    }
  | {
      id: string;
      role: "assistant";
      type: "text";
      content: string;
    }
  | {
      id: string;
      role: "assistant";
      type: "answer_card";
      content: AnswerCardData;
    }
  | {
      id: string;
      role: "assistant";
      type: "process_flow";
      content: null;
    }
  | {
      id: string;
      role: "assistant";
      type: "diagnosis_flow";
      content: null;
      onComplete?: (result: DiagnosisResultData) => void;
    }
  | {
      id: string;
      role: "assistant";
      type: "diagnosis_result";
      content: DiagnosisResultData;
    }
  | {
      id: string;
      role: "assistant";
      type: "guide_flow";
      content: null;
      onComplete?: (result: GuideResultData) => void;
    }
  | {
      id: string;
      role: "assistant";
      type: "guide_result";
      content: GuideResultData;
    };

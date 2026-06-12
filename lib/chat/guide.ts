import { GuideBasin, GuideResultData, GuideSectionFeedback } from "./types";

export type GuideFieldSchema = {
  key: string;
  label: string;
  prompt: string;
  placeholder: string;
  minLength: number;
  requiredKeywords: string[];
  preferredKeywords: string[];
  example: (planName: string, basin: GuideBasin) => string;
};

type DraftInput = {
  basin: GuideBasin;
  planName: string;
  fieldValues: Record<string, string>;
};

const COMMON_FIELDS: GuideFieldSchema[] = [
  {
    key: "planScope",
    label: "계획 범위",
    prompt: "행정구역, 면적, 대상 구역 등 계획 범위를 구체적으로 적어 주세요.",
    placeholder:
      "예: OO시 전역을 대상으로 하며, 총 면적은 OO㎢이고 주요 대상 구역은 OO처리구역 일원입니다.",
    minLength: 90,
    requiredKeywords: ["대상", "구역"],
    preferredKeywords: ["면적", "행정", "범위", "일원", "지역"],
    example: () =>
      `본 계획의 범위는 OO시 전역이며, 주요 대상 구역은 OO처리구역 일원입니다. 관련 행정구역과 면적, 적용 대상 범위를 함께 적어 계획 적용 범위를 분명하게 제시합니다.`
  },
  {
    key: "relatedLaws",
    label: "관련 법령",
    prompt: "계획 수립의 근거가 되는 법령명과 관련 조항을 적어 주세요.",
    placeholder:
      "예: 「OO법」 제00조 및 같은 법 시행령 제00조에 따라 계획을 수립하였습니다.",
    minLength: 60,
    requiredKeywords: ["법", "조"],
    preferredKeywords: ["시행령", "근거", "수립", "관련", "제"],
    example: () =>
      `본 계획은 「OO법」 제00조 및 같은 법 시행령 제00조를 근거로 수립했습니다. 가능하면 법령명과 조문을 함께 적어 법적 근거를 명확히 제시하는 것이 좋습니다.`
  },
  {
    key: "purpose",
    label: "목적",
    prompt: "이 계획을 수립하는 목적을 3줄 이내로 간결하게 적어 주세요.",
    placeholder:
      "예: 지역 물관리 현안을 해소하고 상위계획과 연계된 실행 기반을 마련하기 위해 본 계획을 수립합니다.",
    minLength: 70,
    requiredKeywords: ["계획", "수립"],
    preferredKeywords: ["목적", "현안", "연계", "관리", "개선"],
    example: () =>
      `본 계획은 지역 물관리 현안을 해소하고 상위계획과 연계된 실행 기반을 마련하기 위해 수립합니다. 일반론보다 해당 계획의 고유한 목적이 드러나게 적는 것이 좋습니다.`
  },
  {
    key: "expectedEffect",
    label: "기대효과",
    prompt: "계획 시행으로 기대되는 효과를 3줄 이내로 정리해 주세요.",
    placeholder:
      "예: 수질 개선, 물이용 효율화, 사업 간 연계 강화 효과가 기대됩니다.",
    minLength: 60,
    requiredKeywords: ["효과"],
    preferredKeywords: ["개선", "연계", "관리", "효율", "기대"],
    example: () =>
      `본 계획을 통해 수질 개선, 물이용 효율화, 관련 사업 간 연계 강화 효과가 기대됩니다. 정성적 효과뿐 아니라 검토자가 이해하기 쉬운 정책 효과를 드러내는 것이 좋습니다.`
  },
  {
    key: "progress",
    label: "수립 경위",
    prompt: "계획 착수부터 현재까지의 주요 추진 경위를 순서대로 적어 주세요.",
    placeholder:
      "예: 2025.03 연구용역 착수, 2025.10 초안 마련, 2026.02 관계기관 협의, 2026.04 심의 요청",
    minLength: 100,
    requiredKeywords: ["계획", "심의"],
    preferredKeywords: ["착수", "초안", "협의", "공고", "경위"],
    example: () =>
      `2025.03 계획 수립을 위한 연구용역 착수, 2025.10 계획 초안 마련, 2026.02 관계기관 협의, 2026.04 부합성 심의 요청과 같이 시기 순으로 정리하면 경위가 명확해집니다.`
  },
  {
    key: "planContent",
    label: "계획 내용",
    prompt: "양식의 2번 항목에 들어갈 주요 계획 내용을 실제 문서처럼 작성해 주세요.",
    placeholder:
      "예: 본 계획은 현황 분석, 문제점 진단, 목표 설정, 세부 사업계획, 재원 및 추진체계로 구성됩니다.",
    minLength: 140,
    requiredKeywords: ["계획", "내용"],
    preferredKeywords: ["현황", "목표", "사업", "추진", "구성"],
    example: () =>
      `본 계획은 현황 분석, 문제점 진단, 목표 설정, 세부 사업계획, 재원 및 추진체계로 구성됩니다. 해당 계획의 특성에 맞춰 주요 사업과 중점 추진 방향을 문서 형식으로 정리해 주면 좋습니다.`
  },
  {
    key: "upperPlanReflection",
    label: "상위계획 반영 내용",
    prompt: "국가물관리기본계획 또는 관련 상위계획의 어떤 방향을 반영했는지 적어 주세요.",
    placeholder:
      "예: 국가물관리기본계획의 수질 개선 및 유역 협력 강화 방향을 반영하여 세부 실행과제를 구성했습니다.",
    minLength: 100,
    requiredKeywords: ["계획", "반영"],
    preferredKeywords: ["상위", "국가", "정책", "방향", "연계"],
    example: () =>
      `상위 물관리계획에서 제시한 정책 방향과 추진전략을 검토하여 본 계획의 목표와 세부 과제에 반영했습니다. 특히 유역 단위 협력, 수질 개선, 물이용 효율화와 관련된 방향을 계획 내용과 연계해 설명하는 것이 좋습니다.`
  },
  {
    key: "basinConsistency",
    label: "유역물관리계획과의 부합성",
    prompt: "선택한 유역의 물관리 방향과 이번 계획이 어떻게 부합하는지 작성해 주세요.",
    placeholder:
      "예: 해당 계획은 유역 차원의 수질·수량 관리 방향과 충돌하지 않으며, 관련 사업 간 연계성을 높이도록 구성했습니다.",
    minLength: 110,
    requiredKeywords: ["유역", "부합"],
    preferredKeywords: ["정합", "수질", "수량", "생태", "연계"],
    example: (_, basin) =>
      `${basin} 유역의 물관리 목표와 추진 방향을 검토한 결과, 본 계획은 유역 차원의 수질·수량·생태 관리 방향과 충돌하지 않으며 관련 사업 간 연계성을 높이는 방향으로 구성했습니다.`
  },
  {
    key: "requestReason",
    label: "심의 요청 사유 및 검토 필요사항",
    prompt: "왜 지금 심의를 요청하는지, 어떤 부분을 중점적으로 검토받고 싶은지 적어 주세요.",
    placeholder:
      "예: 계획 확정 전 상위계획 및 유역물관리계획과의 부합 여부를 확인받고자 하며, 주요 사업의 적정성에 대한 중점 검토를 요청합니다.",
    minLength: 100,
    requiredKeywords: ["심의", "요청"],
    preferredKeywords: ["사유", "검토", "확인", "쟁점", "반영"],
    example: () =>
      `본 계획은 최종 확정 전 단계로, 상위계획 및 유역물관리계획과의 부합 여부를 확인받기 위해 심의를 요청합니다. 특히 핵심 사업의 적정성과 계획 간 연계성에 대한 중점 검토를 요청한다는 점을 함께 적어 주면 좋습니다.`
  }
];

const BASIN_SPECIFIC_FIELDS: Record<GuideBasin, GuideFieldSchema[]> = {
  "한강": [
    {
      key: "hanRiverFocus",
      label: "6. 한강유역 양식 보완사항",
      prompt: "한강유역 양식에서 강조하려는 지역 특성, 관리 이슈, 협의 필요사항을 작성해 주세요.",
      placeholder:
        "예: 한강 수계 관련 협의사항과 지역 내 주요 수질·하천 관리 현안을 반영했습니다.",
      minLength: 80,
      requiredKeywords: ["한강", "유역"],
      preferredKeywords: ["특성", "관리", "현안", "협의", "수계"],
      example: () =>
        `한강 유역의 지역 특성과 수계 관리 여건을 고려하여 관련 현안과 협의 필요사항을 정리했습니다. 특히 수계 영향, 지역 관리 이슈, 관련 기관 협의 필요성을 함께 제시하면 설득력이 높아집니다.`
    }
  ],
  "금강": [
    {
      key: "planElementClassification",
      label: "6. 계획요소 분류표 반영 내용",
      prompt: "계획요소 분류표를 어떤 기준으로 작성했고, 본문과 어떻게 연결되는지 적어 주세요.",
      placeholder:
        "예: 계획요소를 사업 유형별로 분류하고, 각 요소가 계획 본문과 대응되도록 정리했습니다.",
      minLength: 90,
      requiredKeywords: ["계획요소", "분류"],
      preferredKeywords: ["기준", "연계", "정리", "본문", "표"],
      example: () =>
        `계획요소 분류표는 주요 사업과 관리 과제를 유형별로 정리해 본문 내용과 연결되도록 작성했습니다. 분류 기준과 본문 대응 관계를 함께 설명하면 검토자가 이해하기 쉽습니다.`
    }
  ],
  "낙동강": [
    {
      key: "planElementClassification",
      label: "6. 계획요소 분류표 반영 내용",
      prompt: "계획요소 분류표를 어떤 기준으로 작성했고, 본문과 어떻게 연결되는지 적어 주세요.",
      placeholder:
        "예: 계획요소를 사업 유형별로 분류하고, 각 요소가 계획 본문과 대응되도록 정리했습니다.",
      minLength: 90,
      requiredKeywords: ["계획요소", "분류"],
      preferredKeywords: ["기준", "연계", "정리", "본문", "표"],
      example: () =>
        `계획요소 분류표는 주요 사업과 관리 과제를 유형별로 정리해 본문 내용과 연결되도록 작성했습니다. 분류 기준과 본문 대응 관계를 함께 설명하면 검토자가 이해하기 쉽습니다.`
    }
  ],
  "영산강·섬진강": [
    {
      key: "planElementClassification",
      label: "6. 계획요소 분류표 반영 내용",
      prompt: "계획요소 분류표를 어떤 기준으로 작성했고, 본문과 어떻게 연결되는지 적어 주세요.",
      placeholder:
        "예: 계획요소를 사업 유형별로 분류하고, 각 요소가 계획 본문과 대응되도록 정리했습니다.",
      minLength: 90,
      requiredKeywords: ["계획요소", "분류"],
      preferredKeywords: ["기준", "연계", "정리", "본문", "표"],
      example: () =>
        `계획요소 분류표는 주요 사업과 관리 과제를 유형별로 정리해 본문 내용과 연결되도록 작성했습니다. 분류 기준과 본문 대응 관계를 함께 설명하면 검토자가 이해하기 쉽습니다.`
    }
  ]
};

export function getGuideSchema(basin: GuideBasin): GuideFieldSchema[] {
  return [...COMMON_FIELDS, ...BASIN_SPECIFIC_FIELDS[basin]];
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function countMatches(text: string, keywords: string[]) {
  return keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length;
}

function evaluateField(
  field: GuideFieldSchema,
  draft: string,
  basin: GuideBasin,
  planName: string
): GuideSectionFeedback {
  const normalized = normalizeText(draft);
  const strengths: string[] = [];
  const improvements: string[] = [];

  let score = 0;

  if (draft.trim().length >= field.minLength) {
    score += 40;
    strengths.push("기본 분량이 확보되어 있어 검토자가 맥락을 파악하기 좋습니다.");
  } else {
    improvements.push(
      `설명이 짧습니다. 최소 ${field.minLength}자 이상으로 구체화해 보세요.`
    );
  }

  const requiredCount = countMatches(normalized, field.requiredKeywords);
  const preferredCount = countMatches(normalized, field.preferredKeywords);

  score += requiredCount * 18;
  score += preferredCount * 7;

  if (requiredCount === field.requiredKeywords.length) {
    strengths.push("이 항목에서 꼭 보여야 할 핵심 키워드가 반영되어 있습니다.");
  } else {
    const missing = field.requiredKeywords.filter(
      (keyword) => !normalized.includes(keyword.toLowerCase())
    );
    improvements.push(`핵심 표현이 빠져 있습니다: ${missing.join(", ")}`);
  }

  if (preferredCount >= 2) {
    strengths.push("세부 설명 요소가 들어 있어 문장의 설득력이 좋아졌습니다.");
  } else {
    improvements.push("검토 기준, 연계성, 지역 특성 같은 세부 설명을 더 보강해 보세요.");
  }

  if (!normalized.includes(planName.toLowerCase())) {
    improvements.push("선택한 계획명을 본문에 직접 넣으면 문서 연결성이 더 좋아집니다.");
  } else {
    strengths.push("선택한 계획명이 본문에 포함되어 문서 맥락이 분명합니다.");
  }

  if (
    (field.key === "basinConsistency" || field.key === "hanRiverFocus") &&
    !normalized.includes(basin.replace("·", "").toLowerCase()) &&
    !normalized.includes(basin.toLowerCase())
  ) {
    improvements.push(`선택한 유역명(${basin})을 직접 언급하면 유역별 설명이 더 분명해집니다.`);
  }

  score = Math.min(100, score);

  if (strengths.length === 0) {
    strengths.push("초안이 작성되어 있어 다음 단계 보완 작업을 진행할 수 있습니다.");
  }

  return {
    key: field.key,
    label: field.label,
    prompt: field.prompt,
    draft,
    score,
    status: score >= 70 ? "good" : "needs_improvement",
    strengths,
    improvements,
    example: field.example(planName, basin)
  };
}

export function evaluateGuideDraft(input: DraftInput): GuideResultData {
  const schema = getGuideSchema(input.basin);
  const sections = schema.map((field) =>
    evaluateField(
      field,
      input.fieldValues[field.key] ?? "",
      input.basin,
      input.planName
    )
  );

  const totalScore = Math.round(
    sections.reduce((sum, section) => sum + section.score, 0) / sections.length
  );

  let overallComment =
    "양식의 기본 구조는 갖췄지만, 유역 부합성 근거와 검토 요청 포인트를 조금 더 분명히 적는 것이 좋습니다.";

  if (totalScore >= 85) {
    overallComment =
      "실제 심의요청서 초안으로 활용할 수 있을 정도로 구조가 잘 잡혀 있습니다. 표현만 조금 더 다듬으면 좋습니다.";
  } else if (totalScore >= 70) {
    overallComment =
      "주요 항목은 대체로 채워졌습니다. 다만 상위계획 반영과 유역 부합성 설명을 더 구체화하면 완성도가 올라갑니다.";
  }

  const nextSteps = [
    "각 항목에 계획명과 유역명을 직접 넣어 문서 연결성을 높이세요.",
    "상위계획 반영과 유역 부합성은 추상 표현보다 구체적인 반영 내용 중심으로 쓰세요.",
    "최종본 전에는 내부 검토자가 읽었을 때 바로 이해되는지 문장 길이와 용어를 한 번 더 다듬어 보세요."
  ];

  return {
    type: "guide_result",
    basin: input.basin,
    planName: input.planName,
    totalScore,
    overallComment,
    nextSteps,
    sections
  };
}

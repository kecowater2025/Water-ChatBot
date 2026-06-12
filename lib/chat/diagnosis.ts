import basinSubmissionWindowsData from "@/data/basin_submission_windows.json";
import { createDiagnosisResult } from "./responses";
import { findPlanByName, detectLocalGovernment } from "./retrieval";
import {
  BasinSubmissionWindow,
  DiagnosisResultData,
  PlanStage,
  PlanStatus
} from "./types";

type ContactItem = { label: string; phone: string };

const BASE_CONTACTS: ContactItem[] = [
  { label: "국가 심의지원소통팀", phone: "044-201-8934, 8941" },
  { label: "한강", phone: "031-790-2532" },
  { label: "낙동강", phone: "055-211-1727" },
  { label: "금강", phone: "042-865-9083" },
  { label: "영산강·섬진강", phone: "062-410-5197" },
  { label: "한국환경공단", phone: "032-590-5533~5, 5539" }
];

function getBasinSubmissionWindows(basinNames: string[]): BasinSubmissionWindow[] {
  const source = basinSubmissionWindowsData as Record<
    string,
    { label: string; months: string[]; note?: string }
  >;

  return basinNames.flatMap((basinName) => {
    const item = source[basinName];

    if (!item) {
      console.warn("missing basin submission window:", basinName);
      return [];
    }

    return [
      {
        basinName,
        label: item.label,
        months: item.months,
        note: item.note
      }
    ];
  });
}

function buildTargetMessage(
  planFound: boolean,
  planName: string,
  planStatus: PlanStatus
) {
  if (!planFound) {
    return `선택하신 ${planName}은(는) 현재 등록된 대상계획 목록에서 직접 확인되지 않았습니다. 담당 문의처를 통해 대상 여부를 확인해 주세요.`;
  }

  if (planStatus === "부분변경") {
    return `선택하신 ${planName}은(는) 부합성 심의 대상 계획이며, 부분변경 계획도 예외 없이 심의 대상입니다.`;
  }

  return `선택하신 ${planName}은(는) 부합성 심의 대상 계획입니다.`;
}

function buildWhenToRequest(planSubmitTiming: string, planStage: PlanStage) {
  const base = `관계기관 협의 및 검토 결과가 반영된 계획(안)에 대해 최종 승인 또는 확정 전에 심의를 요청해야 합니다. 계획별 기준 시점은 “${planSubmitTiming}”입니다.`;

  const stageGuide: Record<PlanStage, string> = {
    "초안 작성 중":
      "현재는 초안 단계로 보입니다. 관계기관 협의와 검토 결과가 반영된 뒤 심의요청 시점을 검토해 주세요.",
    "관계기관 협의 중":
      "관계기관 협의가 끝나고 그 결과가 반영된 계획(안)을 기준으로 심의요청하는 것이 적절합니다.",
    "자체 위원회 심의 전":
      "자체 위원회 심의 일정과 부합성 심의 일정을 함께 검토해 주세요.",
    "승인 요청 전":
      "현재 단계에서는 부합성 심의요청 시기를 함께 검토하는 것이 좋습니다.",
    "최종 확정 직전":
      "최종 승인 또는 확정 전에 부합성 심의가 완료되도록 일정을 우선 확인해 주세요.",
    "잘 모르겠습니다":
      "현재 단계가 명확하지 않다면 우선 승인 또는 확정 전인지 확인하고, 판단이 어려우면 지원단과 사전 협의하시기 바랍니다."
  };

  return `${base} ${stageGuide[planStage]}`;
}

function buildWhereToRequest(
  basinType: string,
  basinNames: string[],
  localGovernment: string
) {
  if (basinType === "복수유역 지자체") {
    return `${localGovernment}은(는) 복수유역 해당 지자체이므로 ${basinNames.join(
      ", "
    )} 유역물관리위원회에 모두 심의를 요청해야 합니다.`;
  }

  if (basinType === "단일유역 지자체" && basinNames.length > 0) {
    return `${localGovernment}은(는) ${basinNames[0]} 유역에 해당하므로 해당 유역물관리위원회에 심의를 요청하면 됩니다.`;
  }

  return "입력한 지자체의 유역 정보를 자동으로 확인하지 못했습니다. 시·도와 시·군·구를 정확히 입력한 뒤 다시 확인하거나 담당 문의처를 참고해 주세요.";
}

function createNotes(params: {
  basinType: string;
  basinNames: string[];
  isHanRiverIncluded: boolean;
  planStage: PlanStage;
  planStatus: PlanStatus;
  planNotes?: string[];
}) {
  const notes = [...(params.planNotes ?? [])];

  if (params.planStatus === "부분변경") {
    notes.push("부분변경 계획도 부합성 심의 대상입니다.");
  }

  if (params.basinType === "복수유역 지자체") {
    notes.push("복수유역 지자체는 해당되는 모든 유역 물관리위원회에 심의요청해야 합니다.");
    notes.push(`해당 유역: ${params.basinNames.join(", ")}`);
  }

  if (params.basinType === "단일유역 지자체" && params.basinNames.length > 0) {
    notes.push(`해당 유역: ${params.basinNames.join(", ")}`);
  }

  if (params.basinType === "확인 필요") {
    notes.push("입력한 지자체의 유역 정보를 자동으로 확인하지 못했습니다. 복수유역 해당 여부는 담당 문의처를 통해 확인해 주세요.");
  }

  if (params.isHanRiverIncluded) {
    notes.push("한강 유역이 포함된 경우 계획요소 분류표 제출은 불필요합니다.");
  }

  if (params.planStage === "최종 확정 직전") {
    notes.push("최종 승인 전에 심의절차가 마무리될 수 있도록 내부 일정을 확인해 주세요.");
  }

  if (params.planStage === "잘 모르겠습니다") {
    notes.push("심의요청 시기를 판단하기 어려우면 물관리위원회 지원단과 사전 협의하시기 바랍니다.");
  }

  return notes;
}

export function runDiagnosis(
  planName: string,
  localGovernment: string,
  planStatus: PlanStatus,
  planStage: PlanStage
): DiagnosisResultData {
  const plan = findPlanByName(planName);
  const local = detectLocalGovernment(localGovernment);

  if (!plan) {
    return createDiagnosisResult({
      planName: planName.trim(),
      localGovernment: local.localGovernment,
      planStatus,
      planStage,
      basinType: local.basinType,
      basinNames: local.basinNames,
      isHanRiverIncluded: local.isHanRiverIncluded,
      isTarget: false,
      targetMessage: buildTargetMessage(false, planName.trim(), planStatus),
      whenToRequest:
        "대상계획 여부가 확정되지 않아 요청 시기를 자동 안내하지 못했습니다. 담당 문의처를 통해 확인해 주세요.",
      whereToRequest: buildWhereToRequest(
        local.basinType,
        local.basinNames,
        local.localGovernment
      ),
      committee: "확인 필요",
      submitTiming: "업로드된 기준자료에서 직접 확인 필요",
      documents: {
        hanRiver: [],
        nonHanRiver: []
      },
      basinSubmissionWindows: getBasinSubmissionWindows(local.basinNames),
      notes: createNotes({
        basinType: local.basinType,
        basinNames: local.basinNames,
        isHanRiverIncluded: local.isHanRiverIncluded,
        planStage,
        planStatus,
        planNotes: [
          "입력한 계획명은 현재 등록된 유역물관리종합계획과의 부합성 심의 대상계획 목록에서 확인되지 않았습니다."
        ]
      }),
      contacts: BASE_CONTACTS
    });
  }

  const targetMessage = buildTargetMessage(true, plan.name, planStatus);
  const whenToRequest = buildWhenToRequest(plan.submitTiming, planStage);
  const whereToRequest = buildWhereToRequest(
    local.basinType,
    local.basinNames,
    local.localGovernment
  );
  const notes = createNotes({
    basinType: local.basinType,
    basinNames: local.basinNames,
    isHanRiverIncluded: local.isHanRiverIncluded,
    planStage,
    planStatus,
    planNotes: plan.notes
  });

  return createDiagnosisResult({
    planName: plan.name,
    localGovernment: local.localGovernment,
    planStatus,
    planStage,
    basinType: local.basinType,
    basinNames: local.basinNames,
    isHanRiverIncluded: local.isHanRiverIncluded,
    isTarget: true,
    targetMessage,
    whenToRequest,
    whereToRequest,
    committee: "유역물관리위원회",
    submitTiming: plan.submitTiming,
    documents: plan.documents,
    basinSubmissionWindows: getBasinSubmissionWindows(local.basinNames),
    notes,
    contacts: BASE_CONTACTS
  });
}
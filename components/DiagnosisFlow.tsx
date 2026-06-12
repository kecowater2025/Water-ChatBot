"use client";

import { useMemo, useState } from "react";
import { runDiagnosis } from "@/lib/chat/diagnosis";
import { DiagnosisResultData, PlanStage, PlanStatus } from "@/lib/chat/types";
import planData from "@/data/plan_data.json";
import localGovernmentData from "@/data/multi_basin_local_governments.json";

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

const PLAN_STATUS_OPTIONS: PlanStatus[] = [
  "신규 수립",
  "변경",
  "부분변경",
  "잘 모르겠습니다"
];

const PLAN_STAGE_OPTIONS: PlanStage[] = [
  "초안 작성 중",
  "관계기관 협의 중",
  "자체 위원회 심의 전",
  "승인 요청 전",
  "최종 확정 직전",
  "잘 모르겠습니다"
];

function normalizeText(value: string) {
  return value.replace(/\s+/g, "").trim().toLowerCase();
}

export default function DiagnosisFlow({
  onComplete
}: {
  onComplete: (result: DiagnosisResultData) => void;
}) {
  const [step, setStep] = useState(1);
  const [planName, setPlanName] = useState("");
  const [planStatus, setPlanStatus] = useState<PlanStatus | "">("");
  const [localGovernment, setLocalGovernment] = useState("");
  const [planStage, setPlanStage] = useState<PlanStage | "">("");
  const [showDropdown, setShowDropdown] = useState(false);

  const plans = useMemo(
    () => (planData.plans as PlanItem[]).map((plan) => plan.name),
    []
  );

  const localGovernmentOptions = useMemo(
    () =>
      (localGovernmentData.localGovernments as LocalGovernmentItem[]).map(
        (item) => item.name
      ),
    []
  );

  const filteredLocalGovernments = useMemo(() => {
    const normalized = normalizeText(localGovernment);

    if (!normalized) {
      return localGovernmentOptions.slice(0, 15);
    }

    const startsWith = localGovernmentOptions.filter((name) =>
      normalizeText(name).startsWith(normalized)
    );

    const includes = localGovernmentOptions.filter(
      (name) =>
        !normalizeText(name).startsWith(normalized) &&
        normalizeText(name).includes(normalized)
    );

    return [...startsWith, ...includes].slice(0, 15);
  }, [localGovernment, localGovernmentOptions]);

  const handleSubmit = () => {
    if (!planName || !localGovernment.trim() || !planStatus || !planStage) return;
    const result = runDiagnosis(planName, localGovernment, planStatus, planStage);
    onComplete(result);
  };

  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5">
      {step === 1 && (
        <>
          <div>
            <b>1. 어떤 계획을 검토하고 계신가요?</b>
            <div className="mt-1 text-xs text-slate-500">
              검토 중인 법정계획명을 선택해주세요.
            </div>
          </div>

          <select
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
          >
            <option value="">대상계획을 선택하세요</option>
            {plans.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!planName}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-left disabled:cursor-not-allowed disabled:opacity-50"
          >
            다음
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <b>2. 계획 상태는 무엇인가요?</b>
            <div className="mt-1 text-xs text-slate-500">
              부분변경 계획도 심의 대상인지 함께 안내해드립니다.
            </div>
          </div>

          <div className="grid gap-2">
            {PLAN_STATUS_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPlanStatus(option)}
                className={`rounded-xl border px-4 py-3 text-left text-sm ${
                  planStatus === option
                    ? "border-sky-500 bg-sky-50 text-sky-900"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2"
            >
              이전
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!planStatus}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <b>3. 어느 지자체의 계획인가요?</b>
            <div className="mt-1 text-xs text-slate-500">
              시·도 또는 시·군·구를 입력해주세요.
            </div>
          </div>

          <div className="relative">
            <input
              value={localGovernment}
              onChange={(e) => {
                setLocalGovernment(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="예: 청주시의 경우 청주시 입력(충청북도 청주시 X)"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
            />

            {showDropdown && filteredLocalGovernments.length > 0 && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-md">
                {filteredLocalGovernments.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setLocalGovernment(name);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-800 hover:bg-slate-100"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2"
            >
              이전
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              disabled={!localGovernment.trim()}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div>
            <b>4. 현재 계획은 어느 단계인가요?</b>
            <div className="mt-1 text-xs text-slate-500">
              현재 단계에 따라 심의요청 시기를 안내해드립니다.
            </div>
          </div>

          <div className="grid gap-2">
            {PLAN_STAGE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPlanStage(option)}
                className={`rounded-xl border px-4 py-3 text-left text-sm ${
                  planStage === option
                    ? "border-sky-500 bg-sky-50 text-sky-900"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2"
            >
              이전
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!planStage}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              결과 보기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
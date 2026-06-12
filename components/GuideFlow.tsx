"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import basinTasksData from "@/data/basin_review_tasks.json";
import planData from "@/data/plan_data.json";

type GuideBasin = "한강" | "금강" | "낙동강" | "영산강·섬진강";

type ReviewTask = {
  id: string;
  category: string;
  title: string;
  priority: "high" | "medium" | "low";
  description: string;
  relevantPlanIds: string[];
  keywords: string[];
  checkSentences: string[];
};

type PlanItem = {
  id: string;
  name: string;
};

type TaskInput = {
  reviewContent: string;
  opinion: string;
};

type SavedSession = {
  basin: GuideBasin;
  planId: string;
  planName: string;
  savedAt: string;
  inputs: Record<string, TaskInput>;
};

const BASINS: GuideBasin[] = ["한강", "금강", "낙동강", "영산강·섬진강"];

const STORAGE_KEY = "water-guide-session";

const PRIORITY_LABEL: Record<string, string> = {
  high: "중점 검토",
  medium: "검토",
  low: "참고"
};

const PRIORITY_COLOR: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-100 text-slate-600 border-slate-200"
};

function getTasksForPlan(basin: GuideBasin, planId: string): ReviewTask[] {
  const all = (basinTasksData as Record<string, ReviewTask[]>)[basin] ?? [];
  const filtered = all.filter((t) => t.relevantPlanIds.includes(planId));
  const order = { high: 0, medium: 1, low: 2 };
  return [...filtered].sort((a, b) => order[a.priority] - order[b.priority]);
}

function loadSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session: SavedSession) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

function buildDownloadText(
  basin: GuideBasin,
  planName: string,
  tasks: ReviewTask[],
  inputs: Record<string, TaskInput>
): string {
  const now = new Date().toLocaleString("ko-KR");
  const lines: string[] = [
    "=".repeat(50),
    "유역물관리종합계획 부합성 검토 작업지",
    "=".repeat(50),
    `유역: ${basin}`,
    `대상계획: ${planName}`,
    `작성일시: ${now}`,
    ""
  ];

  tasks.forEach((task, idx) => {
    lines.push("-".repeat(50));
    lines.push(`과제 ${idx + 1}. [${PRIORITY_LABEL[task.priority]}] ${task.title}`);
    lines.push(`구분: ${task.category}`);
    lines.push("");
    lines.push("■ 핵심 키워드");
    lines.push(task.keywords.join(", "));
    lines.push("");
    lines.push("■ 검토 체크포인트");
    task.checkSentences.forEach((s) => lines.push(`  · ${s}`));
    lines.push("");
    lines.push("■ 검토 내용");
    lines.push(inputs[task.id]?.reviewContent?.trim() || "(미작성)");
    lines.push("");
    lines.push("■ 의견");
    lines.push(inputs[task.id]?.opinion?.trim() || "(미작성)");
    lines.push("");
  });

  lines.push("=".repeat(50));
  return lines.join("\n");
}

export default function GuideFlow() {
  const [step, setStep] = useState<"basin" | "plan" | "review">("basin");
  const [basin, setBasin] = useState<GuideBasin | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, TaskInput>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const plans = planData.plans as PlanItem[];

  const tasks = useMemo(() => {
    if (!basin || !planId) return [];
    return getTasksForPlan(basin, planId);
  }, [basin, planId]);

  const planName = useMemo(
    () => plans.find((p) => p.id === planId)?.name ?? "",
    [plans, planId]
  );

  const completedCount = useMemo(
    () =>
      tasks.filter(
        (t) =>
          inputs[t.id]?.reviewContent?.trim() ||
          inputs[t.id]?.opinion?.trim()
      ).length,
    [tasks, inputs]
  );

  const handleRestore = useCallback(() => {
    const session = loadSession();
    if (!session) return;
    setBasin(session.basin);
    setPlanId(session.planId);
    setInputs(session.inputs ?? {});
    setStep("review");
    setRestored(true);
  }, []);

  const triggerAutoSave = useCallback(
    (currentBasin: GuideBasin, currentPlanId: string, currentPlanName: string, currentInputs: Record<string, TaskInput>) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        const session: SavedSession = {
          basin: currentBasin,
          planId: currentPlanId,
          planName: currentPlanName,
          savedAt: new Date().toISOString(),
          inputs: currentInputs
        };
        saveSession(session);
        setSavedAt(new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }));
      }, 800);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const handleInputChange = (taskId: string, field: "reviewContent" | "opinion", value: string) => {
    const next = {
      ...inputs,
      [taskId]: { ...inputs[taskId], [field]: value }
    };
    setInputs(next);
    if (basin && planId) triggerAutoSave(basin, planId, planName, next);
  };

  const handleSelectBasin = (b: GuideBasin) => {
    setBasin(b);
    setPlanId(null);
    setInputs({});
    setExpandedId(null);
    setSavedAt(null);
    setStep("plan");
  };

  const handleSelectPlan = (id: string) => {
    setPlanId(id);
    setInputs({});
    setExpandedId(null);
    setSavedAt(null);
    setStep("review");
  };

  const handleDownload = () => {
    if (!basin || !planId) return;
    const text = buildDownloadText(basin, planName, tasks, inputs);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `부합성검토_${basin}_${planName}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setStep("basin");
    setBasin(null);
    setPlanId(null);
    setInputs({});
    setExpandedId(null);
    setSavedAt(null);
    setRestored(false);
  };

  const savedSession = useMemo(() => {
    if (typeof window === "undefined") return null;
    return loadSession();
  }, []);

  if (step === "basin") {
    return (
      <div className="space-y-4">
        {savedSession && !restored && (
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-indigo-900">이전 작업 내용이 있습니다</div>
                <div className="mt-0.5 text-xs text-indigo-700">
                  {savedSession.basin} · {savedSession.planName}
                </div>
              </div>
              <button
                type="button"
                onClick={handleRestore}
                className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
              >
                이어서 작성
              </button>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Step 1</div>
          <h2 className="mt-1 text-lg font-bold text-slate-900">유역을 선택하세요</h2>
          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            검토할 계획이 속한 유역을 선택하면, 해당 유역의 물관리종합계획 과제가 안내됩니다.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {BASINS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => handleSelectBasin(b)}
                className="flex flex-col items-start rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                <div className="text-base font-bold text-slate-900">{b}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {(basinTasksData as Record<string, ReviewTask[]>)[b]?.length ?? 0}개 검토 과제
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "plan") {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <button
            type="button"
            onClick={() => setStep("basin")}
            className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 stroke-current" fill="none" strokeWidth="2">
              <path d="M15 18 9 12l6-6" />
            </svg>
            유역 다시 선택
          </button>

          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Step 2</div>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            <span className="text-indigo-600">{basin}</span> · 대상계획 선택
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            검토할 계획 유형을 선택하면 해당 계획과 관련된 유역 과제가 자동으로 정렬됩니다.
          </p>

          <div className="mt-4 space-y-2">
            {plans.map((plan) => {
              const matchCount = getTasksForPlan(basin!, plan.id).length;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handleSelectPlan(plan.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <span className="text-sm font-semibold text-slate-800">{plan.name}</span>
                  {matchCount > 0 ? (
                    <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                      {matchCount}개 과제
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-400">
                      해당 없음
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep("plan")}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 stroke-current" fill="none" strokeWidth="2">
            <path d="M15 18 9 12l6-6" />
          </svg>
          계획 다시 선택
        </button>

        <div className="flex items-center gap-2">
          {savedAt && (
            <span className="text-[11px] text-slate-400">{savedAt} 자동저장</span>
          )}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-xl bg-[#233b6e] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1b2f59]"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 stroke-current" fill="none" strokeWidth="2">
              <path d="M12 4v9" />
              <path d="m8.5 10 3.5 3.5 3.5-3.5" />
              <path d="M5 18.5h14" />
            </svg>
            텍스트 저장
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            처음부터
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {basin} 유역물관리종합계획
            </div>
            <div className="mt-1 text-base font-bold text-slate-900">{planName}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">{completedCount}</div>
            <div className="text-[11px] text-slate-400">/ {tasks.length}개 작성</div>
          </div>
        </div>

        {tasks.length === 0 && (
          <div className="mt-3 rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
            선택한 계획과 연관된 검토 과제가 없습니다.
          </div>
        )}

        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: tasks.length > 0 ? `${(completedCount / tasks.length) * 100}%` : "0%" }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task, idx) => {
          const isOpen = expandedId === task.id;
          const input = inputs[task.id] ?? { reviewContent: "", opinion: "" };
          const hasContent = !!(input.reviewContent?.trim() || input.opinion?.trim());

          return (
            <div
              key={task.id}
              className={`overflow-hidden rounded-2xl border transition-all ${
                isOpen ? "border-indigo-200 shadow-md" : "border-slate-200"
              } bg-white`}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : task.id)}
                className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${PRIORITY_COLOR[task.priority]}`}>
                        {PRIORITY_LABEL[task.priority]}
                      </span>
                      <span className="text-[11px] text-slate-400">{task.category}</span>
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-900">{task.title}</div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {hasContent && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      작성됨
                    </span>
                  )}
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 stroke-current text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                  <p className="mb-4 text-sm leading-6 text-slate-600">{task.description}</p>

                  <div className="mb-4">
                    <div className="mb-2 text-xs font-bold text-slate-700">핵심 키워드</div>
                    <div className="flex flex-wrap gap-1.5">
                      {task.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 p-4">
                    <div className="mb-2 text-xs font-bold text-amber-800">검토 체크포인트</div>
                    <ul className="space-y-2">
                      {task.checkSentences.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        검토 내용
                        <span className="ml-1 font-normal text-slate-400">(해당 계획과의 부합 여부 및 근거)</span>
                      </label>
                      <textarea
                        value={input.reviewContent}
                        onChange={(e) => handleInputChange(task.id, "reviewContent", e.target.value)}
                        placeholder="계획 내용 중 해당 과제와 관련된 항목을 서술하고, 유역 목표와의 부합 여부를 작성해주세요."
                        rows={4}
                        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        의견
                        <span className="ml-1 font-normal text-slate-400">(보완 요청 사항, 특이사항 등)</span>
                      </label>
                      <textarea
                        value={input.opinion}
                        onChange={(e) => handleInputChange(task.id, "opinion", e.target.value)}
                        placeholder="심의 과정에서 추가 확인이 필요한 사항이나 보완 요청 의견을 작성해주세요."
                        rows={3}
                        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {tasks.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-600">
              작성 완료 시 텍스트 파일로 저장할 수 있습니다.
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-xl bg-[#233b6e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1b2f59]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2">
                <path d="M12 4v9" />
                <path d="m8.5 10 3.5 3.5 3.5-3.5" />
                <path d="M5 18.5h14" />
              </svg>
              검토 내용 저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

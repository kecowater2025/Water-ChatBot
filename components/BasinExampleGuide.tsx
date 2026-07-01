"use client";

import { useMemo, useState } from "react";

type BasinExample = {
  id: string;
  name: string;
  committee: string;
  pdfUrl: string;
  fileName: string;
  formUrl: string;
  supportFileUrl?: string;
  focus: string[];
};

const basinExamples: BasinExample[] = [
  {
    id: "han",
    name: "한강",
    committee: "한강유역물관리위원회",
    pdfUrl: "/examples/request-examples/han-river-review-example.pdf",
    fileName: "(한강) 부합성 심의요청서 예시.pdf",
    formUrl: "/forms/han-river/buhapseong-review-request.hwp",
    focus: [
      "한강 유역 심의요청서 작성예시 PDF를 기준으로 작성 흐름을 확인합니다.",
      "제목, 요청 개요, 부합성 검토 내용, 첨부자료 작성 방식을 예시 문서에서 확인합니다.",
      "실제 제출 전에는 지자체 계획명, 담당부서, 첨부자료 목록을 해당 계획에 맞게 바꿔야 합니다."
    ]
  },
  {
    id: "geum",
    name: "금강",
    committee: "금강유역물관리위원회",
    pdfUrl: "/examples/request-examples/geum-river-review-example.pdf",
    fileName: "(금강) 부합성 심의요청서 예시.pdf",
    formUrl: "/forms/geum-river/buhapseong-review-request.hwp",
    supportFileUrl: "/forms/geum-river/plan-element-classification.xlsx",
    focus: [
      "금강 유역 심의요청서 작성예시 PDF를 기준으로 작성 흐름을 확인합니다.",
      "계획요소 분류표가 필요한 경우 예시 문서와 함께 분류표 작성 범위를 맞춥니다.",
      "실제 제출 전에는 지자체 계획명, 담당부서, 첨부자료 목록을 해당 계획에 맞게 바꿔야 합니다."
    ]
  },
  {
    id: "nakdong",
    name: "낙동강",
    committee: "낙동강유역물관리위원회",
    pdfUrl: "/examples/request-examples/nakdong-river-review-example.pdf",
    fileName: "(낙동강) 부합성 심의요청서 예시.pdf",
    formUrl: "/forms/nakdong-river/buhapseong-review-request.hwp",
    supportFileUrl: "/forms/nakdong-river/plan-element-classification.xlsx",
    focus: [
      "낙동강 유역 심의요청서 작성예시 PDF를 기준으로 작성 흐름을 확인합니다.",
      "계획요소 분류표가 필요한 경우 예시 문서와 함께 분류표 작성 범위를 맞춥니다.",
      "실제 제출 전에는 지자체 계획명, 담당부서, 첨부자료 목록을 해당 계획에 맞게 바꿔야 합니다."
    ]
  },
  {
    id: "yeongsan",
    name: "영산강·섬진강",
    committee: "영산강·섬진강유역물관리위원회",
    pdfUrl: "/examples/request-examples/yeongsan-seomjin-river-review-example.pdf",
    fileName: "(영섬강) 부합성 심의요청서 예시.pdf",
    formUrl: "/forms/yeongsan-seomjin-river/buhapseong-review-request.hwp",
    supportFileUrl: "/forms/yeongsan-seomjin-river/plan-element-classification.xlsx",
    focus: [
      "영산강·섬진강 유역 심의요청서 작성예시 PDF를 기준으로 작성 흐름을 확인합니다.",
      "계획요소 분류표가 필요한 경우 예시 문서와 함께 분류표 작성 범위를 맞춥니다.",
      "실제 제출 전에는 지자체 계획명, 담당부서, 첨부자료 목록을 해당 계획에 맞게 바꿔야 합니다."
    ]
  }
];

export default function BasinExampleGuide() {
  const [selectedId, setSelectedId] = useState(basinExamples[0].id);

  const selected = useMemo(
    () => basinExamples.find((example) => example.id === selectedId) ?? basinExamples[0],
    [selectedId]
  );

  const pdfPreviewUrl = `${selected.pdfUrl}#toolbar=1&navpanes=0&view=FitH`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Basin Examples
        </div>
        <h2 className="mt-1 text-lg font-bold text-slate-900">
          유역별 심의요청서 작성예시
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          유역을 선택하면 첨부된 부합성 심의요청서 작성예시 PDF를 바로 확인할 수 있습니다.
          PDF가 작게 보이면 새 창에서 열어 확대해서 보세요.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {basinExamples.map((example) => {
          const isSelected = selected.id === example.id;
          return (
            <button
              key={example.id}
              type="button"
              onClick={() => setSelectedId(example.id)}
              className={`min-h-16 rounded-2xl border px-3 py-3 text-left transition ${
                isSelected
                  ? "border-teal-500 bg-teal-50 text-teal-900 shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50/60"
              }`}
            >
              <div className="text-sm font-bold leading-5">{example.name}</div>
              <div className="mt-1 text-[11px] leading-4 text-slate-500">
                PDF 예시 보기
              </div>
            </button>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-[#f8fafc] px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {selected.committee}
              </div>
              <h3 className="mt-1 text-base font-bold text-slate-900">
                {selected.name} 유역 심의요청서 작성예시
              </h3>
              <div className="mt-1 text-xs text-slate-500">{selected.fileName}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={selected.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-[#233b6e] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1b2f59]"
              >
                새 창에서 열기
              </a>
              <a
                href={selected.pdfUrl}
                download
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                PDF 다운로드
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3">
            <div className="text-xs font-bold text-teal-800">확인 포인트</div>
            <ul className="mt-2 space-y-2">
              {selected.focus.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
              <div className="text-xs font-bold text-slate-700">PDF 미리보기</div>
              <div className="text-[11px] text-slate-400">{selected.fileName}</div>
            </div>
            <iframe
              key={selected.pdfUrl}
              src={pdfPreviewUrl}
              title={`${selected.name} 유역 심의요청서 작성예시 PDF`}
              className="h-[620px] w-full bg-white"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="text-xs font-bold text-slate-700">관련 서식</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href={selected.formUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-indigo-700 underline underline-offset-2 shadow-sm transition hover:text-indigo-900"
              >
                심의요청서 서식 다운로드
              </a>
              {selected.supportFileUrl ? (
                <a
                  href={selected.supportFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-indigo-700 underline underline-offset-2 shadow-sm transition hover:text-indigo-900"
                >
                  계획요소 분류표 다운로드
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

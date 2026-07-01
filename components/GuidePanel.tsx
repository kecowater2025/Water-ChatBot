"use client";

import BasinExampleGuide from "./BasinExampleGuide";

export default function GuidePanel({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <aside
      className={`flex h-[calc(100dvh-1.5rem)] min-h-[620px] w-full max-w-[780px] flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)] transition-all duration-300 xl:max-h-[860px] ${
        isOpen ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-8 opacity-0"
      }`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-[#f8fafc] px-5 py-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Request Examples
          </div>
          <div className="mt-1 text-base font-bold text-slate-900">
            유역별 심의요청서 작성예시
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100"
          aria-label="패널 닫기"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2">
            <path d="M6 6 18 18" />
            <path d="M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[#f3f6fb] p-4">
        <BasinExampleGuide />
      </div>
    </aside>
  );
}

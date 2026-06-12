"use client";

import { FormEvent, useState } from "react";

export default function InputBox({
  onSubmit
}: {
  onSubmit: (question: string) => Promise<void> | void;
}) {
  const [value, setValue] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const question = value.trim();
    if (!question) return;

    setValue("");
    await onSubmit(question);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="flex-1 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)]">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="메시지를 입력하세요."
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
      </div>

      <button
        type="submit"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#233b6e] text-white shadow-[0_8px_18px_rgba(35,59,110,0.22)] transition hover:bg-[#1d325e]"
        aria-label="전송"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M3 20.5v-17L22 12 3 20.5zm2-3.1L16.8 12 5 6.6v3.8l6 1.6-6 1.6v3.8z" />
        </svg>
      </button>
    </form>
  );
}
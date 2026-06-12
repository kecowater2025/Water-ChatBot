import { AnswerCardData, AnswerItem } from "@/lib/chat/types";

function renderAnswerItem(item: AnswerItem, index: number) {
  if (typeof item === "string") {
    return (
      <span
        key={index}
        className="text-sm leading-7 text-slate-700"
      >
        {item}
      </span>
    );
  }

  if (item.text === "") {
    return <div key={index} className="h-2 w-full basis-full" />;
  }

  const textClass = item.highlight
    ? "text-sm leading-7 font-semibold text-indigo-600"
    : "text-sm leading-7 text-slate-700";

  if (item.url) {
    return (
      <a
        key={index}
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className={`${textClass} underline underline-offset-2 hover:text-indigo-700`}
      >
        {item.text}
      </a>
    );
  }

  return (
    <span key={index}>
      <span className={textClass}>{item.text}</span>
    </span>
  );
}

export default function AnswerCard({ data }: { data: AnswerCardData }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
      
      {/* 헤더 */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          ANSWER
        </div>
        <h3 className="mt-1 text-[17px] font-bold text-slate-900">
          {data.title}
        </h3>
      </div>

      {/* 요약 */}
      <div className="rounded-xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700 border border-slate-100">
        {data.summary}
      </div>

      {/* 섹션 */}
      <div className="mt-4 space-y-3">
        {data.sections.map((section) => (
          <section
            key={section.label}
            className="rounded-xl border border-slate-100 bg-white px-4 py-4 shadow-sm"
          >
            <div className="mb-2 text-sm font-semibold text-slate-900">
              {section.label}
            </div>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
              {section.items.map((item, index) =>
                renderAnswerItem(item, index)
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
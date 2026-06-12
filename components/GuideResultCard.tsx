import { GuideResultData } from "@/lib/chat/types";

function scoreColor(score: number) {
  if (score >= 85) return "text-emerald-600";
  if (score >= 70) return "text-indigo-600";
  return "text-amber-600";
}

export default function GuideResultCard({
  data
}: {
  data: GuideResultData;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Writing Guide Result
        </div>
        <h3 className="mt-1 text-lg font-bold text-slate-900">
          심의요청서 작성 피드백
        </h3>
      </div>

      <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-indigo-900">
              {data.basin} / {data.planName}
            </div>
            <div className="mt-1 text-sm leading-7 text-slate-700">
              {data.overallComment}
            </div>
          </div>
          <div className={`text-2xl font-bold ${scoreColor(data.totalScore)}`}>
            {data.totalScore}점
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {data.sections.map((section) => (
          <section
            key={section.key}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-bold text-slate-900">
                  {section.label}
                </div>
                <div className="mt-1 text-sm leading-7 text-slate-500">
                  {section.prompt}
                </div>
              </div>
              <div className={`text-lg font-bold ${scoreColor(section.score)}`}>
                {section.score}점
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                작성 초안
              </div>
              <div className="whitespace-pre-line text-sm leading-7 text-slate-700">
                {section.draft}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="mb-2 text-sm font-semibold text-emerald-800">
                  잘된 점
                </div>
                <ul className="space-y-2 text-sm leading-7 text-slate-700">
                  {section.strengths.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                <div className="mb-2 text-sm font-semibold text-amber-800">
                  보완할 점
                </div>
                <ul className="space-y-2 text-sm leading-7 text-slate-700">
                  {section.improvements.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 text-sm font-semibold text-slate-900">
                개선 예시
              </div>
              <div className="text-sm leading-7 text-slate-700">
                {section.example}
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-3 text-base font-bold text-slate-900">
          최종 점검 포인트
        </div>
        <ul className="space-y-2 text-sm leading-7 text-slate-700">
          {data.nextSteps.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function ProcessFlowCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="mb-1">
        <div className="text-[10px] font-semibold text-slate-500">
          Process Diagram
        </div>
        <h3 className="text-base font-bold text-slate-900">
          부합성 심의 절차
        </h3>
        <p className="text-[11px] leading-4 text-slate-600">
          부합성 심의 절차 체계도입니다.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
        <div>

          <div className="mx-auto mb-2 max-w-[500px] rounded-full bg-gradient-to-r from-blue-800 to-slate-900 px-2 py-1 text-center text-sm font-bold text-white">
            부합성 심의 절차
          </div>

          <div className="mb-1 grid grid-cols-[1.3fr_1fr_0.7fr] gap-1.5">
            <HeaderCell label="절차" />
            <HeaderCell label="주체" />
            <HeaderCell label="소요기간(누적)" />
          </div>

          <div className="space-y-1.5">

            <StepRow
              title="심의요청서 제출"
              actor={"지자체→\n유역물관리위원회"}
              duration="-"
            />

            <CenterArrow />

            <DecisionPill
              title="요청서 보완이 필요한 경우"
              subtitle="보완 필요 시 보완요청 후 재제출"
            />

            <div className="grid gap-1.5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">

              <div className="rounded-2xl border-2 border-amber-400 bg-amber-100 p-2">
                <div className="text-center text-xs font-bold text-amber-900">
                  심의요청서 보완요청
                </div>
                <div className="mt-0.5 text-center text-[10px] font-semibold text-amber-800">
                  유역지원팀 → 지자체
                </div>
              </div>

              <div className="flex justify-center">
                <div className="text-xl leading-none text-slate-500">↓</div>
              </div>

              <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-2">
                <div className="text-center text-xs font-bold text-amber-900">
                  보완 후 재제출
                </div>
                <div className="mt-0.5 text-center text-[10px] font-semibold text-amber-800">
                  지자체 → 유역지원팀
                </div>
              </div>

            </div>

            <div className="flex justify-center">
              <div className="rounded-full border border-dashed border-slate-300 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600">
                보완 후 본 절차로 복귀
              </div>
            </div>

            <CenterArrow />

            <StepRow
              title="심의 추진계획 알림"
              actor="유역지원팀"
              duration="접수 후"
            />

            <CenterArrow />

            <StepRow
              title="예비검토 보고서 작성"
              actor={"유역지원팀\n(한국환경공단 지원)"}
              duration={
                <>
                  <div>20일</div>
                  <div className="text-[10px] font-medium text-slate-600">(20일)</div>
                </>
              }
            />

            <CenterArrow />

            <StepRow
              title={"사전검토 및\n심의안건 작성"}
              actor={"유역물관리위원회\n계획분과"}
              duration={
                <>
                  <div>30일</div>
                  <div className="text-[10px] font-medium text-slate-600">(50일)</div>
                </>
              }
            />

            <CenterArrow />

            <StepRow
              title={"심의·의결 및\n결과 통보"}
              actor={"유역물관리위원회→\n지자체"}
              duration={
                <>
                  <div>10일</div>
                  <div className="text-[10px] font-medium text-slate-600">(60일)</div>
                </>
              }
            />

            <CenterArrow />

            <DecisionPill
              title="심의 결과에 조치·권고사항이 있는 경우"
              subtitle="조치결과 제출 필요"
              tone="blue"
            />

            <div className="grid gap-1.5 lg:grid-cols-2 items-start">

              <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-100 p-2">
                <div className="text-center text-xs font-bold text-emerald-900">
                  조치·권고사항을 반영할 수 있는 경우
                </div>
                <div className="mt-1 text-center text-[10px] font-semibold text-emerald-800">
                  반영 후 조치결과 제출
                </div>

                <div className="my-1 flex justify-center">
                  <div className="text-xl leading-none text-emerald-700">↓</div>
                </div>

                <div className="rounded-2xl border border-emerald-300 bg-white p-2">
                  <div className="text-center text-xs font-bold text-slate-900">
                    조치결과 제출
                  </div>
                  <div className="mt-0.5 text-center text-[10px] font-semibold text-slate-700">
                    지자체 → 유역물관리위원회
                  </div>
                  <div className="mt-1 rounded-xl bg-emerald-50 px-2 py-0.5 text-center text-[10px] font-medium text-emerald-900">
                    결과 통보일로부터 30일 이내
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-rose-400 bg-rose-100 p-2">
                <div className="text-center text-xs font-bold text-rose-900">
                  조치·권고사항을 반영하기 어려운 경우
                </div>
                <div className="mt-1 text-center text-[10px] font-semibold text-rose-800">
                  결과 조정요청 및 재심의 진행
                </div>

                <div className="my-1 flex justify-center">
                  <div className="text-xl leading-none text-rose-700">↓</div>
                </div>

                <div className="space-y-1.5">
                  <MiniStep title="결과 조정요청" subtitle="지자체 → 유역물관리위원회" />

                  <div className="flex justify-center">
                    <div className="text-lg leading-none text-slate-500">↓</div>
                  </div>

                  <MiniStep title="재심의" subtitle="유역물관리위원회 → 지자체" />

                  <div className="rounded-xl bg-rose-50 px-2 py-1 text-center text-[10px] font-semibold text-rose-900">
                    조정요청 및 재심의: 20일
                  </div>

                  <div className="flex justify-center">
                    <div className="text-lg leading-none text-slate-500">↓</div>
                  </div>

                  <div className="rounded-2xl border border-rose-300 bg-white p-2">
                    <div className="text-center text-xs font-bold text-slate-900">
                      조치결과 제출
                    </div>
                    <div className="mt-0.5 text-center text-[10px] font-semibold text-slate-700">
                      지자체 → 유역물관리위원회
                    </div>
                    <div className="mt-1 rounded-xl bg-amber-50 px-2 py-0.5 text-center text-[10px] font-medium text-amber-900">
                      재심의 결과 통보일로부터 10일 이내
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderCell({ label }: { label: string }) {
  const [main, sub] = label.includes("(")
    ? label.split("(")
    : [label, null];

  return (
    <div className="rounded-xl bg-slate-200 px-2 py-1.5 text-slate-900 flex flex-col items-center justify-center">
      
      <div className="text-xs font-bold leading-tight">
        {main}
      </div>

      {sub && (
        <div className="text-[10px] font-semibold text-slate-600 leading-tight">
          ({sub}
        </div>
      )}
    </div>
  );
}

function StepRow({
  title,
  actor,
  duration
}: {
  title: string;
  actor: React.ReactNode;
  duration: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1.3fr_1fr_0.7fr] gap-1.5 rounded-2xl">

      {/* 절차 */}
      <div className="rounded-2xl border border-slate-200 bg-blue-50 px-2 py-1.5 text-sm font-bold flex items-center justify-center text-center text-slate-900 leading-tight whitespace-pre-line">
        {title}
      </div>

      {/* 주체 */}
      <div className="rounded-2xl border border-slate-200 bg-white px-1 py-1 text-xs font-semibold flex items-center justify-center text-center text-slate-900 leading-tight whitespace-pre-line">
        {actor}
      </div>

      {/* 기간 */}
      <div className="rounded-2xl border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold flex items-center justify-center text-center text-slate-900 leading-tight">
        {duration}
      </div>

    </div>
  );
}

function CenterArrow() {
  return (
    <div className="flex justify-center">
      <div className="text-2xl text-slate-500">↓</div>
    </div>
  );
}

function DecisionPill({
  title,
  subtitle,
  tone = "gray"
}: {
  title: string;
  subtitle?: string;
  tone?: "gray" | "blue";
}) {
  const style =
    tone === "blue"
      ? "border-blue-300 bg-blue-100 text-blue-900"
      : "border-slate-200 bg-slate-100 text-slate-900";

  return (
    <div className={`rounded-2xl border px-3 py-2 text-center ${style}`}>
      <div className="text-sm font-bold">{title}</div>
      {subtitle && (
        <div className="mt-1 text-[11px] font-medium opacity-80">
          {subtitle}
        </div>
      )}
    </div>
  );
}

function MiniStep({
  title,
  subtitle
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-3">
      <div className="text-center text-sm font-bold">{title}</div>
      <div className="mt-1 text-center text-xs font-semibold">{subtitle}</div>
    </div>
  );
}
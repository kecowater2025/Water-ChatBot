type BasinSubmissionWindow = {
  basinName: string;
  label: string;
  months: string[];
  note?: string;
};

type DiagnosisResultCardProps = {
  data: {
    planName: string;
    localGovernment: string;
    planStatus: string;
    planStage: string;
    basinType: string;
    basinNames: string[];
    isHanRiverIncluded: boolean;
    isTarget: boolean;
    targetMessage: string;
    whenToRequest: string;
    whereToRequest: string;
    committee: string;
    submitTiming: string;
    documents: {
      hanRiver: string[];
      nonHanRiver: string[];
    };
    basinSubmissionWindows?: BasinSubmissionWindow[];
    notes: string[];
    contacts: { label: string; phone: string }[];
  };
};

function getDocumentsByBasin(
  basinName: string,
  documents: { hanRiver: string[]; nonHanRiver: string[] }
) {
  if (basinName === "한강") {
    return {
      title: "한강 유역 제출자료",
      items: documents.hanRiver
    };
  }

  return {
    title: `${basinName} 유역 제출자료`,
    items: documents.nonHanRiver
  };
}

export default function DiagnosisResultCard({
  data
}: DiagnosisResultCardProps) {
  const isMultiBasin = data.basinType === "복수유역 지자체";
  const basinSubmissionWindows = data.basinSubmissionWindows ?? [];

  const basinDocumentGroups =
    data.basinNames.length > 0
      ? data.basinNames.map((basinName) =>
          getDocumentsByBasin(basinName, data.documents)
        )
      : [
          {
            title: data.isHanRiverIncluded
              ? "한강 유역 제출자료"
              : "제출자료",
            items: data.isHanRiverIncluded
              ? data.documents.hanRiver
              : data.documents.nonHanRiver
          }
        ];

  const summaryText = data.isTarget
    ? "현재 입력하신 계획은 부합성 심의 대상이며, 승인 또는 확정 전에 심의요청 여부를 확인해야 합니다."
    : "현재 입력하신 계획은 대상 여부를 추가 확인해야 합니다. 담당 문의처를 통해 확인해 주세요.";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Diagnosis Result
        </div>
        <h3 className="mt-1 text-lg font-bold text-slate-900">
          지자체 맞춤 안내 결과
        </h3>
      </div>

      <div className="mb-5 rounded-2xl border border-sky-100 bg-sky-50 p-4">
        <div className="text-sm font-semibold text-sky-700">요약</div>
        <div className="mt-1 text-sm leading-8 text-slate-800">{summaryText}</div>
      </div>

      <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-8 text-slate-700">
        <div>
          <strong>선택 계획명:</strong> {data.planName}
        </div>
        <div>
          <strong>계획 상태:</strong> {data.planStatus}
        </div>
        <div>
          <strong>지자체명:</strong> {data.localGovernment}
        </div>
        <div>
          <strong>현재 단계:</strong> {data.planStage}
        </div>
        <div>
          <strong>유역 구분:</strong> {data.basinType}
        </div>
        {data.basinNames.length > 0 && (
          <div>
            <strong>해당 유역:</strong> {data.basinNames.join(", ")}
          </div>
        )}
        <div>
          <strong>복수유역 여부:</strong> {isMultiBasin ? "O" : "X"}
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 text-base font-bold text-slate-900">
            1. 심의 대상 여부
          </div>
          <p className="whitespace-pre-line text-sm leading-8 text-slate-700">
            <span className="font-semibold text-sky-700">
              {data.isTarget ? "심의 대상입니다." : "대상 여부 확인이 필요합니다."}
            </span>
            {"\n"}
            {data.targetMessage}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 text-base font-bold text-slate-900">
            2. 언제 심의를 요청해야 하나요?
          </div>
          <p className="whitespace-pre-line text-sm leading-8 text-slate-700">
            <span className="font-semibold text-sky-700">
              최종 승인 또는 확정 전에 요청해야 합니다.
            </span>
            {"\n"}
            {data.whenToRequest}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 text-base font-bold text-slate-900">
            3. 어디에 심의를 요청해야 하나요?
          </div>
          <p className="whitespace-pre-line text-sm leading-8 text-slate-700">
            <span className="font-semibold text-sky-700">
              관할 유역물관리위원회에 요청해야 합니다.
            </span>
            {"\n"}
            {data.whereToRequest}
          </p>
        </section>

        {data.isTarget && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 text-base font-bold text-slate-900">
              4. 어떤 자료를 제출해야 하나요?
            </div>

            <div className="mb-4 text-sm leading-8 text-slate-700">
              <span className="font-semibold text-sky-700">
                유역별 작성양식은 '서식 다운로드' 메뉴를 참고해주시기 바랍니다.
              </span>
            </div>

            <div className="grid gap-4">
              {basinDocumentGroups.map((group) => (
                <div key={group.title} className="rounded-xl bg-slate-50 p-4">
                  <div className="mb-2 text-sm font-semibold text-slate-800">
                    {group.title}
                  </div>

                  {group.items.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-5 text-sm leading-8 text-slate-700">
                      {group.items.map((doc) => (
                        <li key={`${group.title}-${doc}`}>{doc}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm leading-8 text-slate-600">
                      제출자료 정보를 찾지 못했습니다. 담당 문의처를 통해 확인해 주세요.
                    </div>
                  )}
                </div>
              ))}
            </div>

            {basinSubmissionWindows.length > 0 && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <div className="mb-2 text-sm font-semibold text-slate-900">
                  유역별 심의요청 시기 참고
                </div>
                <div className="space-y-2">
                  {basinSubmissionWindows.map((item) => (
                    <div
                      key={item.basinName}
                      className="text-sm leading-8 text-slate-700"
                    >
                      <div>
                        <strong>{item.label}:</strong> {item.months.join(", ")}
                      </div>
                      {item.note ? (
                        <div className="text-xs text-slate-500">{item.note}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 text-base font-bold text-slate-900">
            5. 담당 문의처
          </div>
          <ul className="space-y-2 text-sm leading-8 text-slate-700">
            {data.contacts.map((contact) => (
              <li key={contact.label}>
                <strong>{contact.label}</strong>: {contact.phone}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
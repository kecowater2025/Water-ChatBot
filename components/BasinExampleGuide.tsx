"use client";

import { useMemo, useState } from "react";

type BasinExample = {
  id: string;
  name: string;
  committee: string;
  receiver: string;
  formUrl: string;
  supportFileUrl?: string;
  focus: string[];
  fields: { label: string; value: string }[];
};

const basinExamples: BasinExample[] = [
  {
    id: "han",
    name: "한강",
    committee: "한강유역물관리위원회",
    receiver: "한강유역물관리위원회 사무국",
    formUrl: "/forms/han-river/buhapseong-review-request.hwp",
    focus: [
      "수도권 인구·산업 밀집 지역의 물수요 관리와 수질개선 대책을 함께 적습니다.",
      "상수원 보호구역, 취수원, 하천 수질 영향이 있는 계획 내용은 별도 항목으로 정리합니다.",
      "계획 시행으로 물순환, 하수처리, 비점오염 저감에 어떤 효과가 있는지 근거를 붙입니다."
    ],
    fields: [
      {
        label: "제목",
        value: "OO시 하수도정비기본계획 변경에 대한 한강 유역물관리종합계획 부합성 심의 요청"
      },
      {
        label: "요청 개요",
        value: "우리 시에서 수립 중인 OO시 하수도정비기본계획 변경안은 노후 하수관로 정비, 공공하수처리시설 증설, 초기우수 저감시설 설치를 주요 내용으로 합니다. 이에 한강 유역물관리종합계획의 수질개선 및 물순환 회복 방향과의 부합 여부에 대하여 심의를 요청드립니다."
      },
      {
        label: "부합성 검토 내용",
        value: "본 계획은 한강 유역의 오염부하 저감, 도시지역 비점오염 관리, 안정적인 하수처리 기반 확충에 기여하도록 구성하였습니다. 특히 취수원 상류 구간의 오염원 관리와 강우 시 월류수 저감 대책을 반영하여 유역계획의 중점 추진방향과 부합하는 것으로 검토하였습니다."
      },
      {
        label: "첨부자료",
        value: "심의요청서 1부, 계획안 요약서 1부, 한강 유역물관리종합계획 부합성 검토표 1부, 관련 도면 및 위치도 1부"
      }
    ]
  },
  {
    id: "geum",
    name: "금강",
    committee: "금강유역물관리위원회",
    receiver: "금강유역물관리위원회 사무국",
    formUrl: "/forms/geum-river/buhapseong-review-request.hwp",
    supportFileUrl: "/forms/geum-river/plan-element-classification.xlsx",
    focus: [
      "상·하류 간 물 배분, 농업용수, 도시용수 수요를 구분해 적습니다.",
      "대청호 등 주요 수계 수질관리와 녹조 대응 관련 내용을 확인합니다.",
      "계획요소 분류표가 필요한 유역이므로 계획 내용과 분류표 항목을 맞춰 작성합니다."
    ],
    fields: [
      {
        label: "제목",
        value: "OO군 물재이용관리계획 수립에 대한 금강 유역물관리종합계획 부합성 심의 요청"
      },
      {
        label: "요청 개요",
        value: "OO군은 공공하수처리수 재이용 확대와 농업용수 보조 공급체계 구축을 주요 내용으로 하는 물재이용관리계획을 수립하고 있습니다. 금강 유역의 물이용 효율화 및 수질보전 방향과의 부합 여부 검토를 위하여 심의를 요청드립니다."
      },
      {
        label: "부합성 검토 내용",
        value: "본 계획은 하수처리수 재이용을 통해 하천 취수 의존도를 낮추고, 갈수기 물수요 대응력을 높이는 데 목적이 있습니다. 또한 재이용수 공급 과정에서 방류수 수질기준 준수와 주변 수계 영향 저감대책을 포함하여 금강 유역계획의 물순환·수질관리 과제와 부합하도록 작성하였습니다."
      },
      {
        label: "첨부자료",
        value: "심의요청서 1부, 계획안 요약서 1부, 계획요소 분류표 1부, 재이용 공급계통도 1부, 수질영향 검토자료 1부"
      }
    ]
  },
  {
    id: "nakdong",
    name: "낙동강",
    committee: "낙동강유역물관리위원회",
    receiver: "낙동강유역물관리위원회 사무국",
    formUrl: "/forms/nakdong-river/buhapseong-review-request.hwp",
    supportFileUrl: "/forms/nakdong-river/plan-element-classification.xlsx",
    focus: [
      "취수원 다변화, 산업단지 배출관리, 하천 수질개선 내용을 구분합니다.",
      "상류 오염원 관리와 하류 물이용 안전성에 미치는 영향을 함께 검토합니다.",
      "계획의 위치, 배출·취수 지점, 수질개선 목표를 도면 또는 표로 연결해 작성합니다."
    ],
    fields: [
      {
        label: "제목",
        value: "OO시 산업단지 공공폐수처리시설 증설계획에 대한 낙동강 유역물관리종합계획 부합성 심의 요청"
      },
      {
        label: "요청 개요",
        value: "OO시는 산업단지 입주 수요 증가에 따라 공공폐수처리시설 증설 및 고도처리 공정 도입을 추진하고 있습니다. 낙동강 유역 수질개선 목표 및 안전한 물이용 체계와의 부합 여부를 검토받고자 심의를 요청드립니다."
      },
      {
        label: "부합성 검토 내용",
        value: "본 계획은 산업폐수 처리용량 확충과 방류수 수질 강화, 사고유출 차단시설 설치를 포함하고 있습니다. 방류 하천의 수질목표 달성과 하류 취수원 보호에 기여하도록 계획하여 낙동강 유역물관리종합계획의 수질안전성 강화 방향과 부합하는 것으로 검토하였습니다."
      },
      {
        label: "첨부자료",
        value: "심의요청서 1부, 계획안 요약서 1부, 계획요소 분류표 1부, 처리공정도 1부, 방류수 수질예측자료 1부"
      }
    ]
  },
  {
    id: "yeongsan",
    name: "영산강·섬진강",
    committee: "영산강·섬진강유역물관리위원회",
    receiver: "영산강·섬진강유역물관리위원회 사무국",
    formUrl: "/forms/yeongsan-seomjin-river/buhapseong-review-request.hwp",
    supportFileUrl: "/forms/yeongsan-seomjin-river/plan-element-classification.xlsx",
    focus: [
      "영산강과 섬진강 중 해당 수계를 명확히 구분해 작성합니다.",
      "하구·연안, 농업용수, 수생태 회복과 연결되는 계획 내용을 확인합니다.",
      "가뭄 대응, 염분 영향, 수질개선 대책이 있으면 별도 근거자료로 정리합니다."
    ],
    fields: [
      {
        label: "제목",
        value: "OO군 가뭄대응 물공급 안정화계획에 대한 영산강·섬진강 유역물관리종합계획 부합성 심의 요청"
      },
      {
        label: "요청 개요",
        value: "OO군은 반복적인 가뭄에 대응하기 위하여 지방상수도 비상연계, 소규모 저수지 정비, 대체수원 활용 방안을 포함한 물공급 안정화계획을 수립하고 있습니다. 영산강·섬진강 유역물관리종합계획과의 부합 여부를 검토받고자 심의를 요청드립니다."
      },
      {
        label: "부합성 검토 내용",
        value: "본 계획은 생활용수 공급 안정성 확보와 농업용수 부족 완화를 동시에 고려하고 있으며, 취수량 변화가 하천 유지유량과 수생태에 미치는 영향을 검토하였습니다. 또한 비상연계 운영 시 수질관리 기준과 단계별 가뭄 대응체계를 반영하여 유역계획의 물안전 및 생태회복 방향과 부합하도록 작성하였습니다."
      },
      {
        label: "첨부자료",
        value: "심의요청서 1부, 계획안 요약서 1부, 계획요소 분류표 1부, 비상연계 관망도 1부, 가뭄대응 운영계획 1부"
      }
    ]
  }
];

function buildCopyText(example: BasinExample) {
  return [
    `[${example.name} 유역 심의요청서 작성예시]`,
    `수신: ${example.receiver}`,
    `위원회: ${example.committee}`,
    "",
    ...example.fields.map((field) => `${field.label}\n${field.value}\n`),
    "작성 시 확인사항",
    ...example.focus.map((item, index) => `${index + 1}. ${item}`)
  ].join("\n");
}

export default function BasinExampleGuide() {
  const [selectedId, setSelectedId] = useState(basinExamples[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selected = useMemo(
    () => basinExamples.find((example) => example.id === selectedId) ?? basinExamples[0],
    [selectedId]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildCopyText(selected));
    setCopiedId(selected.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  };

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
          유역을 선택하면 심의요청서에 바로 참고할 수 있는 제목, 요청 개요,
          부합성 검토 내용, 첨부자료 예시를 확인할 수 있습니다.
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
                작성예시 보기
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
                {selected.name} 유역 심의요청서 예시
              </h3>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-xl bg-[#233b6e] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1b2f59]"
            >
              {copiedId === selected.id ? "복사됨" : "예시 복사"}
            </button>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3">
            <div className="text-xs font-bold text-teal-800">작성 시 중점 확인사항</div>
            <ul className="mt-2 space-y-2">
              {selected.focus.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            {selected.fields.map((field) => (
              <div key={field.label} className="rounded-xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
                <div className="text-xs font-bold text-slate-500">{field.label}</div>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-800">
                  {field.value}
                </p>
              </div>
            ))}
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
                심의요청서 다운로드
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

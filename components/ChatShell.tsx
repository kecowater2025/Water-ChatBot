"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import GuidePanel from "./GuidePanel";
import InputBox from "./InputBox";
import MessageList from "./MessageList";
import {
  AnswerCardData,
  ChatApiResponse,
  ChatMessage,
  DiagnosisResultData
} from "@/lib/chat/types";

function sanitizeCaptureStyles(source: HTMLElement, clone: HTMLElement) {
  const sourceElements = [source, ...Array.from(source.querySelectorAll<HTMLElement>("*"))];
  const cloneElements = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>("*"))];

  const normalizeStyleValue = (property: string, value: string) => {
    if (!value) {
      return "";
    }

    const lowered = value.toLowerCase();

    if (
      lowered.includes("lab(") ||
      lowered.includes("lch(") ||
      lowered.includes("oklab(") ||
      lowered.includes("oklch(")
    ) {
      if (property.includes("color")) {
        if (property === "background-color") return "transparent";
        if (property.includes("border")) return "rgb(203, 213, 225)";
        return "rgb(15, 23, 42)";
      }

      if (property === "box-shadow") {
        return "none";
      }

      return "";
    }

    return value;
  };

  sourceElements.forEach((sourceEl, index) => {
    const cloneEl = cloneElements[index];

    if (!cloneEl) {
      return;
    }

    const styles = window.getComputedStyle(sourceEl);

    cloneEl.removeAttribute("class");

    for (let i = 0; i < styles.length; i += 1) {
      const property = styles.item(i);
      const value = normalizeStyleValue(property, styles.getPropertyValue(property));

      if (!value) {
        continue;
      }

      cloneEl.style.setProperty(
        property,
        value,
        styles.getPropertyPriority(property)
      );
    }
  });
}

const formDownloadCard: AnswerCardData = {
  type: "answer_card",
  title: "유역별 서식 다운로드",
  summary:
    "유역별로 필요한 서식을 구분해 바로 다운로드할 수 있도록 구성했습니다.",
  sections: [
    {
      label: "한강",
      items: [
        {
          text: "부합성 심의요청서 다운로드",
          url: "/forms/han-river/buhapseong-review-request.hwp",
          highlight: true
        }
      ]
    },
    {
      label: "금강",
      items: [
        {
          text: "부합성 심의요청서 다운로드",
          url: "/forms/geum-river/buhapseong-review-request.hwp",
          highlight: true
        },
        {
          text: "계획요소 분류표 다운로드",
          url: "/forms/geum-river/plan-element-classification.xlsx",
          highlight: true
        }
      ]
    },
    {
      label: "낙동강",
      items: [
        {
          text: "부합성 심의요청서 다운로드",
          url: "/forms/nakdong-river/buhapseong-review-request.hwp",
          highlight: true
        },
        {
          text: "계획요소 분류표 다운로드",
          url: "/forms/nakdong-river/plan-element-classification.xlsx",
          highlight: true
        }
      ]
    },
    {
      label: "영산강·섬진강",
      items: [
        {
          text: "부합성 심의요청서 다운로드",
          url: "/forms/yeongsan-seomjin-river/buhapseong-review-request.hwp",
          highlight: true
        },
        {
          text: "계획요소 분류표 다운로드",
          url: "/forms/yeongsan-seomjin-river/plan-element-classification.xlsx",
          highlight: true
        }
      ]
    }
  ]
};

const faqButtons = [
  { id: "legal_basis", label: "법적 근거는?" },
  { id: "review_process", label: "심의 절차는?" },
  { id: "target_plan", label: "어떤 계획이 대상인가요?" },
  { id: "when_to_submit", label: "언제 요청하나요?" },
  { id: "where_to_submit", label: "어디에 요청하나요?" },
  { id: "required_documents", label: "무엇을 제출하나요?" }
];

const customMenus = [
  { id: "intro", label: "제도 소개", type: "action", icon: "info" },
  { id: "faq_group", label: "자주 묻는 질문", type: "toggle", icon: "faq" },
  { id: "diagnosis", label: "대상계획별 안내사항", type: "action", icon: "plan" },
  { id: "guide", label: "유역별 작성예시", type: "panel", icon: "guide" },
  { id: "forms", label: "서식 다운로드", type: "link", icon: "download" },
  { id: "contact_info", label: "문의처", type: "action", icon: "contact" }
] as const;

function MenuIcon({ type }: { type: string }) {
  const common = "h-5 w-5 stroke-current";

  switch (type) {
    case "info":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10v6" />
          <circle cx="12" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "faq":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} strokeWidth="1.8">
          <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4H16.5A2.5 2.5 0 0 1 19 6.5V13.5A2.5 2.5 0 0 1 16.5 16H10l-4 4v-4H7.5A2.5 2.5 0 0 1 5 13.5z" />
          <path d="M9.5 9.2a2.2 2.2 0 1 1 3.3 1.9c-.8.5-1.3 1-1.3 1.9" />
          <circle cx="11.5" cy="15" r="0.7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "plan":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} strokeWidth="1.8">
          <path d="M6 4.5h12v15H6z" />
          <path d="M9 8h6M9 11.5h6M9 15h4" />
        </svg>
      );
    case "guide":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} strokeWidth="1.8">
          <path d="M4 15.5V20h4.5L19 9.5 14.5 5 4 15.5z" />
          <path d="M13.5 6.5 17.5 10.5" />
        </svg>
      );
    case "download":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} strokeWidth="1.8">
          <path d="M12 5v9" />
          <path d="m8.5 10.5 3.5 3.5 3.5-3.5" />
          <path d="M5 18.5h14" />
        </svg>
      );
    case "contact":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} strokeWidth="1.8">
          <path d="M12 13.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z" />
          <path d="M5.5 19a7.5 7.5 0 0 1 13 0" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ChatShell() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      type: "text",
      content:
        "안녕하세요. Water-Chat Bot입니다.\n\n부합성 심의제도를 안내해드립니다.\n\n아래의 빠른 메뉴를 누르거나 궁금한 내용을 직접 입력해주세요."
    }
  ]);
  const [showFaqMenu, setShowFaqMenu] = useState(false);
  const [showCustomMenu, setShowCustomMenu] = useState(true);
  const [isGuidePanelOpen, setIsGuidePanelOpen] = useState(false);

  const appendAnswerCard = (card: AnswerCardData) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        type: "answer_card",
        content: card
      }
    ]);
  };

  const appendDiagnosisResult = (result: DiagnosisResultData) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        type: "diagnosis_result",
        content: result
      }
    ]);
  };

  const appendAssistantResponse = (json: ChatApiResponse) => {
    const data = json.data;

    if (data.type === "text") {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          type: "text",
          content: data.content
        }
      ]);
      return;
    }

    if (data.type === "answer_card") {
      appendAnswerCard(data);
      return;
    }

    if (data.type === "process_flow") {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          type: "process_flow",
          content: null
        }
      ]);
      return;
    }

    if (data.type === "diagnosis_result") {
      appendDiagnosisResult(data);
    }
  };

  const handleChatPdfDownload = async () => {
    const source = document.getElementById("chat-export-area");

    if (!source) {
      return;
    }

    const clone = source.cloneNode(true) as HTMLElement;
    const contentWidth = source.scrollWidth || source.clientWidth || 430;
    const contentHeight = source.scrollHeight || source.clientHeight;

    clone.style.width = `${contentWidth}px`;
    clone.style.minHeight = `${contentHeight}px`;
    clone.style.height = "auto";
    clone.style.maxHeight = "none";
    clone.style.overflow = "visible";
    clone.style.background = "#edf1f6";

    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-100000px";
    wrapper.style.top = "0";
    wrapper.style.width = `${contentWidth}px`;
    wrapper.style.background = "#edf1f6";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);
    sanitizeCaptureStyles(source, clone);

    try {
      const canvas = await html2canvas(clone, {
        backgroundColor: "#edf1f6",
        scale: 2,
        useCORS: true,
        logging: false,
        width: contentWidth,
        height: clone.scrollHeight || contentHeight,
        windowWidth: contentWidth,
        windowHeight: clone.scrollHeight || contentHeight,
        scrollX: 0,
        scrollY: 0
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;
      const imageHeight = (canvas.height * usableWidth) / canvas.width;

      let remainingHeight = imageHeight;
      let yOffset = 0;

      pdf.addImage(imgData, "PNG", margin, margin, usableWidth, imageHeight);
      remainingHeight -= usableHeight;

      while (remainingHeight > 0) {
        yOffset -= usableHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, margin + yOffset, usableWidth, imageHeight);
        remainingHeight -= usableHeight;
      }

      pdf.save("buhapseong-chat-history.pdf");
    } finally {
      document.body.removeChild(wrapper);
    }
  };

  const handleSubmit = async (question: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        type: "text",
        content: question
      }
    ]);

    try {
      const res = await fetch("/api/chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      const json: ChatApiResponse = await res.json();
      appendAssistantResponse(json);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          type: "text",
          content: "질문 처리 중 오류가 발생했습니다."
        }
      ]);
    }
  };

  const handleQuickAction = async (id: string, label: string) => {
    if (id === "diagnosis") {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "user",
          type: "text",
          content: label
        },
        {
          id: crypto.randomUUID(),
          role: "assistant",
          type: "diagnosis_flow",
          content: null,
          onComplete: appendDiagnosisResult
        }
      ]);
      return;
    }

    await handleSubmit(label);
  };

  const handleCustomMenuClick = async (
    menuId: string,
    type: "action" | "toggle" | "link" | "panel"
  ) => {
    if (type === "toggle") {
      setShowFaqMenu((prev) => !prev);
      return;
    }

    if (type === "panel") {
      setIsGuidePanelOpen((prev) => !prev);
      return;
    }

    if (type === "link") {
      if (menuId === "forms") {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "user",
            type: "text",
            content: "서식 다운로드"
          }
        ]);
        appendAnswerCard(formDownloadCard);
        return;
      }

      return;
    }

    if (menuId === "intro") {
      await handleQuickAction("intro", "부합성 심의란?");
      return;
    }

    if (menuId === "contact_info") {
      await handleQuickAction("contact_info", "문의처");
      return;
    }

    if (menuId === "diagnosis") {
      await handleQuickAction("diagnosis", "지자체 맞춤 안내 받기");
      return;
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 xl:flex-row xl:items-stretch">
      <section className="flex h-[calc(100dvh-1.5rem)] min-h-[620px] w-full max-w-[430px] flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-[#f4f6fa] shadow-[0_18px_50px_rgba(15,23,42,0.14)] xl:max-h-[860px]">
        <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/keco-logo.png"
                alt="한국환경공단 로고"
                className="h-10 w-10 rounded-full border border-slate-200 bg-white object-cover shadow-sm"
              />

              <div>
                <div className="text-[15px] font-bold text-slate-900">
                  Water-Chat Bot
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  사용자 맞춤형 부합성 AI 컨설턴트
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-1">
              <img
                src="/logos/water-committee.png"
                alt="물관리위원회 로고"
                className="h-5 w-auto object-contain"
              />
              <img
                src="/logos/keco.png"
                alt="한국환경공단 로고"
                className="h-4 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 bg-[#edf1f6]">
          <MessageList messages={messages} containerId="chat-print-area" />
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-[#6f7be0] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="mb-1.5 flex items-center justify-between">
            <div className="text-xs font-semibold tracking-wide text-white/90">
              빠른 메뉴
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-white/80">
                대화 내용 다운로드
              </span>
              <button
                type="button"
                onClick={handleChatPdfDownload}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
                aria-label="대화내용 PDF 저장"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 stroke-current"
                  fill="none"
                  strokeWidth="1.8"
                >
                  <path d="M12 4v9" />
                  <path d="m8.5 10 3.5 3.5 3.5-3.5" />
                  <path d="M5 18.5h14" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setShowCustomMenu((prev) => !prev)}
                className="flex h-5 w-5 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
                aria-label={showCustomMenu ? "빠른 메뉴 닫기" : "빠른 메뉴 열기"}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`h-3 w-3 fill-current transition-transform duration-200 ${
                    showCustomMenu ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                </svg>
              </button>
            </div>
          </div>

          {showCustomMenu && (
            <>
              <div className="grid grid-cols-3 gap-1.5">
                {customMenus.map((menu) => (
                  <button
                    key={menu.id}
                    type="button"
                    onClick={() => handleCustomMenuClick(menu.id, menu.type)}
                    className="flex min-h-[64px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-2 py-2 text-white shadow-sm backdrop-blur-[2px] transition hover:bg-white/18"
                  >
                    <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/14">
                      <MenuIcon type={menu.icon} />
                    </div>
                    <div className="text-center text-[10px] font-semibold leading-3.5">
                      {menu.label}
                    </div>
                  </button>
                ))}
              </div>

              {showFaqMenu && (
                <div className="mt-2 rounded-2xl border border-white/10 bg-white/10 p-2.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="text-xs font-semibold text-white/90">
                      자주 묻는 질문
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowFaqMenu((prev) => !prev)}
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
                      aria-label={showFaqMenu ? "자주 묻는 질문 닫기" : "자주 묻는 질문 열기"}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className={`h-3 w-3 fill-current transition-transform duration-200 ${
                          showFaqMenu ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {faqButtons.map((button) => (
                      <button
                        key={button.id}
                        type="button"
                        onClick={() => handleQuickAction(button.id, button.label)}
                        className="rounded-full border border-white/25 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        {button.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-3">
          <InputBox onSubmit={handleSubmit} />
        </div>
      </section>

      {isGuidePanelOpen ? (
        <GuidePanel
          isOpen={isGuidePanelOpen}
          onClose={() => setIsGuidePanelOpen(false)}
        />
      ) : null}

      <div
        style={{
          position: "fixed",
          left: "-100000px",
          top: 0,
          width: "430px",
          background: "#edf1f6"
        }}
        aria-hidden="true"
      >
        <MessageList
          messages={messages}
          exportMode
          containerId="chat-export-area"
        />
      </div>
    </div>
  );
}

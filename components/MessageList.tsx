"use client";

import { useEffect, useRef, useState } from "react";
import AnswerCard from "./AnswerCard";
import DiagnosisFlow from "./DiagnosisFlow";
import DiagnosisResultCard from "./DiagnosisResultCard";
import ProcessFlowCard from "./ProcessFlowCard";
import {
  ChatMessage,
  DiagnosisResultData
} from "@/lib/chat/types";

function formatTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const period = hours < 12 ? "오전" : "오후";
  const displayHour = hours % 12 || 12;
  return `${period} ${displayHour}:${minutes}`;
}

function MessageTime({ align = "left" }: { align?: "left" | "right" }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(formatTime());
  }, []);

  return (
    <div className={`mt-1 text-[11px] text-slate-500 ${align === "right" ? "text-right" : ""}`}>
      {time}
    </div>
  );
}

export default function MessageList({
  messages,
  exportMode = false,
  containerId
}: {
  messages: ChatMessage[];
  exportMode?: boolean;
  containerId?: string;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const prevLengthRef = useRef(messages.length);

  useEffect(() => {
    if (exportMode) {
      return;
    }

    const lengthIncreased = messages.length > prevLengthRef.current;
    prevLengthRef.current = messages.length;

    if (lengthIncreased) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }
  }, [messages, exportMode]);

  return (
    <div
      id={containerId}
      className={
        exportMode
          ? "px-4 py-4"
          : "h-full min-h-0 overflow-y-auto overscroll-contain px-4 py-4"
      }
    >
      <div className="space-y-4 pb-8">
        {messages.map((message) => {
          if (message.role === "user") {
            return (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[78%]">
                  <div className="rounded-2xl rounded-br-md bg-[#5f6fd8] px-4 py-2.5 text-sm font-medium leading-7 text-white shadow-[0_8px_20px_rgba(95,111,216,0.22)]">
                    {message.content}
                  </div>
                  <MessageTime align="right" />
                </div>
              </div>
            );
          }

          if (message.type === "text") {
            return (
              <div key={message.id} className="flex items-start gap-2">
                <img
                  src="/keco-logo.png"
                  alt="봇 프로필"
                  className="mt-1 h-9 w-9 shrink-0 rounded-full border border-slate-200 bg-white object-cover shadow-sm"
                />

                <div className="max-w-[82%]">
                  <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-8 text-slate-800 shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
                    {message.content.split("\n").map((line, index) => (
                      <div key={index}>{line === "" ? <div className="h-2" /> : line}</div>
                    ))}
                  </div>
                  <MessageTime />
                </div>
              </div>
            );
          }

          if (message.type === "answer_card") {
            return (
              <div key={message.id} className="flex items-start gap-2">
                <img
                  src="/keco-logo.png"
                  alt="봇 프로필"
                  className="mt-1 h-9 w-9 shrink-0 rounded-full border border-slate-200 bg-white object-cover shadow-sm"
                />
                <div className="max-w-[86%]">
                  <AnswerCard data={message.content} />
                  <MessageTime />
                </div>
              </div>
            );
          }

          if (message.type === "process_flow") {
            return (
              <div key={message.id} className="flex items-start gap-2">
                <img
                  src="/keco-logo.png"
                  alt="봇 프로필"
                  className="mt-1 h-9 w-9 shrink-0 rounded-full border border-slate-200 bg-white object-cover shadow-sm"
                />
                <div className="max-w-[86%]">
                  <ProcessFlowCard />
                  <MessageTime />
                </div>
              </div>
            );
          }

          if (message.type === "diagnosis_flow") {
            return (
              <div key={message.id} className="flex items-start gap-2">
                <img
                  src="/keco-logo.png"
                  alt="봇 프로필"
                  className="mt-1 h-9 w-9 shrink-0 rounded-full border border-slate-200 bg-white object-cover shadow-sm"
                />
                <div className="max-w-[86%]">
                  <DiagnosisFlow
                    onComplete={message.onComplete as (result: DiagnosisResultData) => void}
                  />
                  <MessageTime />
                </div>
              </div>
            );
          }

          if (message.type === "diagnosis_result") {
            return (
              <div key={message.id} className="flex items-start gap-2">
                <img
                  src="/keco-logo.png"
                  alt="봇 프로필"
                  className="mt-1 h-9 w-9 shrink-0 rounded-full border border-slate-200 bg-white object-cover shadow-sm"
                />
                <div className="max-w-[86%]">
                  <DiagnosisResultCard data={message.content} />
                  <MessageTime />
                </div>
              </div>
            );
          }

          return null;
        })}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default function MessageBubble({
  role,
  content
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] whitespace-pre-line rounded-2xl rounded-tr-md bg-[#fee500] px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <img
        src="/keco-logo.png"
        alt="한국환경공단 로고"
        className="mt-1 h-9 w-9 shrink-0 rounded-full border border-slate-200 bg-white object-cover"
      />

      <div className="max-w-[78%] whitespace-pre-line rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-6 text-slate-800 shadow-sm">
        {content}
      </div>
    </div>
  );
}
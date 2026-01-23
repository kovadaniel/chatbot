import { useRef, useState } from "react";
import { useChatStore } from "../../../store/chatStore";
import ScrollButton from "./ScrollButton";

const History = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const isScrollingRef = useRef(false);

  const { messages } = useChatStore();

  function handleScroll() {
    if (isScrollingRef.current) return;

    const el = containerRef.current;
    if (!el) return;

    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;

    setShowScrollBtn(!isAtBottom);
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="relative flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-slate-50"
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow
                ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-white text-slate-800 rounded-bl-sm"
                }`}
          >
            <p className="whitespace-pre-wrap">{msg.text}</p>
            <div className="text-[10px] mt-1 text-right opacity-70">
              {msg.time}
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
      {showScrollBtn && (
        <ScrollButton bottomRef={bottomRef} isScrollingRef={isScrollingRef} />
      )}
    </div>
  );
};

export default History;

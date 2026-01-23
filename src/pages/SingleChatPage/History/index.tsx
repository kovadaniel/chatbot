import { useRef, useState, useEffect, useCallback } from "react";
import { useChatStore } from "../../../store/chatStore";
import ScrollButton from "./ScrollButton";
import { SCROLL_BOTTOM_THRESHOLD } from "../../../config/consts";
import { renderMarkdown } from "../../../utils/markdown";

const History = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const isScrollingRef = useRef(false);
  const userScrolledUpRef = useRef(false);
  const lastMessageLengthRef = useRef(0);

  const { messages, isStreaming } = useChatStore();

  const isAtBottom = useCallback((el: HTMLDivElement): boolean => {
    return el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_BOTTOM_THRESHOLD;
  }, []);

  const scrollToBottom = useCallback((smooth = false) => {
    const el = containerRef.current;
    if (!el) return;

    isScrollingRef.current = true;
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, smooth ? 600 : 100);
  }, []);

  const handleScroll = useCallback(() => {
    if (isScrollingRef.current) return;

    const el = containerRef.current;
    if (!el) return;

    const atBottom = isAtBottom(el);
    setShowScrollBtn(!atBottom);

    if (isStreaming && !atBottom) {
      userScrolledUpRef.current = true;
    }

    if (atBottom) {
      userScrolledUpRef.current = false;
    }
  }, [isAtBottom, isStreaming]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!isStreaming) {
      userScrolledUpRef.current = false;
      lastMessageLengthRef.current = 0;
      return;
    }

    if (isAtBottom(el) && !userScrolledUpRef.current) {
      userScrolledUpRef.current = false;
      scrollToBottom(false);
    }

    if (userScrolledUpRef.current) return;

    const lastMessage = messages[messages.length - 1];
    const currentMessageLength = lastMessage?.text.length || 0;

    if (currentMessageLength !== lastMessageLengthRef.current) {
      lastMessageLengthRef.current = currentMessageLength;
      requestAnimationFrame(() => {
        if (!userScrolledUpRef.current && el) {
          scrollToBottom(false);
        }
      });
    }
  }, [messages, isStreaming, isAtBottom, scrollToBottom]);

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
            <p className="whitespace-pre-wrap">{renderMarkdown(msg.text)}</p>
            <div className="text-[10px] mt-1 text-right opacity-70">
              {msg.time}
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
      {showScrollBtn && (
        <ScrollButton
          bottomRef={bottomRef}
          isScrollingRef={isScrollingRef}
          onScroll={() => {
            userScrolledUpRef.current = false;
          }}
        />
      )}
    </div>
  );
};

export default History;

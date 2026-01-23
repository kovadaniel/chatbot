import { useEffect, useRef, useCallback, type RefObject } from "react";
import { useChatStore } from "../../../store/chatStore";

const ScrollButton = ({
  bottomRef,
  isScrollingRef,
}: {
  bottomRef: RefObject<HTMLDivElement | null>;
  isScrollingRef: RefObject<boolean>;
}) => {
  const { messages } = useChatStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    isScrollingRef.current = true;
    bottomRef?.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
    
    timeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      timeoutRef.current = null;
    }, smooth ? 600 : 100);
  }, [bottomRef, isScrollingRef]);

  const lastMessageLength = messages[messages.length - 1]?.text.length || 0;

  useEffect(() => {
    if (lastMessageLength) {
      scrollToBottom(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [lastMessageLength, scrollToBottom]);

  return (
    <button
      onClick={() => {
        scrollToBottom();
      }}
      className="fixed bottom-24 right-6 bg-white shadow-lg rounded-full px-4 py-2 text-sm font-medium hover:bg-slate-100"
    >
      ↓ Вниз
    </button>
  );
};

export default ScrollButton;

import { useRef, useCallback, type RefObject } from "react";

const ScrollButton = ({
  bottomRef,
  isScrollingRef,
  onScroll,
}: {
  bottomRef: RefObject<HTMLDivElement | null>;
  isScrollingRef: RefObject<boolean>;
  onScroll?: () => void;
}) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = useCallback(
    (smooth = true) => {
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
        onScroll?.();
      }, smooth ? 600 : 100);
    },
    [bottomRef, isScrollingRef, onScroll],
  );

  return (
    <button
      onClick={() => scrollToBottom(true)}
      className="sticky bottom-0 left-[90%] bg-white shadow-lg rounded-full px-4 py-2 text-sm font-medium hover:bg-slate-100"
    >
      ↓ Вниз
    </button>
  );
};

export default ScrollButton;

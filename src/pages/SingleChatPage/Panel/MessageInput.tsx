import { useState, useRef, useEffect } from "react";

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
};

const MessageInput = ({
  value,
  onChange,
  onSend,
  placeholder = "Write a message...",
}: MessageInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative flex-1">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        rows={1}
        className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black resize-none overflow-hidden min-h-[44px] max-h-[120px] leading-5"
      />
      {isFocused && value.length === 0 && (
        <div className="absolute bottom-full left-0 mb-2 p-2.5 bg-white border border-slate-200 rounded-lg shadow-lg text-xs text-slate-600 min-w-[280px]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">**bold**</span>
              <span className="text-slate-400">or</span>
              <span className="font-semibold text-slate-800">__bold__</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                `code`
              </code>
              <span className="text-slate-500">for inline code</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                ```code```
              </code>
              <span className="text-slate-500">for code blocks</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;

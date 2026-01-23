import { useRef, useState } from "react";
import { useChatStore } from "../../../store/chatStore";
import { generateText } from "../../../utils/generateText";

const Panel = () => {
  const { addUserMessage, startBotMessage, appendToMessage } = useChatStore();
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chunkBuffer = useRef("");
  const streamingId = useRef<number | null>(null);
  const streamRef = useRef<{ stop: () => void } | null>(null)

  const handleSend = () => {
    if (!input.trim()) return;
    addUserMessage(input);
    setInput("");
  };

  function handleStop() {
    streamRef.current?.stop();
    streamRef.current = null;
    setIsStreaming(false);
  }

  const handleGenerate = () => {
    if (isStreaming) return;

    addUserMessage("Generate a very long answer");
    const assistantId = startBotMessage();
    streamingId.current = assistantId;
    setIsStreaming(true);

    let rafId: number;
    const flush = () => {
      if (chunkBuffer.current && streamingId.current) {
        appendToMessage(streamingId.current, chunkBuffer.current);
        chunkBuffer.current = "";
      }
      rafId = requestAnimationFrame(flush);
    };
    rafId = requestAnimationFrame(flush);

    streamRef.current = generateText({
      interval: 15,
      totalWords: 10000,
      onChunk: (chunk) => {
        chunkBuffer.current += chunk;
      },
      onDone: () => {
        cancelAnimationFrame(rafId);
        setIsStreaming(false);
        streamRef.current = null;
      },
    });
  };

  return (
    <div className="h-16 border-t flex items-center gap-3 px-4">
      <input
        type="text"
        placeholder="Write a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium transition"
      >
        Отправить
      </button>
      {!isStreaming && <button
        onClick={handleGenerate}
        className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium"
      >
        Сгенерировать
      </button>}
      {isStreaming && (
        <button
          onClick={handleStop}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium"
        >
          Остановить генерацию
        </button>
      )}
    </div>
  );
};

export default Panel;

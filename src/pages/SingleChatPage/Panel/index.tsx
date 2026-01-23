import { useState } from "react";
import { useChatStore } from "../../../store/chatStore";

const Panel = () => {
  const { addUserMessage, isStreaming, startGeneration, stopGeneration } = useChatStore();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    addUserMessage(input);
    setInput("");
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
      {!isStreaming && (
        <button
          onClick={startGeneration}
          className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium"
        >
          Сгенерировать
        </button>
      )}
      {isStreaming && (
        <button
          onClick={stopGeneration}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium"
        >
          Остановить генерацию
        </button>
      )}
    </div>
  );
};

export default Panel;

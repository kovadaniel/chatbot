import { useEffect, useRef } from "react";
import { useChatStore } from "../../../store/chatStore";

const History = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { messages } = useChatStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.sender === "me" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow
                ${
                  msg.sender === "me"
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
      <div ref={messagesEndRef} />
    </div>
  );
};

export default History;

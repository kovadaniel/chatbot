import { useState, useRef, useEffect } from "react"

import { useChatStore } from "../../store/chatStore"

export default function SingleChatPage() {
  const { messages, sendMessage } = useChatStore()
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput("")
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex h-screen bg-slate-100 justify-center items-center">
      <div className="flex flex-col w-full max-w-3xl h-full bg-white shadow-xl">

        <header className="h-16 border-b flex items-center px-6 gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-300" />
          <div className="text-black">
            <div className="font-semibold">John Doe</div>
            <div className="text-xs text-green-500">online</div>
          </div>
        </header>

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

        {/* Input */}
        <footer className="h-16 border-t flex items-center gap-3 px-4">
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
            Send
          </button>
        </footer>
      </div>
    </div>
  )
}

import { create } from "zustand"

export type Message = {
  id: number
  text: string
  sender: "me" | "other"
  time: string
}

type ChatState = {
  messages: Message[]
  sendMessage: (text: string) => void
}

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: 1,
      text: "Hello world!",
      sender: "other",
      time: getTime(),
    },
  ],

  sendMessage: (text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now(),
          text,
          sender: "me",
          time: getTime(),
        },
      ],
    })),
}))

import { create } from "zustand";

export type Message = {
  id: number;
  text: string;
  role: "user" | "bot";
  time: string;
};

type ChatState = {
  messages: Message[];
  addUserMessage: (text: string) => void;
  startBotMessage: () => number;
  appendToMessage: (id: number, chunk: string) => void;
  clear: () => void;
};

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addUserMessage: (text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now(),
          role: "user",
          text: text,
          time: getTime(),
        },
      ],
    })),
  startBotMessage: () => {
    const id = Date.now() + Math.random() * 1000;
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id,
          role: "bot",
          text: "",
          time: getTime(),
        },
      ],
    }));
    return id;
  },
  appendToMessage: (id, chunk) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, text: m.text + chunk } : m,
      ),
    })),

  clear: () => set({ messages: [] }),
}));

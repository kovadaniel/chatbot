import { create } from "zustand";
import { generateText } from "../utils/generateText";

export type Message = {
  id: number;
  text: string;
  role: "user" | "bot";
  time: string;
};

type ChatState = {
  messages: Message[];
  isStreaming: boolean;
  addUserMessage: (text: string) => void;
  startBotMessage: () => number;
  appendToMessage: (id: number, chunk: string) => void;
  startGeneration: () => void;
  stopGeneration: () => void;
  clear: () => void;
};

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const useChatStore = create<ChatState>((set, get) => {
  let chunkBuffer = "";
  let streamingId: number | null = null;
  let rafId: number | null = null;
  let streamRef: { stop: () => void } | null = null;

  const flush = () => {
    if (chunkBuffer && streamingId !== null) {
      get().appendToMessage(streamingId, chunkBuffer);
      chunkBuffer = "";
    }
    if (get().isStreaming) {
      rafId = requestAnimationFrame(flush);
    }
  };

  return {
    messages: [],
    isStreaming: false,
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
    startGeneration: () => {
      if (get().isStreaming) return;

      get().addUserMessage("Generate a very long answer");
      const assistantId = get().startBotMessage();
      streamingId = assistantId;
      set({ isStreaming: true });

      rafId = requestAnimationFrame(flush);

      streamRef = generateText({
        interval: 15,
        totalWords: 10000,
        onChunk: (chunk) => {
          chunkBuffer += chunk;
        },
        onDone: () => {
          if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          set({ isStreaming: false });
          streamRef = null;
          chunkBuffer = "";
          streamingId = null;
        },
      });
    },
    stopGeneration: () => {
      streamRef?.stop();
      streamRef = null;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      set({ isStreaming: false });
      chunkBuffer = "";
      streamingId = null;
    },
    clear: () => {
      if (streamRef) {
        streamRef.stop();
        streamRef = null;
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      chunkBuffer = "";
      streamingId = null;
      set({ messages: [], isStreaming: false });
    },
  };
});

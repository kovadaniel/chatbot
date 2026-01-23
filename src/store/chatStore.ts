import { create } from "zustand";
import type { ChatState } from "./types";
import { createUserMessage, createBotMessage } from "./messageHandlers";
import { createGenerationService } from "./generationService";


export const useChatStore = create<ChatState>((set, get) => {
  const generationService = createGenerationService(set, get);

  return {
    messages: [],
    isStreaming: false,

    addUserMessage: (text) => {
      const newMessage = createUserMessage(text);
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    },

    startBotMessage: () => {
      return createBotMessage(set);
    },

    appendToMessage: (id, chunk) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === id ? { ...m, text: m.text + chunk } : m,
        ),
      }));
    },

    startGeneration: () => {
      generationService.startGeneration();
    },

    stopGeneration: () => {
      generationService.stopGeneration();
    },

    clear: () => {
      generationService.cleanup();
      set({ messages: [], isStreaming: false });
    },
  };
});

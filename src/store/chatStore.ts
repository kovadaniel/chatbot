import { create } from "zustand";
import type { ChatState } from "./types";
import { MessageHandlerService } from "../services/MessageHandlerService";
import { GenerationService } from "../services/generationService";

export const useChatStore = create<ChatState>((set, get) => {
  const storeApi = {
    setState: set,
    getState: get,
  };
  const generationService = new GenerationService(storeApi);
  const messageHandler = new MessageHandlerService(storeApi);

  return {
    messages: [],
    isStreaming: false,

    addUserMessage: (text) => {
      const newMessage = messageHandler.createUserMessage(text);
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    },

    startBotMessage: () => {
      return messageHandler.createBotMessage();
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

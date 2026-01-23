import { generateText } from "../utils/generateText";
import type { StreamingState } from "./types";
import { getOrCreateTargetMessage } from "./messageHandlers";

type SetState = (state: StreamingState) => void;
type GetState = () => {
  messages: { id: number; text: string; role: "user" | "bot"; time: string }[];
  isStreaming: boolean;
  appendToMessage: (id: number, chunk: string) => void;
};

export function createGenerationService(set: SetState, get: GetState) {
  const state: StreamingState = {
    chunkBuffer: "",
    streamingId: null,
    rafId: null,
    streamRef: null,
  };

  const flush = (): void => {
    if (state.chunkBuffer && state.streamingId !== null) {
      get().appendToMessage(state.streamingId, state.chunkBuffer);
      state.chunkBuffer = "";
    }
    if (get().isStreaming) {
      state.rafId = requestAnimationFrame(flush);
    }
  };

  const initializeStreamingState = (targetMessageId: number): void => {
    state.streamingId = targetMessageId;
    set({ isStreaming: true });
    state.rafId = requestAnimationFrame(flush);
  };

  const handleGenerationComplete = (): void => {
    if (state.rafId !== null) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    set({ isStreaming: false });
    state.streamRef = null;
    state.chunkBuffer = "";
    state.streamingId = null;
  };

  const startTextGeneration = (): void => {
    state.streamRef = generateText({
      interval: 15,
      totalWords: 10000,
      onChunk: (chunk) => {
        state.chunkBuffer += chunk;
      },
      onDone: handleGenerationComplete,
    });
  };

  const stopTextGeneration = (): void => {
    state.streamRef?.stop();
    state.streamRef = null;
  };

  const cancelAnimationFrameIfActive = (): void => {
    if (state.rafId !== null) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
  };

  const resetStreamingState = (): void => {
    state.chunkBuffer = "";
    state.streamingId = null;
  };

  return {
    startGeneration: (): void => {
      if (get().isStreaming) return;

      const targetMessageId = getOrCreateTargetMessage(
        () => get(),
        set as any,
      );

      initializeStreamingState(targetMessageId);
      startTextGeneration();
    },

    stopGeneration: (): void => {
      stopTextGeneration();
      cancelAnimationFrameIfActive();
      set({ isStreaming: false });
      resetStreamingState();
    },

    cleanup: (): void => {
      stopTextGeneration();
      cancelAnimationFrameIfActive();
      resetStreamingState();
    },
  };
}

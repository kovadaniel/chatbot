import { generateText } from "../utils/generateText";
import type { StreamingState, ChatState } from "../store/types";
import { MessageHandlerService } from "./MessageHandlerService";
import type { StoreApi } from "zustand";

type StoreAccess = Pick<StoreApi<ChatState>, "setState" | "getState">;

export class GenerationService {
  private state: StreamingState;
  private store: StoreAccess;
  private messageHandler: MessageHandlerService;

  constructor(store: StoreAccess) {
    this.store = store;
    this.messageHandler = new MessageHandlerService(store);
    this.state = {
      chunkBuffer: "",
      streamingId: null,
      rafId: null,
      streamRef: null,
    };
  }

  private flush = (): void => {
    if (this.state.chunkBuffer && this.state.streamingId !== null) {
      this.store.getState().appendToMessage(
        this.state.streamingId,
        this.state.chunkBuffer,
      );
      this.state.chunkBuffer = "";
    }
    if (this.store.getState().isStreaming) {
      this.state.rafId = requestAnimationFrame(this.flush);
    }
  };

  private initializeStreamingState = (targetMessageId: number): void => {
    this.state.streamingId = targetMessageId;
    this.store.setState({ isStreaming: true });
    this.state.rafId = requestAnimationFrame(this.flush);
  };

  private handleGenerationComplete = (): void => {
    if (this.state.rafId !== null) {
      cancelAnimationFrame(this.state.rafId);
      this.state.rafId = null;
    }
    this.store.setState({ isStreaming: false });
    this.state.streamRef = null;
    this.state.chunkBuffer = "";
    this.state.streamingId = null;
  };

  private startTextGeneration = (): void => {
    this.state.streamRef = generateText({
      interval: 15,
      totalWords: 10000,
      onChunk: (chunk) => {
        this.state.chunkBuffer += chunk;
      },
      onDone: this.handleGenerationComplete,
    });
  };

  private stopTextGeneration = (): void => {
    this.state.streamRef?.stop();
    this.state.streamRef = null;
  };

  private cancelAnimationFrameIfActive = (): void => {
    if (this.state.rafId !== null) {
      cancelAnimationFrame(this.state.rafId);
      this.state.rafId = null;
    }
  };

  private resetStreamingState = (): void => {
    this.state.chunkBuffer = "";
    this.state.streamingId = null;
  };

  startGeneration = (): void => {
    if (this.store.getState().isStreaming) return;

    const targetMessageId = this.messageHandler.getOrCreateTargetMessage();

    this.initializeStreamingState(targetMessageId);
    this.startTextGeneration();
  };

  stopGeneration = (): void => {
    this.stopTextGeneration();
    this.cancelAnimationFrameIfActive();
    this.store.setState({ isStreaming: false });
    this.resetStreamingState();
  };

  cleanup = (): void => {
    this.stopTextGeneration();
    this.cancelAnimationFrameIfActive();
    this.resetStreamingState();
  };
}

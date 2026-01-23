export type Message = {
  id: number;
  text: string;
  role: "user" | "bot";
  time: string;
};

export type ChatState = {
  messages: Message[];
  isStreaming: boolean;
  addUserMessage: (text: string) => void;
  startBotMessage: () => number;
  appendToMessage: (id: number, chunk: string) => void;
  startGeneration: () => void;
  stopGeneration: () => void;
  clear: () => void;
};

export type StreamingState = {
  chunkBuffer: string;
  streamingId: number | null;
  rafId: number | null;
  streamRef: { stop: () => void } | null;
};

import type { Message } from "./types";

export function getTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function findLastUserMessage(
  messages: Message[],
): Message | undefined {
  return [...messages].reverse().find((msg) => msg.role === "user");
}

export function createMessageId(): number {
  return Date.now();
}

export function createBotMessageId(): number {
  return Date.now() + Math.random() * 1000;
}

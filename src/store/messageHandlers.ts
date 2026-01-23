import type { Message } from "./types";
import {
  getTime,
  findLastUserMessage,
  createMessageId,
  createBotMessageId,
} from "./messageUtils";

type SetState = (updater: (state: any) => any) => void;
type GetState = () => { messages: Message[] };

export function createUserMessage(text: string): Message {
  return {
    id: createMessageId(),
    role: "user",
    text,
    time: getTime(),
  };
}

export function createEmptyUserMessage(set: SetState): number {
  const newMessageId = createMessageId();
  const newMessage: Message = {
    id: newMessageId,
    role: "user",
    text: "",
    time: getTime(),
  };

  set((state: any) => ({
    ...state,
    messages: [...state.messages, newMessage],
  }));

  return newMessageId;
}

export function getOrCreateTargetMessage(
  get: GetState,
  set: SetState,
): number {
  const state = get();
  const lastUserMessage = findLastUserMessage(state.messages);

  if (lastUserMessage) {
    return lastUserMessage.id;
  }

  return createEmptyUserMessage(set);
}

export function createBotMessage(set: SetState): number {
  const id = createBotMessageId();
  const botMessage: Message = {
    id,
    role: "bot",
    text: "",
    time: getTime(),
  };

  set((state: any) => ({
    ...state,
    messages: [...state.messages, botMessage],
  }));

  return id;
}

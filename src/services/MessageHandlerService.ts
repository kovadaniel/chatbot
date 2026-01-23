import type { Message, ChatState } from "../store/types";
import {
  getTime,
  findLastUserMessage,
  createMessageId,
  createBotMessageId,
} from "../utils/message";
import type { StoreApi } from "zustand";

type StoreAccess = Pick<StoreApi<ChatState>, "setState" | "getState">;

export class MessageHandlerService {
  private store: StoreAccess;

  constructor(store: StoreAccess) {
    this.store = store;
  }

  createUserMessage(text: string): Message {
    return {
      id: createMessageId(),
      role: "user",
      text,
      time: getTime(),
    };
  }

  private createEmptyUserMessage(): number {
    const newMessageId = createMessageId();
    const newMessage: Message = {
      id: newMessageId,
      role: "user",
      text: "",
      time: getTime(),
    };

    this.store.setState((state) => ({
      ...state,
      messages: [...state.messages, newMessage],
    }));

    return newMessageId;
  }

  getOrCreateTargetMessage(): number {
    const lastUserMessage = findLastUserMessage(
      this.store.getState().messages,
    );

    if (lastUserMessage) {
      return lastUserMessage.id;
    }

    return this.createEmptyUserMessage();
  }

  createBotMessage(): number {
    const id = createBotMessageId();
    const botMessage: Message = {
      id,
      role: "bot",
      text: "",
      time: getTime(),
    };

    this.store.setState((state) => ({
      ...state,
      messages: [...state.messages, botMessage],
    }));

    return id;
  }
}

import ollama, { ChatResponse } from "ollama/browser";
import { WithOutNextComplete } from "@/types/rxjs";
import { BehaviorSubject } from "rxjs";
import { ModelService } from "./model.service";
import { TextFileService } from "./text-file.service";

export interface Message {
  isAI: boolean;
  message: string;
}

export interface Conversation {
  path: string;
  messages: Message[];
}

export class ChatService {
  private static _controller: { abort: () => void } | null = null;
  private static _conversations = new Map<string, Conversation>();

  private static _currentConversation$ = new BehaviorSubject<Conversation | null>(null);
  private static _messageStreaming$ = new BehaviorSubject<string | null>(null);
  private static _answering$ = new BehaviorSubject<boolean>(false);

  public static currentConversation$ = this._currentConversation$ as WithOutNextComplete<typeof this._currentConversation$>;
  public static messageStreaming$ = this._messageStreaming$ as WithOutNextComplete<typeof this._messageStreaming$>;
  public static answering$ = this._answering$ as WithOutNextComplete<typeof this._answering$>;

  public static upsertCurrentConversation(path: string) {
    let conversation = this._conversations.get(path);
    if (!conversation) {
      conversation = { path, messages: [] };
      this._conversations.set(path, conversation);
    }

    this._currentConversation$.next(conversation);
    this._messageStreaming$.next(null);
    this._answering$.next(false);
    this._controller = null;
  }

  public static async sendMessage(message: string) {
    const conversation = this._currentConversation$.getValue();
    if (!conversation) return;
    const newConversation = {
      ...conversation,
      messages: [...conversation.messages, { isAI: false, message }]
    }

    this._conversations.set(conversation.path, newConversation);
    this._currentConversation$.next(newConversation);

    const model = ModelService.selectedModel$.getValue();
    if (!model) return;

    const messagesToFeed = [
      {
        role: "system",
        content: `
        You are a software developer that have deep knowledge in almost all programming languages.
        Here is the code you are working on:
        \`\`\`
        ${TextFileService.openingFile$.getValue()?.content}
        \`\`\.
        Return the result in markdown format.
        Please answer the following questions:
        `
      },
      ...newConversation.messages.map(msg => ({
        role: msg.isAI ? "assistant" : "user",
        content: msg.message,
      })),
    ];

    this._answering$.next(true);
    const stream = await ollama.chat({
      stream: true,
      model: model.name,
      keep_alive: -1,
      messages: messagesToFeed
    })

    this._controller = stream;

    for await (const response of stream) {
      const message = (this.messageStreaming$.value ?? '') + response.message.content;

      if (response.done) {
        const conversation = {
          ...newConversation,
          messages: [...newConversation.messages, { isAI: true, message }]
        }

        this._conversations.set(conversation.path, conversation);
        this._currentConversation$.next(conversation);
        this._messageStreaming$.next(null);
        this._controller = null;
        this._answering$.next(false);
        return;
      }

      this._messageStreaming$.next(message);
    }
  }

  public static stopMessageStreaming() {
    if (!this._controller) return;
    try {
      this._controller.abort();
    } catch (error) {
    }

    this._controller = null;
    this._messageStreaming$.next(null);
    this._answering$.next(false);
  }
}
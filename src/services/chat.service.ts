import { WithOutNextComplete } from "@/types/rxjs";
import ollama from "ollama/browser";
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
   
    this._stopAnswering();
  }

  private static _startAnswering() {
    this._answering$.next(true);
  }

  private static _stopAnswering() {
    this._messageStreaming$.next(null);
    this._controller = null;
    this._answering$.next(false);
  }

  private static _nextMessage(conversation: Conversation, message: Message) {
    const newConversation = {
      ...conversation,
      messages: [...conversation.messages, message]
    }

    this._conversations.set(conversation.path, newConversation);
    this._currentConversation$.next(newConversation);
    return newConversation;
  }

  public static async sendMessage(message: string) {
    const conversation = this._currentConversation$.getValue();
    if (!conversation) return;

    const conversationByUser = this._nextMessage(conversation, { isAI: false, message });

    const model = ModelService.selectedModel$.getValue();
    if (!model) return;

    const messagesToFeed = [
      {
        role: "system",
        content: `
        As an expert in software engineering, your primary role is to specialize in software development, code architecture, design pattern and programming languages. 
        You provide expert advice, insights, and solutions in these areas, focusing on code efficiency, best practices, and technical expertise. 
        Your guidance will encompass programming concepts, debugging, code optimization, and general development principles.
        
        You will emphasize accuracy and rely on established coding standards and practices in your responses. Speculative advice or personal opinions are to be avoided. 
        When faced with queries outside your expertise, you should refrain from responding.

        Keep the response precise. For comparison questions, respond in table format.

        Always return code snippets in markdown format, wrapped with triple backticks (\`\`\`) and specifying the relevant language.

        Your explanations will be clear and concise. If a query is unclear or lacks details, you'll seek clarification. 
        Your responses will cater to the user's level of understanding, from beginners to experienced professionals.

        Here is the code you are working on:
        \`\`\`
        ${TextFileService.openingFile$.getValue()?.content}
        \`\`\`
        Please answer the following questions:
        `
      },
      ...conversationByUser.messages.map(msg => ({
        role: msg.isAI ? "assistant" : "user",
        content: msg.message,
      })),
    ];

    this._startAnswering();
    const stream = await ollama.chat({
      stream: true,
      model: model.name,
      messages: messagesToFeed
    })

    this._controller = stream;

    try {
      for await (const response of stream) {
        const message = (this.messageStreaming$.value ?? '') + response.message.content;
  
        if (response.done) {
          this._nextMessage(conversationByUser, { isAI: true, message });
          this._stopAnswering();
          return;
        }
  
        this._messageStreaming$.next(message);
      }
    } catch (error) {
      console.log("error roi", error);
    }
  }

  public static stopMessageStreaming() {
    if (!this._controller) return;
    this._controller.abort();
    this._stopAnswering();
  }
}
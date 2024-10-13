import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import { BubbleAI, BubbleUser } from "./bubble";
import { Message } from "@/services/chat.service";
import { useRef } from "react";
import { Send, StopCircle } from "lucide-react";

interface PanelProps {
  messages: Message[];
  answering: boolean;
  messageStreaming: string | null;
  onSendMessage: (message: string) => void;
  onStopMessageStreaming: () => void;
}

export const Panel = ({
  answering,
  messages,
  messageStreaming,
  onSendMessage,
  onStopMessageStreaming,
}: PanelProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (messageStreaming || answering) return;
    const input = inputRef.current?.value;
    if (!input) return;

    if (inputRef.current) {
      onSendMessage(input);
      inputRef.current.value = "";
    }
  }

  const stopStreamingMessage = () => {
    if (!messageStreaming) return;
    onStopMessageStreaming();
  }

  return (
    <PopoverContent side="top" align="end" alignOffset={40} className="w-[480px]">
      <div className="h-full">
        <div className="h-[400px] overflow-auto">
          <div className="pr-4 h-[400px] overflow-auto min-w-full table">
            {/* Chat Message AI */}
            {messages.map((msg, index) => msg.isAI ? (
              <BubbleAI key={index} message={msg.message} />
            ) : (
              <BubbleUser key={index} message={msg.message} />
            ))}

            {messageStreaming && (
              <BubbleAI message={messageStreaming} />
            )}

            {answering && !messageStreaming && (
              <BubbleAI thinking />
            )}
          </div>
        </div>

        {/* Input box */}
        <div className="flex items-center pt-0">
          <div className="flex items-center justify-center w-full space-x-2">
            <input
              className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder="Type your message"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              ref={inputRef}
            />
            {!messageStreaming ? (
              <Button disabled={answering} className="gap-1" onClick={handleSendMessage}>
                <Send size={16}/> Send
              </Button>
            ) : (
              <Button className="gap-1" onClick={stopStreamingMessage}>
                <StopCircle size={16} /> Stop
              </Button>
            )}
          </div>
        </div>
      </div>
    </PopoverContent>
  );
}

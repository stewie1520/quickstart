import { Chat } from "@/components/chat";
import { useBehaviorMapper, useUnsubscribe } from "@/hooks";
import { TextFileService } from "@/services/text-file.service";
import { useEffect } from "react";
import { filter, takeUntil } from "rxjs";
import { ChatService } from "@/services/chat.service";

export const CodeChat = () => {
  const currentConversation = useBehaviorMapper(ChatService.currentConversation$);
  const unsubscribed$ = useUnsubscribe();
  const messageStreaming = useBehaviorMapper(ChatService.messageStreaming$);
  const answering = useBehaviorMapper(ChatService.answering$);

  useEffect(() => {
    TextFileService.openingFile$
      .pipe(
        takeUntil(unsubscribed$),
        filter(file => !!file)
      ).subscribe(file => {
        ChatService.upsertCurrentConversation(file.path)
      })
  }, []);

  const handleNewMessage = async (message: string) => {
    if (messageStreaming) return;

    await ChatService.sendMessage(message);
  }

  const handleStopMessageStreaming = () => {
    ChatService.stopMessageStreaming();
  }
  
  if (!currentConversation) {
    return null;
  }

  return (
    <Chat.Root>
      <Chat.FAB/>
      <Chat.Panel
        answering={answering}
        messages={currentConversation.messages}
        messageStreaming={messageStreaming}
        onSendMessage={handleNewMessage}
        onStopMessageStreaming={handleStopMessageStreaming}
      />
    </Chat.Root>
  )
}

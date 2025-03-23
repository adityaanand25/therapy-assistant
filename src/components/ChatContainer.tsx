import { useRef, useEffect } from "react";
import { Bot } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import type { ChatState } from "../types";

interface ChatContainerProps {
  state: ChatState;
}

export function ChatContainer({ state }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages]);

  return (
    <div className="flex-grow h-[600px] overflow-y-auto p-6 space-y-6">
      {state.messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {state.isTyping && (
        <div className="flex gap-2 items-center text-gray-500 animate-pulse">
          <Bot className="w-8 h-8 text-blue-500" />
          <div className="typing-indicator flex gap-1">
            <span className="dot w-2 h-2 bg-gray-500 rounded-full"></span>
            <span className="dot w-2 h-2 bg-gray-500 rounded-full"></span>
            <span className="dot w-2 h-2 bg-gray-500 rounded-full"></span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

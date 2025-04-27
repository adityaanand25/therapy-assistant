import { useState, useRef, useEffect } from "react";
import { Heart, ShieldCheck, Brain, Bot } from "lucide-react";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { ExamDropdown } from "./components/ExamDropdown";
import { ThemeToggle } from "./components/ThemeToggle";
import { getChatResponse } from "./lib/gemini";
import type { Message, ChatState } from "./types";

const initialMessage: Message = {
  id: "1",
  content: "Hello! I'm here to support you on your journey. What help do you want?",
  role: "assistant",
  timestamp: new Date(),
};

function App() {
  const [state, setState] = useState<ChatState>({
    messages: [initialMessage],
    isTyping: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    try {
      const aiResponse = await getChatResponse(content);

      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, response],
        isTyping: false,
      }));
    } catch (error) {
      console.error("Error in chat:", error);
      setState((prev) => ({
        ...prev,
        isTyping: false,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <header className="bg-white dark:bg-gray-800 shadow-md py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Heart className="text-rose-600 w-8 h-8 animate-pulse" />
            <span className="bg-gradient-to-r from-rose-600 to-pink-500 text-transparent bg-clip-text">
              ExamPrepAI
            </span>
          </h1>
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="text-sm">AI-Powered Support</span>
              </div>
              <ThemeToggle />
            </div>
            <ExamDropdown />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="h-[600px] overflow-y-auto p-6 space-y-6">
            {state.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {state.isTyping && (
              <div className="flex gap-2 items-center text-gray-500 dark:text-gray-400 animate-pulse">
                <Bot className="w-8 h-8 text-blue-500" />
                <div className="typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
            <ChatInput onSend={handleSendMessage} disabled={state.isTyping} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

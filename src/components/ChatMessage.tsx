import type { Message } from "../types";

const cleanMessage = (text: string) => {
  return text.replace(/\*\*/g, "").trim();
};

const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-4 max-w-[75%] rounded-lg shadow-md backdrop-blur-sm hover-lift
          ${isUser
            ? "bg-blue-500/90 text-white rounded-br-none"
            : "bg-gray-200/90 dark:bg-gray-700/90 text-gray-900 dark:text-white rounded-bl-none"
          }`}
      >
        <div className="prose dark:prose-invert">
          {cleanMessage(message.content)}
        </div>
        <div className="text-xs mt-1 opacity-70">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export { ChatMessage };


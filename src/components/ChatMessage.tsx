import type { Message } from "../types";

const cleanMessage = (text: string) => {
  return text.replace(/\*\*/g, "").trim(); // Remove double asterisks and trim extra spaces
};

const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-4 max-w-[75%] rounded-lg shadow-md ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        {cleanMessage(message.content)}
        <div className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export { ChatMessage };


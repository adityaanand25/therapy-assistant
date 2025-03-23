import { useState } from "react";

const ChatInput = ({ onSend, disabled }: { onSend: (msg: string) => void; disabled: boolean }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 p-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        placeholder="Type your message..."
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        className={`p-3 bg-blue-500 text-white rounded-lg transition hover:bg-blue-600 ${
          disabled && "opacity-50 cursor-not-allowed"
        }`}
        disabled={disabled}
      >
        Send
      </button>
    </div>
  );
};

export { ChatInput };
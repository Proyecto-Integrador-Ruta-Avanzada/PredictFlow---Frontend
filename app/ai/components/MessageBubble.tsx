import { ChatMessage } from "../chat/types";

interface Props {
  message: ChatMessage;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "8px",
      }}
    >
      <div
        style={{
          background: isUser ? "#2563eb" : "#1f2937",
          color: "white",
          padding: "10px 14px",
          borderRadius: "12px",
          maxWidth: "70%",
        }}
      >
        {message.content}
      </div>
    </div>
  );
}

import { ChatMessage } from "../chat/types";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
}

export default function ChatMessages({ messages, loading }: Props) {
  return (
    <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {loading && <p>La IA está escribiendo...</p>}
    </div>
  );
}

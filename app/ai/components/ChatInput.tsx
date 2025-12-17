"use client";

import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div style={{ display: "flex", padding: "12px", gap: "8px" }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Pregunta algo a la IA..."
        disabled={disabled}
        style={{ flex: 1, padding: "10px" }}
      />
      <button onClick={handleSend} disabled={disabled}>
        Enviar
      </button>
    </div>
  );
}

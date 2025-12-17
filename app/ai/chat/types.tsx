export type Role = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
}

export interface SendMessageRequest {
  message: string;
  projectId?: string;
  sprintId?: string;
}

export interface AIResponse {
  message: string;
  actions?: AIAction[];
}

export type AIAction =
  | { type: "create_task"; payload: CreateTaskPayload }
  | { type: "suggestion"; payload: string };

export interface CreateTaskPayload {
  title: string;
  description: string;
  estimatedHours: number;
}

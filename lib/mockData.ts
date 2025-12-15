
export type Task = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "inprogress" | "review" | "done";
  assignee?: string;
  estimationHours?: number;
  risk?: "low" | "medium" | "high" | "critical";
  order: number;
};

export const initialTasks: Task[] = [
  { id: "t1", title: "Login UI", status: "todo", estimationHours: 4, risk: "medium", order: 0 },
  { id: "t2", title: "API: Register", status: "todo", estimationHours: 3, risk: "high", order: 1},
  { id: "t3", title: "Kanban board", status: "inprogress", estimationHours: 8, risk: "medium", order: 2},
  { id: "t4", title: "Write unit tests", status: "review", estimationHours: 5, risk: "low", order: 5},
  { id: "t5", title: "Deploy to staging", status: "done", estimationHours: 2, risk: "low", order: 4},
];

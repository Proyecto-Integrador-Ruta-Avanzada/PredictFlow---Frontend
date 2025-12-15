import styles from "@/styles/kanban.module.scss";
import type { Task } from "@/lib/mockData";

export default function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick?: () => void;
}) {
  return (
    <div className={styles.taskCard} onClick={onClick} tabIndex={0}>
      <div className={styles.taskHeader}>
        <h4>{task.title}</h4>
        <span className={`${styles.risk} ${styles[task.risk || "low"]}`}>
          {task.risk?.toUpperCase()}
        </span>
      </div>

      <p className={styles.taskDescription}>{task.description}</p>

      <div className={styles.taskFooter}>
        <span>{task.estimationHours ? `${task.estimationHours}h` : ""}</span>
        <span className={styles.assignee}>{task.assignee || "—"}</span>
      </div>
    </div>
  );
}

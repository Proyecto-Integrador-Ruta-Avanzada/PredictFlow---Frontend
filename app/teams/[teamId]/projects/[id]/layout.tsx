import Sidebar from "@/components/layout/Sidebar";
import styles from "@/styles/projectLayout.module.scss";
import { ProjectProvider } from "@/context/ProjectContext";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProjectProvider>
      <div className={styles.shell}>
        <Sidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </ProjectProvider>
  );
}

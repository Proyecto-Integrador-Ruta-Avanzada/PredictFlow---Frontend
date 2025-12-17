import Sidebar from "@/components/layout/Sidebar";
import styles from "@/styles/projectLayout.module.scss";
import { ProjectProvider } from "@/context/ProjectContext";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ProjectProvider projectId={id}>
      <div className={styles.shell}>
        <Sidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </ProjectProvider>
  );
}

import Sidebar from "@/components/layout/Sidebar";
import styles from "@/styles/projectLayout.module.scss";
import { ProjectProvider } from "@/context/ProjectContext";

type Params = { teamId: string; id: string };

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
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

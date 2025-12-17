import TeamSidebar from "@/components/layout/TeamSidebar";
import Topbar from "@/components/layout/Topbar";
import styles from "@/styles/teamLayout.module.scss";

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <TeamSidebar />

      <div className={styles.main}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

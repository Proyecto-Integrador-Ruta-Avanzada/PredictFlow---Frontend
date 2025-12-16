"use client";

import { useState } from "react";
import MemberTable from "./components/MemberTable";
import AssignProject from "./components/AssignProject";
import { Member, Project } from "./types";
import styles from "@/styles/members/global.module.scss";
import { useAppContext } from "@/context/AppContext";

export default function MembersPage() {
  const { members } = useAppContext();

  const [projects] = useState<Project[]>([
    { id: "1", name: "Proyecto A" },
    { id: "2", name: "Proyecto B" },
    { id: "3", name: "Proyecto C" },
  ]);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleAssignProjects = (memberId: string, projectIds: string[]) => {
    //back here
    setSelectedMember(null);
  };

  return (
    <div className={styles.container}>
      <h1>Miembros</h1>

      <MemberTable
        members={members}
        onAssignClick={setSelectedMember}
      />

      {selectedMember && (
        <AssignProject
          member={selectedMember}
          projects={projects}
          onAssign={handleAssignProjects}
        />
      )}
    </div>
  );
}

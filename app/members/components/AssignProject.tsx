"use client";
import { Project, Member } from "../types";
import { useState } from "react";
import styles from "@/styles/members/assignProject.module.scss";

interface Props {
  member: Member;
  projects: Project[];
  onAssign: (memberId: string, projectIds: string[]) => void;
}

export default function AssignProject({ member, projects, onAssign }: Props) {
  const [selected, setSelected] = useState<string[]>(member.projects.map(p => p.id));

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleSave = () => {
    onAssign(member.id, selected);
  };

  return (
    <div className={styles["assign-project"]}>
      <p className="font-bold mb-2">Asignar proyectos a {member.name}</p>
      {projects.map(p => (
        <label key={p.id} className="block">
          <input
            type="checkbox"
            checked={selected.includes(p.id)}
            onChange={() => toggle(p.id)}
          />{" "}
          {p.name}
        </label>
      ))}
      <button onClick={handleSave}>Guardar asignación</button>
    </div>
  );
}

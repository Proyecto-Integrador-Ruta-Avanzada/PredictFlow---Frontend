"use client";
import { Member } from "../types";
import styles from "@/styles/members/memberTable.module.scss";

interface Props {
  members: Member[];
  onAssignClick: (member: Member) => void;
}

export default function MemberTable({ members, onAssignClick }: Props) {
  return (
    <table className={styles["member-table"]}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Proyectos</th>
          <th>Carga actual</th>
          <th>Rendimiento estimado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {members.map(m => (
          <tr key={m.id}>
            <td>{m.name}</td>
            <td>{m.email}</td>
            <td>{m.role}</td>
            <td>{m.projects.map(p => p.name).join(", ")}</td>
            <td>{m.currentLoad}</td>
            <td>{m.performance ?? "N/A"}%</td>
            <td>
              <button onClick={() => onAssignClick(m)}>Asignar proyectos</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

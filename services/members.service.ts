
export interface AssignProjectsPayload {
  memberId: string;
  projectIds: string[];
}

/**
 * Asigna proyectos a un miembro
 * Backend expected:
 * POST /members/{memberId}/projects
 */
export async function assignProjects(
  memberId: string,
  projectIds: string[]
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/members/${memberId}/projects`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectIds }),
    }
  );

  if (!response.ok) {
    throw new Error("Error asignando proyectos al miembro");
  }

  return response.json();
}

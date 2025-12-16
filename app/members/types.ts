export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  projects: Project[];
  currentLoad: number;
  performance?: number;
}

export interface Project {
  id: string;
  name: string;
}

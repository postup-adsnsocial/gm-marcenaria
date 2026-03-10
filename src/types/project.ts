export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  created_at: string;
}

export type ProjectInput = Omit<Project, 'id' | 'created_at'>;

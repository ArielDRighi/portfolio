/**
 * Project type definitions
 */

export interface ProjectStats {
  stars: number;
  forks: number;
  commits: number;
}

export interface Project {
  id: number;
  name: string;
  type: string;
  description: string;
  technologies: string[];
  github: string;
  demo?: string | null;
  status: 'completed' | 'in-progress';
  stats: ProjectStats;
  highlights?: string[];
  featured?: boolean;
}

export type ProjectStatus = 'completed' | 'in-progress';
export type ProjectType =
  | 'monolith'
  | 'microservices'
  | 'api'
  | 'ml'
  | 'devops'
  | 'blockchain'
  | 'architecture'
  | 'analytics';

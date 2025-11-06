/**
 * Experience type definitions
 */

export interface ExperienceHighlight {
  text: string;
  icon?: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | 'Presente';
  duration: string;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  highlights?: ExperienceHighlight[];
  type: 'trabajo' | 'educacion' | 'certificacion';
}

export type ExperienceType = 'trabajo' | 'educacion' | 'certificacion';

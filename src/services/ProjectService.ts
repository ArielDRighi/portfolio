/**
 * ProjectService - Servicio para manejo de datos de proyectos
 * Centraliza toda la lógica de carga y manipulación de proyectos
 */
import type { Project } from '../types';

export class ProjectService {
  private projects: Project[] = [];
  private dataSource: string = '';

  /**
   * Constructor
   * @param dataSource - URL o ruta del archivo JSON (opcional)
   */
  constructor(dataSource?: string) {
    if (dataSource) {
      this.dataSource = dataSource;
    }
  }

  /**
   * Obtiene todos los proyectos
   * Si no hay proyectos cargados, usa datos hardcoded
   */
  async getProjects(): Promise<Project[]> {
    if (this.projects.length === 0) {
      if (this.dataSource) {
        await this.loadFromJSON();
      } else {
        this.projects = this.getHardcodedProjects();
      }
    }
    return this.projects;
  }

  /**
   * Obtiene un proyecto por ID
   */
  async getProjectById(id: number): Promise<Project | undefined> {
    const projects = await this.getProjects();
    return projects.find((p) => p.id === id);
  }

  /**
   * Filtra proyectos por tipo
   */
  async getProjectsByType(type: string): Promise<Project[]> {
    const projects = await this.getProjects();
    return projects.filter((p) => p.type === type);
  }

  /**
   * Filtra proyectos por tecnología
   */
  async getProjectsByTechnology(tech: string): Promise<Project[]> {
    const projects = await this.getProjects();
    return projects.filter((p) => p.technologies.includes(tech));
  }

  /**
   * Obtiene proyectos destacados
   */
  async getFeaturedProjects(): Promise<Project[]> {
    const projects = await this.getProjects();
    return projects.filter((p) => p.featured);
  }

  /**
   * Obtiene estadísticas totales
   */
  async getTotalStats(): Promise<{
    totalProjects: number;
    totalTechnologies: number;
    totalStars: number;
    totalCommits: number;
  }> {
    const projects = await this.getProjects();

    const totalProjects = projects.length;
    const allTechs = projects.flatMap((p) => p.technologies);
    const totalTechnologies = [...new Set(allTechs)].length;
    const totalStars = projects.reduce((sum, p) => sum + (p.stats?.stars || 0), 0);
    const totalCommits = projects.reduce((sum, p) => sum + (p.stats?.commits || 0), 0);

    return {
      totalProjects,
      totalTechnologies,
      totalStars,
      totalCommits,
    };
  }

  /**
   * Carga proyectos desde un archivo JSON
   */
  private async loadFromJSON(): Promise<void> {
    try {
      const response = await fetch(this.dataSource);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.projects = await response.json();
    } catch (error) {
      console.error('Error loading projects from JSON:', error);
      this.projects = this.getHardcodedProjects();
    }
  }

  /**
   * Datos hardcoded como fallback
   */
  private getHardcodedProjects(): Project[] {
    return [
      {
        id: 1,
        name: 'Ecommerce Monolith Foundation',
        type: 'Monolith',
        description:
          'Backend monolítico de nivel empresarial para e-commerce. Optimización extrema con 34 índices estratégicos en PostgreSQL (mejoras del 85-94%). Suite comprehensiva de 514 pruebas (74.69% cobertura). Pipeline CI/CD profesional con quality gates y escaneo de seguridad.',
        technologies: ['node', 'typescript', 'postgresql', 'docker'],
        github: 'https://github.com/ArielDRighi/ecommerce-monolith-foundation',
        status: 'completed',
        stats: { stars: 3, forks: 0, commits: 66 },
        featured: true,
        highlights: [
          '34 índices estratégicos en PostgreSQL',
          '514 tests con 74.69% cobertura',
          'Pipeline CI/CD completo',
        ],
      },
      {
        id: 2,
        name: 'Ecommerce Async Resilient System',
        type: 'Microservices',
        description:
          'Sistema asíncrono de procesamiento de órdenes con arquitectura event-driven. Saga Pattern con compensación automática, 4 colas especializadas (Bull + Redis). Circuit Breaker + Retry + Idempotency. Performance: de 5 segundos a 100 milisegundos. 1,187 tests unitarios + 262 E2E (72% coverage).',
        technologies: ['node', 'typescript', 'postgresql', 'redis', 'docker'],
        github: 'https://github.com/ArielDRighi/ecommerce-async-resilient-system',
        status: 'completed',
        stats: { stars: 0, forks: 0, commits: 235 },
        featured: true,
        highlights: [
          'Saga Pattern con compensación automática',
          '1,187 tests unitarios + 262 E2E',
          'Performance: 5s → 100ms',
        ],
      },
    ];
  }

  /**
   * Limpia el cache de proyectos
   */
  clearCache(): void {
    this.projects = [];
  }

  /**
   * Actualiza la fuente de datos
   */
  setDataSource(dataSource: string): void {
    this.dataSource = dataSource;
    this.clearCache();
  }
}

// Export singleton instance
export const projectService = new ProjectService();

/**
 * Sistema Simplificado de Proyectos
 * Solo tarjetas que redirigen a GitHub al hacer click
 */
import type { Project } from '../../types';
import { projectService } from '../../services/ProjectService';

interface TechIconMap {
  [key: string]: string;
}

interface TechDisplayNames {
  [key: string]: string;
}

class SimpleProjectsGrid {
  private gridContainer: HTMLElement | null;
  private projects: Project[] = [];

  constructor() {
    console.log('SimpleProjectsGrid constructor called');
    this.gridContainer = document.getElementById('projectsGrid');

    if (this.gridContainer) {
      this.init();
    }
  }

  async init(): Promise<void> {
    console.log('Initializing simple projects grid');
    await this.loadProjects();
    this.renderProjectCards();
    this.updateStats();
  }

  async loadProjects(): Promise<void> {
    this.projects = await projectService.getProjects();
  }

  renderProjectCards(): void {
    console.log('Rendering project cards');

    if (!this.gridContainer) return;

    // Clear loading state
    this.gridContainer.innerHTML = '';

    this.projects.forEach((project: Project) => {
      const card = this.createProjectCard(project);
      this.gridContainer!.appendChild(card);
    });

    // Initialize Feather Icons for the new cards
    if (typeof window !== 'undefined' && 'feather' in window) {
      (window as any).feather.replace();
    }

    console.log('Projects rendered successfully');
  }

  createProjectCard(project: Project): HTMLAnchorElement {
    const card = document.createElement('a');
    card.className = 'project-card';
    card.href = project.github || '#';
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    // Crear mini logos de tecnologías
    const techIcons = project.technologies
      .slice(0, 6)
      .map((tech: string) => {
        const icon = this.getTechIcon(tech);
        return `<span class="tech-badge" data-tech="${tech}" title="${this.getTechDisplayName(tech)}">${icon}</span>`;
      })
      .join('');

    card.innerHTML = `
      <h3 class="project__title">${project.name}</h3>
      <p class="project__description">${project.description}</p>
      <div class="project__tech-badges">
        ${techIcons}
      </div>
    `;

    return card;
  }

  getTechIcon(tech: string): string {
    // Usar los mismos iconos que en el Stack Tecnológico
    const iconMap: TechIconMap = {
      javascript: 'javascript',
      typescript: 'typescript',
      python: 'python',
      node: 'nodedotjs',
      nodejs: 'nodedotjs',
      nestjs: 'nestjs',
      express: 'express',
      react: 'react',
      mongodb: 'mongodb',
      postgresql: 'postgresql',
      mysql: 'mysql',
      redis: 'redis',
      docker: 'docker',
      aws: 'amazonaws',
      git: 'git',
      html: 'html5',
      css: 'css3',
      fastapi: 'fastapi',
      flask: 'flask',
      django: 'django',
      nginx: 'nginx',
      linux: 'linux',
      ubuntu: 'ubuntu',
    };

    const techLower = tech.toLowerCase();
    const iconName = iconMap[techLower] || techLower;
    return `<img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${iconName}.svg" alt="${this.getTechDisplayName(
      tech
    )}" class="tech-icon">`;
  }

  getTechDisplayName(tech: string): string {
    const names: TechDisplayNames = {
      node: 'Node.js',
      express: 'Express',
      mongodb: 'MongoDB',
      postgresql: 'PostgreSQL',
      redis: 'Redis',
      docker: 'Docker',
      aws: 'AWS',
      python: 'Python',
      fastapi: 'FastAPI',
      typescript: 'TypeScript',
      javascript: 'JavaScript',
      html: 'HTML',
      css: 'CSS',
      mysql: 'MySQL',
      react: 'React',
      flask: 'Flask',
      django: 'Django',
    };
    return names[tech] || tech.charAt(0).toUpperCase() + tech.slice(1);
  }

  async updateStats(): Promise<void> {
    const totalProjects = document.getElementById('totalProjects');
    const totalTechnologies = document.getElementById('totalTechnologies');
    const totalStars = document.getElementById('totalStars');
    const totalCommits = document.getElementById('totalCommits');

    const stats = await projectService.getTotalStats();

    if (totalProjects) {
      this.animateCounter(totalProjects, stats.totalProjects);
    }

    if (totalTechnologies) {
      this.animateCounter(totalTechnologies, stats.totalTechnologies);
    }

    if (totalStars) {
      this.animateCounter(totalStars, stats.totalStars);
    }

    if (totalCommits) {
      this.animateCounter(totalCommits, stats.totalCommits);
    }
  }

  animateCounter(element: HTMLElement, target: number): void {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const updateCounter = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (target - start) * progress);

      element.textContent = current.toString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }
}

// Extend Window interface to include custom property
declare global {
  interface Window {
    simpleProjectsGrid?: SimpleProjectsGrid;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded - checking for projectsGrid element');
  const gridElement = document.getElementById('projectsGrid');
  console.log('Grid element found:', !!gridElement);

  if (gridElement && !window.simpleProjectsGrid) {
    console.log('Initializing SimpleProjectsGrid from DOMContentLoaded');
    window.simpleProjectsGrid = new SimpleProjectsGrid();
  }
});

/**
 * Sistema Simplificado de Proyectos
 * Solo tarjetas que redirigen a GitHub al hacer click
 */
class SimpleProjectsGrid {
  constructor() {
    console.log("SimpleProjectsGrid constructor called");
    this.gridContainer = document.getElementById("projectsGrid");
    this.projects = this.getProjects();

    if (this.gridContainer) {
      this.init();
    }
  }

  init() {
    console.log("Initializing simple projects grid");
    this.renderProjectCards();
    this.updateStats();
  }

  getProjects() {
    return [
      {
        id: 1,
        name: "Ecommerce Monolith Foundation",
        type: "Monolith",
        description:
          "Backend monolítico de nivel empresarial para e-commerce. Optimización extrema con 34 índices estratégicos en PostgreSQL (mejoras del 85-94%). Suite comprehensiva de 514 pruebas (74.69% cobertura). Pipeline CI/CD profesional con quality gates y escaneo de seguridad.",
        technologies: ["node", "typescript", "postgresql", "docker"],
        github: "https://github.com/ArielDRighi/ecommerce-monolith-foundation",
        status: "completed",
        stats: { stars: 3, forks: 0, commits: 66 },
      },
      {
        id: 2,
        name: "Ecommerce Async Resilient System",
        type: "Microservices",
        description:
          "Sistema asíncrono de procesamiento de órdenes con arquitectura event-driven. Saga Pattern con compensación automática, 4 colas especializadas (Bull + Redis). Circuit Breaker + Retry + Idempotency. Performance: de 5 segundos a 100 milisegundos. 1,187 tests unitarios + 262 E2E (72% coverage).",
        technologies: ["node", "typescript", "postgresql", "redis", "docker"],
        github: "https://github.com/ArielDRighi/ecommerce-async-resilient-system",
        status: "completed",
        stats: { stars: 0, forks: 0, commits: 235 },
      },
    ];
  }

  renderProjectCards() {
    console.log("Rendering project cards");

    // Clear loading state
    this.gridContainer.innerHTML = "";

    this.projects.forEach((project) => {
      const card = this.createProjectCard(project);
      this.gridContainer.appendChild(card);
    });

    // Initialize Feather Icons for the new cards
    if (typeof feather !== "undefined") {
      feather.replace();
    }

    console.log("Projects rendered successfully");
  }

  createProjectCard(project) {
    const card = document.createElement("a");
    card.className = "project-card";
    card.href = project.github || project.html_url || "#";
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    // Crear mini logos de tecnologías
    const techIcons = project.technologies
      .slice(0, 6)
      .map((tech) => {
        const icon = this.getTechIcon(tech);
        return `<span class="tech-badge" data-tech="${tech}" title="${this.getTechDisplayName(tech)}">${icon}</span>`;
      })
      .join("");

    card.innerHTML = `
      <h3 class="project__title">${project.name}</h3>
      <p class="project__description">${project.description}</p>
      <div class="project__tech-badges">
        ${techIcons}
      </div>
    `;

    return card;
  }

  getTechIcon(tech) {
    // Usar los mismos iconos que en el Stack Tecnológico
    const iconMap = {
      javascript: "javascript",
      typescript: "typescript",
      python: "python",
      node: "nodedotjs",
      nodejs: "nodedotjs",
      nestjs: "nestjs",
      express: "express",
      react: "react",
      mongodb: "mongodb",
      postgresql: "postgresql",
      mysql: "mysql",
      redis: "redis",
      docker: "docker",
      aws: "amazonaws",
      git: "git",
      html: "html5",
      css: "css3",
      fastapi: "fastapi",
      flask: "flask",
      django: "django",
      nginx: "nginx",
      linux: "linux",
      ubuntu: "ubuntu",
    };

    const iconName = iconMap[tech.toLowerCase()] || tech.toLowerCase();
    return `<img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${iconName}.svg" alt="${this.getTechDisplayName(
      tech
    )}" class="tech-icon">`;
  }

  getTechDisplayName(tech) {
    const names = {
      node: "Node.js",
      express: "Express",
      mongodb: "MongoDB",
      postgresql: "PostgreSQL",
      redis: "Redis",
      docker: "Docker",
      aws: "AWS",
      python: "Python",
      fastapi: "FastAPI",
      typescript: "TypeScript",
      javascript: "JavaScript",
      html: "HTML",
      css: "CSS",
      mysql: "MySQL",
      react: "React",
      flask: "Flask",
      django: "Django",
    };
    return names[tech] || tech.charAt(0).toUpperCase() + tech.slice(1);
  }

  updateStats() {
    const totalProjects = document.getElementById("totalProjects");
    const totalTechnologies = document.getElementById("totalTechnologies");
    const totalStars = document.getElementById("totalStars");
    const totalCommits = document.getElementById("totalCommits");

    if (totalProjects) {
      this.animateCounter(totalProjects, this.projects.length);
    }

    if (totalTechnologies) {
      const techCount = [...new Set(this.projects.flatMap((p) => p.technologies))].length;
      this.animateCounter(totalTechnologies, techCount);
    }

    if (totalStars) {
      const starsCount = this.projects.reduce((sum, p) => sum + (p.stats ? p.stats.stars : 0), 0);
      this.animateCounter(totalStars, starsCount);
    }

    if (totalCommits) {
      const commitsCount = this.projects.reduce((sum, p) => sum + (p.stats ? p.stats.commits : 0), 0);
      this.animateCounter(totalCommits, commitsCount);
    }
  }

  animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (target - start) * progress);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded - checking for projectsGrid element");
  const gridElement = document.getElementById("projectsGrid");
  console.log("Grid element found:", !!gridElement);

  if (gridElement && !window.simpleProjectsGrid) {
    console.log("Initializing SimpleProjectsGrid from DOMContentLoaded");
    window.simpleProjectsGrid = new SimpleProjectsGrid();
  }
});

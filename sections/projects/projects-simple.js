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
        name: "API REST E-commerce",
        type: "API",
        description:
          "API completa para sistema de e-commerce con autenticación JWT, pagos con Stripe y gestión avanzada de inventario.",
        technologies: ["node", "express", "mongodb", "redis"],
        github: "https://github.com/ArielDRighi/ecommerce-api",
        status: "completed",
        stats: { stars: 45, forks: 12, commits: 156 },
      },
      {
        id: 2,
        name: "Microservicios Chat",
        type: "Microservices",
        description: "Sistema de chat en tiempo real con arquitectura de microservicios usando WebSockets y RabbitMQ.",
        technologies: ["node", "docker", "postgresql", "redis"],
        github: "https://github.com/ArielDRighi/chat-microservices",
        status: "completed",
        stats: { stars: 38, forks: 8, commits: 203 },
      },
      {
        id: 3,
        name: "FastAPI ML Service",
        type: "Machine Learning",
        description: "Servicio de Machine Learning para predicciones usando FastAPI, TensorFlow y MLflow.",
        technologies: ["python", "fastapi", "postgresql", "docker"],
        github: "https://github.com/ArielDRighi/ml-service",
        status: "completed",
        stats: { stars: 23, forks: 5, commits: 89 },
      },
      {
        id: 4,
        name: "GraphQL Blog API",
        type: "API",
        description: "API GraphQL para blog con subscripciones en tiempo real y cache optimizado con DataLoader.",
        technologies: ["node", "typescript", "postgresql", "redis"],
        github: "https://github.com/ArielDRighi/graphql-blog",
        status: "in-progress",
        stats: { stars: 15, forks: 3, commits: 67 },
      },
      {
        id: 5,
        name: "DevOps Pipeline",
        type: "DevOps",
        description:
          "Pipeline CI/CD completo con Docker, Kubernetes, monitoring con Grafana y despliegue automatizado.",
        technologies: ["docker", "aws", "node", "postgresql"],
        github: "https://github.com/ArielDRighi/devops-pipeline",
        status: "completed",
        stats: { stars: 31, forks: 7, commits: 124 },
      },
      {
        id: 6,
        name: "Real-time Analytics",
        type: "Analytics",
        description: "Sistema de analíticas en tiempo real con dashboard interactivo y procesamiento de streams.",
        technologies: ["python", "redis", "postgresql", "docker"],
        github: "https://github.com/ArielDRighi/realtime-analytics",
        status: "completed",
        stats: { stars: 19, forks: 4, commits: 95 },
      },
      {
        id: 7,
        name: "Blockchain Wallet API",
        type: "Blockchain",
        description:
          "API para gestión de wallets de criptomonedas con soporte multi-blockchain y transacciones seguras.",
        technologies: ["node", "typescript", "mongodb", "redis"],
        github: "https://github.com/ArielDRighi/blockchain-wallet",
        status: "completed",
        stats: { stars: 52, forks: 15, commits: 187 },
      },
      {
        id: 8,
        name: "Event Sourcing System",
        type: "Architecture",
        description: "Sistema de Event Sourcing con CQRS para aplicaciones de alta concurrencia usando EventStore.",
        technologies: ["node", "express", "postgresql", "redis"],
        github: "https://github.com/ArielDRighi/event-sourcing",
        status: "in-progress",
        stats: { stars: 28, forks: 6, commits: 143 },
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

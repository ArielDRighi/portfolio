/**
 * Sistema de Escritorio Windows para Proyectos
 * Maneja la interfaz desktop, iconos, ventanas y integración con GitHub
 */
class WindowsDesktop {
  constructor() {
    this.desktop = document.getElementById("windowsDesktop");
    this.iconsContainer = document.getElementById("desktopIcons");
    this.startButton = document.getElementById("startButton");
    this.startMenu = document.getElementById("startMenu");
    this.projectWindow = document.getElementById("projectWindow");
    this.contextMenu = document.getElementById("contextMenu");

    this.projects = [];
    this.selectedIcon = null;
    this.isStartMenuOpen = false;

    this.init();
  }

  async init() {
    if (!this.desktop) return;

    this.setupEventListeners();
    this.startClock();
    await this.loadProjects();
    this.renderDesktopIcons();
    this.updateStats();
    this.setupStartMenu();
  }

  setupEventListeners() {
    // Start button toggle
    if (this.startButton) {
      this.startButton.addEventListener("click", this.toggleStartMenu.bind(this));
    }

    // Close start menu on outside click
    document.addEventListener("click", (e) => {
      if (this.isStartMenuOpen && !this.startMenu.contains(e.target) && !this.startButton.contains(e.target)) {
        this.closeStartMenu();
      }
    });

    // Desktop click (deselect icons)
    if (this.desktop) {
      this.desktop.addEventListener("click", (e) => {
        if (e.target === this.desktop || e.target.classList.contains("desktop__background")) {
          this.deselectAllIcons();
        }
      });
    }

    // Context menu
    if (this.desktop) {
      this.desktop.addEventListener("contextmenu", this.handleRightClick.bind(this));
    }

    // Close context menu on click outside
    document.addEventListener("click", () => {
      this.hideContextMenu();
    });

    // Window close
    const closeBtn = document.getElementById("closeWindow");
    if (closeBtn) {
      closeBtn.addEventListener("click", this.closeProjectWindow.bind(this));
    }

    // Start menu actions
    document.addEventListener("click", (e) => {
      const action = e.target.closest("[data-action]");
      if (action) {
        this.handleStartAction(action.dataset.action);
      }
    });

    // ESC key handlers
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.projectWindow.classList.contains("active")) {
          this.closeProjectWindow();
        } else if (this.isStartMenuOpen) {
          this.closeStartMenu();
        } else if (this.contextMenu.classList.contains("active")) {
          this.hideContextMenu();
        }
      }
    });
  }

  async loadProjects() {
    try {
      const response = await fetch("data/projects.json");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      this.projects = await response.json();
      console.log("✅ Proyectos cargados:", this.projects.length);
    } catch (error) {
      console.error("❌ Error cargando proyectos:", error);
      this.projects = this.getDefaultProjects();
    }
  }

  getDefaultProjects() {
    return [
      {
        id: 1,
        name: "API REST E-commerce",
        type: "api",
        description: "API completa para sistema de e-commerce con autenticación JWT, pagos y gestión de inventario",
        technologies: ["node", "express", "mongodb", "redis"],
        github: "https://github.com/usuario/ecommerce-api",
        demo: null,
        status: "completed",
        featured: true,
        stats: { stars: 45, forks: 12, commits: 156 },
      },
      {
        id: 2,
        name: "Microservicios Chat",
        type: "microservices",
        description: "Sistema de chat en tiempo real con arquitectura de microservicios usando WebSockets",
        technologies: ["node", "docker", "postgresql", "redis"],
        github: "https://github.com/usuario/chat-microservices",
        demo: "https://chat-demo.com",
        status: "completed",
        featured: true,
        stats: { stars: 38, forks: 8, commits: 203 },
      },
      {
        id: 3,
        name: "FastAPI ML Service",
        type: "ml",
        description: "Servicio de Machine Learning para predicciones usando FastAPI y TensorFlow",
        technologies: ["python", "fastapi", "postgresql", "docker"],
        github: "https://github.com/usuario/ml-service",
        demo: null,
        status: "completed",
        featured: false,
        stats: { stars: 23, forks: 5, commits: 89 },
      },
      {
        id: 4,
        name: "GraphQL Blog API",
        type: "api",
        description: "API GraphQL para blog con subscripciones en tiempo real y cache optimizado",
        technologies: ["node", "typescript", "postgresql", "redis"],
        github: "https://github.com/usuario/graphql-blog",
        demo: "https://blog-api-demo.com",
        status: "in-progress",
        featured: true,
        stats: { stars: 15, forks: 3, commits: 67 },
      },
      {
        id: 5,
        name: "DevOps Pipeline",
        type: "devops",
        description: "Pipeline CI/CD completo con Docker, Kubernetes y monitoring automatizado",
        technologies: ["docker", "aws", "node", "postgresql"],
        github: "https://github.com/usuario/devops-pipeline",
        demo: null,
        status: "completed",
        featured: false,
        stats: { stars: 31, forks: 7, commits: 124 },
      },
      {
        id: 6,
        name: "Real-time Analytics",
        type: "analytics",
        description: "Sistema de analíticas en tiempo real con dashboard interactivo",
        technologies: ["python", "redis", "postgresql", "docker"],
        github: "https://github.com/usuario/realtime-analytics",
        demo: "https://analytics-demo.com",
        status: "completed",
        featured: false,
        stats: { stars: 19, forks: 4, commits: 95 },
      },
    ];
  }

  renderDesktopIcons() {
    if (!this.iconsContainer) return;

    // Clear loading state
    this.iconsContainer.innerHTML = "";

    this.projects.forEach((project) => {
      const icon = this.createDesktopIcon(project);
      this.iconsContainer.appendChild(icon);
    });
  }

  createDesktopIcon(project) {
    const icon = document.createElement("div");
    icon.className = "desktop-icon";
    icon.dataset.projectId = project.id;

    const iconEmoji = this.getProjectIcon(project.type);
    const techBadges = this.createTechBadges(project.technologies);

    icon.innerHTML = `
      <div class="icon-image">
        ${iconEmoji}
        <div class="tech-badges">
          ${techBadges}
        </div>
      </div>
      <div class="icon-label">${project.name}</div>
    `;

    // Event listeners
    icon.addEventListener("click", () => this.selectIcon(icon));
    icon.addEventListener("dblclick", () => this.openProject(project));
    icon.addEventListener("contextmenu", (e) => this.showIconContextMenu(e, project));

    return icon;
  }

  getProjectIcon(type) {
    const icons = {
      api: "🔌",
      microservices: "🏗️",
      ml: "🤖",
      devops: "⚙️",
      analytics: "📊",
      database: "💾",
      frontend: "🎨",
      mobile: "📱",
      desktop: "💻",
      game: "🎮",
      tool: "🛠️",
      library: "📚",
    };
    return icons[type] || "📁";
  }

  createTechBadges(technologies) {
    return technologies
      .slice(0, 4)
      .map((tech) => `<div class="tech-badge tech-badge--${tech}" title="${tech}"></div>`)
      .join("");
  }

  selectIcon(icon) {
    this.deselectAllIcons();
    icon.classList.add("selected");
    this.selectedIcon = icon;
  }

  deselectAllIcons() {
    const icons = this.iconsContainer.querySelectorAll(".desktop-icon");
    icons.forEach((icon) => icon.classList.remove("selected"));
    this.selectedIcon = null;
  }

  openProject(project) {
    this.showProjectWindow(project);
  }

  showProjectWindow(project) {
    const windowTitle = document.getElementById("windowTitle");
    const windowText = document.getElementById("windowText");
    const windowIcon = document.getElementById("windowIcon");
    const windowContent = document.getElementById("windowContent");

    if (windowTitle && windowText && windowIcon && windowContent) {
      windowIcon.textContent = this.getProjectIcon(project.type);
      windowText.textContent = project.name;
      windowContent.innerHTML = this.createProjectContent(project);

      this.projectWindow.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  createProjectContent(project) {
    const statusIcon = project.status === "completed" ? "✅" : project.status === "in-progress" ? "🔄" : "⏳";

    const techList = project.technologies
      .map((tech) => `<span class="tech-tag tech-tag--${tech}">${tech}</span>`)
      .join("");

    return `
      <div class="project-content">
        <div class="project-header">
          <div class="project-title">
            <h3>${project.name}</h3>
            <div class="project-status">
              <span class="status-icon">${statusIcon}</span>
              <span class="status-text">${this.getStatusText(project.status)}</span>
            </div>
          </div>
          <div class="project-stats">
            <div class="stat-item">
              <span class="stat-icon">⭐</span>
              <span class="stat-value">${project.stats.stars}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🍴</span>
              <span class="stat-value">${project.stats.forks}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">📝</span>
              <span class="stat-value">${project.stats.commits}</span>
            </div>
          </div>
        </div>
        
        <div class="project-description">
          <p>${project.description}</p>
        </div>
        
        <div class="project-technologies">
          <h4>Tecnologías utilizadas:</h4>
          <div class="tech-list">
            ${techList}
          </div>
        </div>
        
        <div class="project-actions">
          <a href="${project.github}" target="_blank" class="project-btn project-btn--primary">
            <span class="btn-icon">🐙</span>
            Ver en GitHub
          </a>
          ${
            project.demo
              ? `
            <a href="${project.demo}" target="_blank" class="project-btn project-btn--secondary">
              <span class="btn-icon">🌐</span>
              Ver Demo
            </a>
          `
              : ""
          }
        </div>
      </div>
      
      <style>
        .project-content { font-family: var(--font-primary); }
        .project-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem; }
        .project-title h3 { margin: 0 0 0.5rem 0; color: var(--color-text); }
        .project-status { display: flex; align-items: center; gap: 0.5rem; }
        .status-icon { font-size: 1rem; }
        .status-text { font-size: 0.875rem; color: var(--color-text-light); }
        .project-stats { display: flex; gap: 1rem; }
        .stat-item { display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; }
        .project-description { margin-bottom: 1.5rem; line-height: 1.6; }
        .project-technologies h4 { margin: 0 0 0.75rem 0; color: var(--color-text); }
        .tech-list { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
        .tech-tag { padding: 0.25rem 0.5rem; background: var(--color-accent-light); color: var(--color-accent); border-radius: 1rem; font-size: 0.75rem; text-transform: uppercase; font-weight: 500; }
        .project-actions { display: flex; gap: 1rem; }
        .project-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 500; transition: all 0.2s; }
        .project-btn--primary { background: var(--color-accent); color: white; }
        .project-btn--primary:hover { background: var(--color-primary); transform: translateY(-1px); }
        .project-btn--secondary { background: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border); }
        .project-btn--secondary:hover { background: var(--color-accent-light); }
      </style>
    `;
  }

  getStatusText(status) {
    const texts = {
      completed: "Completado",
      "in-progress": "En progreso",
      planning: "Planificación",
    };
    return texts[status] || status;
  }

  closeProjectWindow() {
    this.projectWindow.classList.remove("active");
    document.body.style.overflow = "";
  }

  toggleStartMenu() {
    if (this.isStartMenuOpen) {
      this.closeStartMenu();
    } else {
      this.openStartMenu();
    }
  }

  openStartMenu() {
    this.startMenu.classList.add("active");
    this.startButton.classList.add("active");
    this.isStartMenuOpen = true;
  }

  closeStartMenu() {
    this.startMenu.classList.remove("active");
    this.startButton.classList.remove("active");
    this.isStartMenuOpen = false;
  }

  setupStartMenu() {
    const startProjects = document.getElementById("startProjects");
    const startTechnologies = document.getElementById("startTechnologies");

    if (startProjects) {
      const featuredProjects = this.projects.filter((p) => p.featured).slice(0, 3);
      startProjects.innerHTML = featuredProjects
        .map(
          (project) => `
        <div class="start-item" data-project-id="${project.id}">
          <div class="start-item__icon">${this.getProjectIcon(project.type)}</div>
          <div class="start-item__text">${project.name}</div>
        </div>
      `
        )
        .join("");

      // Add click listeners
      startProjects.addEventListener("click", (e) => {
        const item = e.target.closest(".start-item");
        if (item) {
          const projectId = parseInt(item.dataset.projectId);
          const project = this.projects.find((p) => p.id === projectId);
          if (project) {
            this.openProject(project);
            this.closeStartMenu();
          }
        }
      });
    }

    if (startTechnologies) {
      const technologies = [...new Set(this.projects.flatMap((p) => p.technologies))];
      startTechnologies.innerHTML = technologies
        .slice(0, 5)
        .map(
          (tech) => `
        <div class="start-item">
          <div class="start-item__icon tech-badge tech-badge--${tech}"></div>
          <div class="start-item__text">${tech}</div>
        </div>
      `
        )
        .join("");
    }
  }

  handleRightClick(e) {
    e.preventDefault();

    const icon = e.target.closest(".desktop-icon");
    if (icon) {
      const projectId = parseInt(icon.dataset.projectId);
      const project = this.projects.find((p) => p.id === projectId);
      this.showIconContextMenu(e, project);
    }
  }

  showIconContextMenu(e, project) {
    e.preventDefault();
    e.stopPropagation();

    const contextMenu = document.getElementById("contextMenu");
    if (!contextMenu) return;

    // Update context menu actions
    const contextItems = contextMenu.querySelectorAll(".context-item[data-action]");
    contextItems.forEach((item) => {
      item.onclick = () => this.handleContextAction(item.dataset.action, project);
    });

    // Position and show
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;
    contextMenu.classList.add("active");
  }

  hideContextMenu() {
    const contextMenu = document.getElementById("contextMenu");
    if (contextMenu) {
      contextMenu.classList.remove("active");
    }
  }

  handleContextAction(action, project) {
    this.hideContextMenu();

    switch (action) {
      case "open":
        this.openProject(project);
        break;
      case "github":
        window.open(project.github, "_blank");
        break;
      case "demo":
        if (project.demo) {
          window.open(project.demo, "_blank");
        }
        break;
      case "properties":
        this.showProjectProperties(project);
        break;
    }
  }

  handleStartAction(action) {
    switch (action) {
      case "github":
        window.open("https://github.com/tu-usuario", "_blank");
        break;
      case "download":
        // Trigger CV download
        const link = document.createElement("a");
        link.href = "assets/documents/cv.pdf";
        link.download = "CV-Desarrollador-Backend.pdf";
        link.click();
        break;
    }
    this.closeStartMenu();
  }

  updateStats() {
    const totalProjects = document.getElementById("totalProjects");
    const totalTechnologies = document.getElementById("totalTechnologies");
    const totalStars = document.getElementById("totalStars");
    const totalCommits = document.getElementById("totalCommits");
    const projectsCount = document.getElementById("projectsCount");

    if (totalProjects) {
      this.animateCounter(totalProjects, this.projects.length);
    }

    if (totalTechnologies) {
      const techCount = [...new Set(this.projects.flatMap((p) => p.technologies))].length;
      this.animateCounter(totalTechnologies, techCount);
    }

    if (totalStars) {
      const starsCount = this.projects.reduce((sum, p) => sum + p.stats.stars, 0);
      this.animateCounter(totalStars, starsCount);
    }

    if (totalCommits) {
      const commitsCount = this.projects.reduce((sum, p) => sum + p.stats.commits, 0);
      this.animateCounter(totalCommits, commitsCount);
    }

    if (projectsCount) {
      projectsCount.querySelector(".system-text").textContent = `${this.projects.length} proyectos`;
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

  startClock() {
    const updateTime = () => {
      const timeElement = document.getElementById("currentTime");
      if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        });
        timeElement.textContent = timeString;
      }
    };

    updateTime();
    setInterval(updateTime, 1000);
  }
}

// Auto-initialize when section is loaded
document.addEventListener("sectionLoaded", (event) => {
  if (event.detail.section === "projects") {
    window.windowsDesktop = new WindowsDesktop();
  }
});

// Fallback initialization for non-modular version
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("windowsDesktop") && !window.windowsDesktop) {
    window.windowsDesktop = new WindowsDesktop();
  }
});

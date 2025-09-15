/**
 * DESKTOP.JS - Funcionalidades del escritorio Windows
 * Maneja la carga y visualización de proyectos en formato escritorio
 */

// ===================================
// CONFIGURACIÓN DESKTOP
// ===================================
const DESKTOP_CONFIG = {
  iconAnimationDelay: 100,
  doubleClickDelay: 300,
  maxIconsPerRow: 6,
  iconTypes: {
    api: "🔗",
    web: "🌐",
    mobile: "📱",
    desktop: "💻",
    library: "📚",
    tool: "🛠️",
    game: "🎮",
    bot: "🤖",
  },
};

// ===================================
// CLASE DESKTOP MANAGER
// ===================================
class DesktopManager {
  constructor() {
    this.desktopContainer = document.getElementById("desktopIcons");
    this.projects = [];
    this.clickTimers = new Map();

    this.init();
  }

  async init() {
    if (!this.desktopContainer) return;

    try {
      await this.loadProjects();
      this.renderProjects();
      this.addTaskbar();
      this.bindEvents();
    } catch (error) {
      console.error("Error inicializando desktop:", error);
      this.showErrorMessage();
    }
  }

  async loadProjects() {
    try {
      // Intentar cargar desde archivo JSON
      const response = await fetch("data/projects.json");
      if (response.ok) {
        this.projects = await response.json();
      } else {
        // Fallback a datos por defecto
        this.projects = this.getDefaultProjects();
      }
    } catch (error) {
      console.warn("No se pudo cargar projects.json, usando datos por defecto");
      this.projects = this.getDefaultProjects();
    }
  }

  getDefaultProjects() {
    return [
      {
        id: 1,
        title: "API REST Node.js",
        description: "API completa con autenticación JWT",
        type: "api",
        technologies: ["node", "mongodb", "jwt"],
        status: "completed",
        repository: "https://github.com/tu-usuario/api-nodejs",
        featured: true,
      },
      {
        id: 2,
        title: "Sistema E-commerce",
        description: "Plataforma de comercio electrónico",
        type: "web",
        technologies: ["php", "mysql", "docker"],
        status: "completed",
        repository: "https://github.com/tu-usuario/ecommerce-php",
      },
      {
        id: 3,
        title: "Microservicios Python",
        description: "Arquitectura de microservicios con FastAPI",
        type: "api",
        technologies: ["python", "fastapi", "postgresql"],
        status: "in-progress",
        repository: "https://github.com/tu-usuario/microservices-python",
      },
      {
        id: 4,
        title: "Bot de Telegram",
        description: "Bot automatizado para gestión",
        type: "bot",
        technologies: ["python", "telegram-api"],
        status: "completed",
        repository: "https://github.com/tu-usuario/telegram-bot",
      },
      {
        id: 5,
        title: "CLI Tool Java",
        description: "Herramienta de línea de comandos",
        type: "tool",
        technologies: ["java", "maven"],
        status: "completed",
        repository: "https://github.com/tu-usuario/cli-tool-java",
      },
      {
        id: 6,
        title: "GraphQL Server",
        description: "Servidor GraphQL con subscripciones",
        type: "api",
        technologies: ["node", "graphql", "mongodb"],
        status: "planned",
        repository: "https://github.com/tu-usuario/graphql-server",
      },
    ];
  }

  renderProjects() {
    this.desktopContainer.innerHTML = "";

    this.projects.forEach((project, index) => {
      const iconElement = this.createProjectIcon(project, index);
      this.desktopContainer.appendChild(iconElement);
    });
  }

  createProjectIcon(project, index) {
    const icon = document.createElement("a");
    icon.className = "project-icon";
    icon.href = project.repository;
    icon.target = "_blank";
    icon.rel = "noopener noreferrer";
    icon.style.animationDelay = `${index * DESKTOP_CONFIG.iconAnimationDelay}ms`;

    icon.innerHTML = `
      <div class="project-icon__status project-icon__status--${project.status}"></div>
      <div class="project-icon__technologies">
        ${project.technologies.map((tech) => `<span class="tech-badge tech-badge--${tech}">${tech}</span>`).join("")}
      </div>
      <div class="project-icon__image">
        ${DESKTOP_CONFIG.iconTypes[project.type] || "📁"}
      </div>
      <div class="project-icon__title">${project.title}</div>
      <div class="project-icon__description">${project.description}</div>
      <div class="project-icon__tooltip">
        Clic para ver en GitHub<br>
        <small>Estado: ${this.getStatusText(project.status)}</small>
      </div>
    `;

    return icon;
  }

  getStatusText(status) {
    const statusMap = {
      completed: "Completado",
      "in-progress": "En desarrollo",
      planned: "Planificado",
    };
    return statusMap[status] || status;
  }

  addTaskbar() {
    const desktop = document.querySelector(".desktop__background");
    if (!desktop) return;

    const taskbar = document.createElement("div");
    taskbar.className = "desktop__taskbar";

    taskbar.innerHTML = `
      <button class="desktop__start-button">
        Inicio
      </button>
      <div class="desktop__time">
        ${PortfolioUtils.getCurrentTime()}
      </div>
    `;

    desktop.appendChild(taskbar);
  }

  bindEvents() {
    // Eventos para los iconos
    this.desktopContainer.addEventListener("click", (e) => {
      this.handleIconClick(e);
    });

    // Actualizar reloj
    setInterval(() => {
      const timeElement = document.querySelector(".desktop__time");
      if (timeElement) {
        timeElement.textContent = PortfolioUtils.getCurrentTime();
      }
    }, 60000);

    // Eventos de teclado para navegación
    document.addEventListener("keydown", (e) => {
      if (e.target.closest(".desktop")) {
        this.handleKeyNavigation(e);
      }
    });
  }

  handleIconClick(e) {
    const icon = e.target.closest(".project-icon");
    if (!icon) return;

    e.preventDefault();

    // Detectar doble clic
    const iconId = icon.href;

    if (this.clickTimers.has(iconId)) {
      // Es un doble clic
      clearTimeout(this.clickTimers.get(iconId));
      this.clickTimers.delete(iconId);
      this.handleDoubleClick(icon);
    } else {
      // Primer clic, esperar por posible segundo clic
      const timer = setTimeout(() => {
        this.clickTimers.delete(iconId);
        this.handleSingleClick(icon);
      }, DESKTOP_CONFIG.doubleClickDelay);

      this.clickTimers.set(iconId, timer);
    }
  }

  handleSingleClick(icon) {
    // Seleccionar icono
    this.clearSelection();
    icon.classList.add("project-icon--selected");
  }

  handleDoubleClick(icon) {
    // Animación de doble clic y abrir enlace
    icon.classList.add("project-icon--double-clicked");

    setTimeout(() => {
      icon.classList.remove("project-icon--double-clicked");
      window.open(icon.href, "_blank");
    }, 300);
  }

  clearSelection() {
    const selectedIcons = this.desktopContainer.querySelectorAll(".project-icon--selected");
    selectedIcons.forEach((icon) => icon.classList.remove("project-icon--selected"));
  }

  handleKeyNavigation(e) {
    const selectedIcon = this.desktopContainer.querySelector(".project-icon--selected");
    const allIcons = Array.from(this.desktopContainer.querySelectorAll(".project-icon"));

    if (!selectedIcon || allIcons.length === 0) return;

    const currentIndex = allIcons.indexOf(selectedIcon);
    let newIndex = currentIndex;

    switch (e.key) {
      case "ArrowLeft":
        newIndex = Math.max(0, currentIndex - 1);
        break;
      case "ArrowRight":
        newIndex = Math.min(allIcons.length - 1, currentIndex + 1);
        break;
      case "ArrowUp":
        newIndex = Math.max(0, currentIndex - DESKTOP_CONFIG.maxIconsPerRow);
        break;
      case "ArrowDown":
        newIndex = Math.min(allIcons.length - 1, currentIndex + DESKTOP_CONFIG.maxIconsPerRow);
        break;
      case "Enter":
        e.preventDefault();
        this.handleDoubleClick(selectedIcon);
        return;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      e.preventDefault();
      this.clearSelection();
      allIcons[newIndex].classList.add("project-icon--selected");
      allIcons[newIndex].focus();
    }
  }

  showErrorMessage() {
    this.desktopContainer.innerHTML = `
      <div class="desktop__error">
        <div class="desktop__error-icon">⚠️</div>
        <div class="desktop__error-message">
          Error al cargar los proyectos
        </div>
      </div>
    `;
  }

  // Método para añadir nuevo proyecto dinámicamente
  addProject(projectData) {
    this.projects.push(projectData);
    this.renderProjects();
  }

  // Método para filtrar proyectos por tecnología
  filterByTechnology(tech) {
    const filteredProjects = this.projects.filter((project) => project.technologies.includes(tech));

    this.desktopContainer.innerHTML = "";
    filteredProjects.forEach((project, index) => {
      const iconElement = this.createProjectIcon(project, index);
      this.desktopContainer.appendChild(iconElement);
    });
  }

  // Resetear vista para mostrar todos los proyectos
  showAllProjects() {
    this.renderProjects();
  }
}

// ===================================
// FUNCIONES AUXILIARES
// ===================================

// Función para crear datos de ejemplo de proyectos
function createExampleProjectData() {
  return {
    id: Date.now(),
    title: "Nuevo Proyecto",
    description: "Descripción del proyecto",
    type: "api",
    technologies: ["node", "mongodb"],
    status: "in-progress",
    repository: "https://github.com/usuario/proyecto",
  };
}

// Función para obtener estadísticas de proyectos
function getProjectStats(projects) {
  const stats = {
    total: projects.length,
    completed: 0,
    inProgress: 0,
    planned: 0,
    technologies: new Set(),
  };

  projects.forEach((project) => {
    stats[project.status.replace("-", "")]++;
    project.technologies.forEach((tech) => stats.technologies.add(tech));
  });

  stats.technologies = Array.from(stats.technologies);
  return stats;
}

// ===================================
// INICIALIZACIÓN
// ===================================
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar desktop manager solo si existe el contenedor
  if (document.getElementById("desktopIcons")) {
    window.desktopManager = new DesktopManager();
  }
});

// Exportar para uso externo
window.DesktopManager = DesktopManager;
window.createExampleProjectData = createExampleProjectData;
window.getProjectStats = getProjectStats;

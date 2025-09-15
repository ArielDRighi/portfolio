/**
 * EXPERIENCE.JS - Carga dinámica de experiencia laboral
 * Maneja la carga y renderizado del timeline de experiencia
 */

// ===================================
// CLASE EXPERIENCE MANAGER
// ===================================
class ExperienceManager {
  constructor() {
    this.timelineContainer = document.querySelector(".timeline");
    this.experiences = [];

    this.init();
  }

  async init() {
    if (!this.timelineContainer) return;

    try {
      await this.loadExperience();
      this.renderTimeline();
      this.bindEvents();
    } catch (error) {
      console.error("Error cargando experiencia:", error);
      this.showErrorMessage();
    }
  }

  async loadExperience() {
    try {
      const response = await fetch("data/experience.json");
      if (response.ok) {
        this.experiences = await response.json();
        // Ordenar por fecha de inicio (más reciente primero)
        this.experiences.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      } else {
        throw new Error("No se pudo cargar experience.json");
      }
    } catch (error) {
      console.warn("Usando datos de experiencia por defecto");
      this.experiences = this.getDefaultExperience();
    }
  }

  getDefaultExperience() {
    return [
      {
        id: 1,
        company: "Tu Empresa Actual",
        position: "Desarrollador Backend Senior",
        startDate: "2023-01-15",
        endDate: null,
        current: true,
        description: "Desarrollo y mantenimiento de APIs REST y microservicios.",
        responsibilities: [
          "Diseño e implementación de APIs REST",
          "Desarrollo de microservicios",
          "Optimización de bases de datos",
        ],
        technologies: ["node", "mongodb", "docker"],
        achievements: ["Reducción del 40% en tiempos de respuesta", "Implementación de arquitectura de microservicios"],
      },
    ];
  }

  renderTimeline() {
    this.timelineContainer.innerHTML = "";

    this.experiences.forEach((experience, index) => {
      const timelineItem = this.createTimelineItem(experience, index);
      this.timelineContainer.appendChild(timelineItem);
    });
  }

  createTimelineItem(experience, index) {
    const item = document.createElement("div");
    item.className = "timeline__item";
    item.setAttribute("data-experience-id", experience.id);

    const startDate = this.formatDate(experience.startDate);
    const endDate = experience.current ? "Presente" : this.formatDate(experience.endDate);
    const duration = this.calculateDuration(experience.startDate, experience.endDate);

    item.innerHTML = `
      <div class="timeline__marker"></div>
      <div class="timeline__content">
        <div class="timeline__header">
          <h3 class="timeline__title">${experience.position}</h3>
          <span class="timeline__duration">${duration}</span>
        </div>
        <h4 class="timeline__company">
          ${experience.company}
          ${experience.current ? '<span class="timeline__current-badge">Actual</span>' : ""}
        </h4>
        <span class="timeline__period">${startDate} - ${endDate}</span>
        
        <p class="timeline__description">${experience.description}</p>
        
        ${this.renderResponsibilities(experience.responsibilities)}
        ${this.renderAchievements(experience.achievements)}
        
        <div class="timeline__technologies">
          ${experience.technologies.map((tech) => `<span class="tech-tag tech-tag--${tech}">${tech}</span>`).join("")}
        </div>
        
        <button class="timeline__toggle" data-target="timeline-details-${experience.id}">
          Ver más detalles
        </button>
        
        <div class="timeline__details" id="timeline-details-${experience.id}" style="display: none;">
          ${this.renderDetailedInfo(experience)}
        </div>
      </div>
    `;

    // Añadir animación de entrada
    item.style.opacity = "0";
    item.style.transform = "translateY(30px)";
    item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    item.style.animationDelay = `${index * 200}ms`;

    setTimeout(() => {
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }, index * 200);

    return item;
  }

  renderResponsibilities(responsibilities) {
    if (!responsibilities || responsibilities.length === 0) return "";

    return `
      <div class="timeline__section">
        <h5 class="timeline__section-title">Responsabilidades principales:</h5>
        <ul class="timeline__list">
          ${responsibilities.map((resp) => `<li>${resp}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  renderAchievements(achievements) {
    if (!achievements || achievements.length === 0) return "";

    return `
      <div class="timeline__section">
        <h5 class="timeline__section-title">Logros destacados:</h5>
        <ul class="timeline__list timeline__list--achievements">
          ${achievements.map((achievement) => `<li>${achievement}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  renderDetailedInfo(experience) {
    return `
      <div class="timeline__detailed">
        <div class="timeline__stats">
          <div class="stat-item">
            <span class="stat-label">Duración</span>
            <span class="stat-value">${this.calculateDuration(experience.startDate, experience.endDate)}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Tecnologías</span>
            <span class="stat-value">${experience.technologies.length}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Logros</span>
            <span class="stat-value">${experience.achievements?.length || 0}</span>
          </div>
        </div>
      </div>
    `;
  }

  formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    });
  }

  calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;

    if (years === 0) {
      return `${months} ${months === 1 ? "mes" : "meses"}`;
    } else if (months === 0) {
      return `${years} ${years === 1 ? "año" : "años"}`;
    } else {
      return `${years} ${years === 1 ? "año" : "años"} y ${months} ${months === 1 ? "mes" : "meses"}`;
    }
  }

  bindEvents() {
    // Toggle para mostrar/ocultar detalles
    this.timelineContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("timeline__toggle")) {
        e.preventDefault();
        this.toggleDetails(e.target);
      }
    });

    // Intersección para animaciones
    this.setupIntersectionObserver();
  }

  toggleDetails(button) {
    const targetId = button.getAttribute("data-target");
    const detailsElement = document.getElementById(targetId);

    if (!detailsElement) return;

    const isVisible = detailsElement.style.display !== "none";

    if (isVisible) {
      detailsElement.style.display = "none";
      button.textContent = "Ver más detalles";
    } else {
      detailsElement.style.display = "block";
      button.textContent = "Ver menos detalles";
    }
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.3,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("timeline__item--visible");
        }
      });
    }, options);

    const timelineItems = this.timelineContainer.querySelectorAll(".timeline__item");
    timelineItems.forEach((item) => observer.observe(item));
  }

  showErrorMessage() {
    this.timelineContainer.innerHTML = `
      <div class="timeline__error">
        <div class="timeline__error-icon">⚠️</div>
        <div class="timeline__error-message">
          No se pudo cargar la información de experiencia laboral
        </div>
      </div>
    `;
  }

  // Método público para añadir nueva experiencia
  addExperience(experienceData) {
    this.experiences.unshift(experienceData); // Añadir al principio
    this.renderTimeline();
  }

  // Método público para filtrar por tecnología
  filterByTechnology(tech) {
    const filteredExperiences = this.experiences.filter((exp) => exp.technologies.includes(tech));

    this.timelineContainer.innerHTML = "";
    filteredExperiences.forEach((experience, index) => {
      const timelineItem = this.createTimelineItem(experience, index);
      this.timelineContainer.appendChild(timelineItem);
    });
  }

  // Resetear vista
  showAllExperience() {
    this.renderTimeline();
  }
}

// ===================================
// FUNCIONES AUXILIARES
// ===================================
function getExperienceStats(experiences) {
  const stats = {
    totalJobs: experiences.length,
    totalYears: 0,
    technologies: new Set(),
    companies: new Set(),
  };

  experiences.forEach((exp) => {
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();
    const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
    stats.totalYears += years;

    exp.technologies.forEach((tech) => stats.technologies.add(tech));
    stats.companies.add(exp.company);
  });

  stats.totalYears = Math.round(stats.totalYears * 10) / 10;
  stats.technologies = Array.from(stats.technologies);
  stats.companies = Array.from(stats.companies);

  return stats;
}

// ===================================
// INICIALIZACIÓN
// ===================================
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".timeline")) {
    window.experienceManager = new ExperienceManager();
  }
});

// Exportar para uso externo
window.ExperienceManager = ExperienceManager;
window.getExperienceStats = getExperienceStats;

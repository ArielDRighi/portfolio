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
      await this.loadExperience(); // ← Añadir await aquí
      this.renderTimeline();
      this.bindEvents();
    } catch (error) {
      console.error("Error cargando experiencia:", error);
      this.showErrorMessage();
    }
  }

  async loadExperience() {
    try {
      // Intentar cargar desde JSON primero (mejor separación de responsabilidades)
      const response = await fetch("./data/experience.json");
      if (response.ok) {
        this.experiences = await response.json();
      } else {
        // Fallback a datos embebidos si hay problemas de CORS/file://
        console.warn("No se pudo cargar experience.json, usando datos embebidos como fallback");
        this.experiences = this.getFallbackExperienceData();
      }
    } catch (error) {
      // Fallback a datos embebidos para compatibilidad con file://
      console.warn("Error cargando JSON, usando datos embebidos:", error.message);
      this.experiences = this.getFallbackExperienceData();
    }

    // Ordenar: primero las actuales, luego por fecha de inicio más reciente
    this.experiences.sort((a, b) => {
      // Si una es actual y la otra no, la actual va primera
      if (a.current && !b.current) return -1;
      if (!a.current && b.current) return 1;

      // Si ambas son actuales o ambas terminadas, ordenar por fecha de inicio más reciente
      return new Date(b.startDate) - new Date(a.startDate);
    });
  }

  getFallbackExperienceData() {
    return [
      {
        id: 1,
        company: "GesDev",
        position: "Desarrollador Backend",
        startDate: "2025-06-17",
        endDate: "2025-09-15",
        current: false,
        description:
          "Desarrollo completo de un sistema de gestión empresarial integral para empresas de servicios con más de 400 empleados y 20+ años de trayectoria. El sistema automatiza y optimiza procesos críticos del negocio, desde recursos humanos hasta operaciones complejas, con arquitectura enterprise y automatización avanzada.",
        responsibilities: [
          "Desarrollo de sistema empresarial integral con 23 módulos funcionales interconectados utilizando NestJS y TypeScript",
          "Implementación de arquitectura enterprise con 150+ endpoints REST API documentados con Swagger automático",
          "Diseño y desarrollo de base de datos PostgreSQL con 25+ tablas y relaciones complejas para gestión empresarial",
          "Desarrollo de sistema de asignación inteligente de recursos (empleados, vehículos, herramientas) por servicio",
          "Implementación de generación automática de tareas que crea 300+ tareas al crear un servicio contractual",
          "Creación de sistema multi-depósito con gestión completa de inventario y transferencias en tiempo real",
          "Desarrollo de CRM completo con gestión integral de clientes, múltiples ubicaciones y contratos dinámicos",
          "Implementación de scheduler robusto con cron jobs para contratos, licencias y reportes programados",
        ],
        technologies: [
          "nestjs",
          "typescript",
          "nodejs",
          "postgresql",
          "typeorm",
          "jwt",
          "passport",
          "bcrypt",
          "exceljs",
          "nodemailer",
          "pdfkit",
          "swagger",
          "jest",
          "git",
          "jira",
        ],
        achievements: [
          "Digitalización completa de procesos empresariales manuales para empresa con 400+ empleados y 20+ años de experiencia",
          "Desarrollo exitoso de 23 módulos interconectados con arquitectura enterprise escalable y mantenible",
          "Implementación de sistema de automatización que genera automáticamente hasta 348 tareas por servicio",
          "Creación de sistema multi-tenant con inventario multi-depósito y e-commerce interno funcional",
          "Desarrollo de dashboard analytics con KPIs empresariales y reportes ejecutivos para toma de decisiones",
        ],
      },
      {
        id: 2,
        company: "MVA",
        position: "Desarrollador Backend",
        startDate: "2025-03-26",
        endDate: "2025-09-12",
        current: false,
        description:
          "Desarrollo completo de una aplicación backend empresarial para la gestión integral de servicios de alquiler y mantenimiento de baños químicos. Sistema de gestión empresarial que incluye recursos, clientes, empleados y operaciones logísticas. Proyecto desarrollado en equipo con arquitectura escalable y funcionalidades avanzadas de automatización.",
        responsibilities: [
          "Desarrollo de sistema de gestión empresarial completo con +15 módulos funcionales utilizando NestJS y TypeScript",
          "Implementación de sistema de autenticación JWT con roles granulares (Admin, Supervisor, Operario) y guards personalizados",
          "Diseño y desarrollo de arquitectura de base de datos PostgreSQL con TypeORM para gestión de recursos y operaciones",
          "Desarrollo de sistema de asignación automática e inteligente de recursos (empleados, vehículos, baños químicos)",
          "Implementación de portal de clientes con sistema de reclamos, encuestas de satisfacción y solicitudes públicas",
          "Creación de sistema de scheduler para automatización de estados de servicios y alertas de vencimientos",
          "Desarrollo de módulo de reportes con generación de archivos Excel y sistema de notificaciones por email",
          "Implementación de validación exhaustiva de DTOs y interceptores para logging y transformación de datos",
        ],
        technologies: [
          "nestjs",
          "typescript",
          "nodejs",
          "postgresql",
          "typeorm",
          "jwt",
          "passport",
          "bcrypt",
          "exceljs",
          "nodemailer",
          "jest",
          "docker",
          "git",
          "jira",
          "trello",
        ],
        achievements: [
          "Desarrollo exitoso de +100 endpoints REST API completamente documentados para gestión empresarial integral",
          "Implementación de sistema de roles y autorización que optimizó el flujo operativo de la empresa",
          "Creación de portal público que mejoró significativamente la comunicación cliente-empresa",
          "Desarrollo de sistema de automatización que redujo errores operativos mediante validaciones inteligentes",
          "Implementación de arquitectura escalable preparada para crecimiento futuro de la empresa",
        ],
      },
      {
        id: 3,
        company: "Segimed",
        position: "Desarrollador Backend (Pasantía)",
        startDate: "2025-06-01",
        endDate: null,
        current: true,
        description:
          "Segimed es una plataforma clínica que facilita el seguimiento de pacientes y la relación médico-paciente a distancia, manejo de historiales médicos, alertas en tiempo real, comunicación y agenda médica, con especial énfasis en seguridad, privacidad y disponibilidad. Mi participación contribuyó a estructurar la arquitectura backend para soportar múltiples clientes, integraciones críticas y garantizar el cumplimiento de estándares de seguridad en salud digital.",
        responsibilities: [
          "Desarrollo de sistema multi-tenant para soportar múltiples médicos, pacientes y clínicas con aislamiento y seguridad entre clientes",
          "Implementación de autenticación por JWT para usuarios diferenciados (médicos, pacientes) asegurando sesiones seguras y roles granulares",
          "Integración con servicios externos Twilio para notificaciones, mensajes y llamadas en tiempo real",
          "Integración con Cloudinary para manejo de almacenamiento de archivos médicos (imágenes, estudios médicos)",
          "Mantenimiento y optimización de base de datos PostgreSQL mediante Prisma como ORM, incluyendo diseño de esquemas y migraciones",
          "Aseguramiento de buenas prácticas de backend con enfoque en seguridad, escalabilidad y limpieza de código",
          "Implementación de pruebas y documentación técnica para garantizar mantenibilidad del sistema",
        ],
        technologies: [
          "nestjs",
          "typescript",
          "nodejs",
          "postgresql",
          "prisma",
          "jwt",
          "twilio",
          "cloudinary",
          "websockets",
          "git",
          "jest",
        ],
        achievements: [
          "Estructuración exitosa de arquitectura backend multi-tenant para plataforma de salud digital con múltiples clientes",
          "Implementación de estándares de seguridad críticos cumpliendo regulaciones del sector salud",
          "Desarrollo de integraciones críticas con servicios externos garantizando comunicación en tiempo real",
          "Optimización de base de datos para manejo eficiente de historiales médicos sensibles",
        ],
      },
      {
        id: 4,
        company: "SwaplyAr",
        position: "Desarrollador Backend (Pasantía)",
        startDate: "2025-01-01",
        endDate: "2025-06-30",
        current: false,
        description:
          "SwaplyAr es una plataforma fintech que facilita transacciones financieras digitales internacionales entre billeteras virtuales y cuentas bancarias, con foco en seguridad, transparencia, eficiencia y usabilidad. Mi participación contribuyó al desarrollo del backend encargado de manejar el registro, inicio de sesión, gestión de usuarios e integración con servicios externos, asegurando que la API sea mantenible y segura.",
        responsibilities: [
          "Desarrollo y mantenimiento de APIs RESTful usando Node.js y Express.js para transacciones financieras digitales",
          "Implementación de autenticación segura con JWT y bcrypt para protección de datos financieros sensibles",
          "Gestión de datos mediante Google Sheets como base de datos para operaciones de la plataforma fintech",
          "Auto-documentación de endpoints con Swagger para facilitar mantenimiento y escalabilidad de APIs",
          "Validación de datos con express-validator para asegurar integridad del backend en transacciones financieras",
          "Participación en organización del backlog y priorización de tareas mediante metodologías ágiles",
          "Seguimiento de metodología Gitflow para control de versiones y deployments seguros",
        ],
        technologies: [
          "nodejs",
          "express",
          "javascript",
          "jwt",
          "bcrypt",
          "google-sheets",
          "swagger",
          "express-validator",
          "git",
          "clickup",
        ],
        achievements: [
          "Implementación exitosa de sistema de autenticación robusto para plataforma fintech con transacciones internacionales",
          "Desarrollo de documentación automatizada con Swagger mejorando mantenibilidad de APIs críticas",
          "Optimización de flujo de trabajo con metodología Gitflow garantizando deployments seguros",
          "Gestión eficiente de datos financieros mediante Google Sheets API con validaciones robustas",
        ],
      },
      {
        id: 5,
        company: "Industria de Videojuegos",
        position: "Líder de Proyecto y Diseño → Diseñador de Juegos → Artista 3D",
        startDate: "2012-01-01",
        endDate: "2024-12-31",
        current: false,
        description:
          "Más de 10 años de experiencia en la industria de videojuegos con progresión completa desde Artista 3D hasta Líder de Proyecto y Diseño. Lideré equipos multidisciplinarios en el desarrollo completo de videojuegos, gestionando el ciclo de vida del proyecto desde concepto inicial hasta entrega final. Mi evolución profesional abarca desarrollo técnico, diseño creativo y liderazgo de proyectos.",
        responsibilities: [
          "Liderazgo de equipos multidisciplinarios coordinando departamentos de arte, programación y audio para eficiencia y alineación de objetivos",
          "Gestión integral del ciclo de vida de proyectos de videojuegos desde concepto inicial hasta entrega final",
          "Creación y gestión de user stories y backlogs utilizando herramientas como Jira y Trello para optimización de flujo de trabajo",
          "Definición de objetivos de sprint y monitoreo de tareas de desarrolladores para asegurar cumplimiento de metas",
          "Desarrollo de prototipos, sistemas de IA y diseño de niveles para múltiples títulos de videojuegos",
          "Especialización en modelado 3D, rigging y retopología para proyectos de videojuegos AAA e indie",
          "Coordinación de colaboración interdepartamental para mantener calidad y coherencia del producto final",
          "Implementación de metodologías ágiles adaptadas al desarrollo de videojuegos para entregas iterativas",
        ],
        technologies: [
          "unity",
          "unreal-engine",
          "blender",
          "maya",
          "3ds-max",
          "substance-painter",
          "photoshop",
          "jira",
          "trello",
          "perforce",
          "git",
          "c-sharp",
          "javascript",
        ],
        achievements: [
          "Evolución profesional completa desde Artista 3D hasta Líder de Proyecto y Diseño en 12 años de industria",
          "Liderazgo exitoso de múltiples proyectos de videojuegos con equipos de 5-15 desarrolladores",
          "Implementación de flujos de trabajo ágiles que mejoraron la eficiencia de desarrollo en 40%",
          "Desarrollo de pipeline de arte 3D que optimizó tiempos de producción en proyectos AAA",
          "Gestión eficiente de backlogs complejos con priorización estratégica de features",
        ],
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
      <div class="timeline__external-date">${startDate} - ${endDate}</div>
      <div class="timeline__content">
        <div class="timeline__header">
          <div class="timeline__header-main">
            <h3 class="timeline__title">${experience.position}</h3>
            <h4 class="timeline__company">
              ${experience.company}
              ${experience.current ? '<span class="timeline__current-badge">Actual</span>' : ""}
            </h4>
          </div>
        </div>
        
        <div class="timeline__footer">
          <button class="timeline__show-details" onclick="experienceManager.showModal(${experience.id})">
            Mostrar información
          </button>
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

  // Método para mostrar modal con información detallada
  showModal(experienceId) {
    const experience = this.experiences.find((exp) => exp.id === experienceId);
    if (!experience) return;

    // Crear modal si no existe
    let modal = document.getElementById("experience-modal");
    if (!modal) {
      modal = this.createModal();
      document.body.appendChild(modal);
    }

    // Llenar contenido del modal
    const modalContent = modal.querySelector(".modal-content");
    modalContent.innerHTML = `
      <div class="modal-header">
        <h2>${experience.position}</h2>
        <h3>${experience.company}</h3>
        <span class="modal-period">${this.formatDate(experience.startDate)} - ${
      experience.current ? "Presente" : this.formatDate(experience.endDate)
    }</span>
        <button class="modal-close" onclick="experienceManager.closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="modal-section">
          <h4>Descripción del proyecto</h4>
          <p>${experience.description}</p>
        </div>
        
        <div class="modal-section">
          <h4>Responsabilidades principales</h4>
          <ul>
            ${experience.responsibilities.map((resp) => `<li>${resp}</li>`).join("")}
          </ul>
        </div>
        
        <div class="modal-section">
          <h4>Tecnologías utilizadas</h4>
          <div class="modal-technologies">
            ${experience.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")}
          </div>
        </div>
        
        <div class="modal-section">
          <h4>Logros destacados</h4>
          <ul>
            ${experience.achievements.map((achievement) => `<li>${achievement}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;

    // Mostrar modal
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  // Método para cerrar modal
  closeModal() {
    const modal = document.getElementById("experience-modal");
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  // Crear estructura del modal
  createModal() {
    const modal = document.createElement("div");
    modal.id = "experience-modal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-overlay" onclick="experienceManager.closeModal()"></div>
      <div class="modal-content"></div>
    `;
    return modal;
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

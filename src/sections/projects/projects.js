/**
 * Sistema de Tarjetas Elegantes para Proyectos
 * Maneja el renderizado de tarjetas con datos embebidos
 */
class ProjectsGrid {
  constructor() {
    this.gridContainer = document.getElementById('projectsGrid');
    this.projectModal = document.getElementById('projectModal');
    this.modalClose = document.getElementById('modalClose');
    this.modalOverlay = document.getElementById('modalOverlay');
    this.modalBody = document.getElementById('modalBody');

    this.projects = this.getEmbeddedProjects();
    this.isModalOpen = false;

    this.init();
  }

  async init() {
    if (!this.gridContainer) {
      return;
    }

    this.setupEventListeners();
    this.renderProjectCards();
    this.updateStats();
  }

  getEmbeddedProjects() {
    return [
      {
        id: 1,
        name: 'Ecommerce Monolith Foundation',
        type: 'Monolith',
        description:
          'Backend monolítico de nivel empresarial para e-commerce. Optimización extrema con 34 índices estratégicos en PostgreSQL (mejoras del 85-94%). Suite comprehensiva de 514 pruebas (74.69% cobertura). Pipeline CI/CD profesional con quality gates y escaneo de seguridad. Ingeniería documentada con ADRs y 162 story points completados. Arquitectura DDD con módulos independientes y APIs user-friendly.',
        technologies: ['node', 'typescript', 'postgresql', 'docker'],
        github: 'https://github.com/ArielDRighi/ecommerce-monolith-foundation',
        demo: null,
        status: 'completed',
        featured: true,
        stats: { stars: 0, forks: 0, commits: 0 },
        highlights: [
          '34 índices estratégicos con mejoras del 85-94%',
          '514 tests (425 unitarias + 89 E2E) - 74.69% coverage',
          'Pipeline CI/CD con quality gates automáticos',
          'Architecture Decision Records (ADRs)',
          'Principios DDD y separación de módulos',
          'Builds multi-stage en Docker',
        ],
      },
      {
        id: 2,
        name: 'Ecommerce Async Resilient System',
        type: 'Microservices',
        description:
          'Sistema asíncrono de procesamiento de órdenes para e-commerce con arquitectura event-driven. Saga Pattern con compensación automática, 4 colas especializadas (Bull + Redis). Circuit Breaker + Retry + Idempotency para resiliencia enterprise. Outbox Pattern para consistencia DB/Queue. Optimización de performance: de 5 segundos a 100 milisegundos. Testing riguroso con 1,187 tests unitarios + 262 E2E (72% coverage). 25 ADRs con análisis de trade-offs arquitectónicos.',
        technologies: ['node', 'typescript', 'postgresql', 'redis', 'docker'],
        github: 'https://github.com/ArielDRighi/ecommerce-async-resilient-system',
        demo: null,
        status: 'completed',
        featured: true,
        stats: { stars: 0, forks: 0, commits: 0 },
        highlights: [
          'Performance: 5 segundos → 100 milisegundos',
          'Saga Pattern con compensación automática',
          '4 colas especializadas (Bull + Redis)',
          'Circuit Breaker + Retry + Idempotency',
          'Outbox Pattern para consistencia',
          '1,187 tests unitarios + 262 E2E (72% coverage)',
          '25 ADRs con análisis arquitectónico',
        ],
      },
    ];
  }

  setupEventListeners() {
    // Modal close events
    if (this.modalClose) {
      this.modalClose.addEventListener('click', this.closeModal.bind(this));
    }

    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) {
          this.closeModal();
        }
      });
    }

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isModalOpen) {
        this.closeModal();
      }
    });
  }

  async loadProjects() {
    try {
      const response = await fetch('data/projects.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      this.projects = await response.json();
      await this.enrichWithGitHub();
    } catch (error) {
      console.error('Error cargando proyectos:', error);
      this.projects = this.getDefaultProjects();
    }
  }

  /**
   * Enriquece los proyectos con datos de GitHub
   */
  async enrichWithGitHub() {
    try {
      // Cargar la integración de GitHub si no está disponible
      if (!window.githubIntegration) {
        await this.loadGitHubIntegration();
      }

      // Intentar cargar configuración
      const configured = window.githubIntegration.loadConfiguration();

      if (configured && window.githubIntegration.isConfigured()) {
        const enrichedProjects = await window.githubIntegration.enrichProjects(this.projects);
        this.projects = enrichedProjects;
      }
    } catch (error) {
      console.warn('No se pudo enriquecer con GitHub:', error);
    }
  }

  /**
   * Carga dinámicamente la integración de GitHub
   */
  async loadGitHubIntegration() {
    return new Promise((resolve, reject) => {
      if (window.githubIntegration) {
        console.log('✅ GitHub integration already loaded');
        resolve();
        return;
      }

      console.log('📦 Loading js/github-integration.js...');
      const script = document.createElement('script');
      script.src = 'js/github-integration.js';
      script.onload = () => {
        console.log('✅ GitHub integration loaded');
        resolve();
      };
      script.onerror = (error) => {
        console.warn('⚠️ Failed to load GitHub integration:', error);
        reject(error);
      };

      // Agregar timeout para evitar que se cuelgue
      setTimeout(() => {
        console.warn('⏰ GitHub integration load timeout');
        reject(new Error('Timeout loading GitHub integration'));
      }, 5000);

      document.head.appendChild(script);
    });
  }

  getDefaultProjects() {
    return [
      {
        id: 1,
        name: 'API REST E-commerce',
        type: 'api',
        description:
          'API completa para sistema de e-commerce con autenticación JWT, pagos con Stripe y gestión avanzada de inventario. Incluye documentación Swagger y testing automatizado.',
        technologies: ['node', 'express', 'mongodb', 'redis'],
        github: 'https://github.com/usuario/ecommerce-api',
        demo: 'https://ecommerce-api-demo.herokuapp.com',
        status: 'completed',
        featured: true,
        stats: { stars: 45, forks: 12, commits: 156 },
        highlights: [
          'Arquitectura RESTful completa',
          'Autenticación JWT con refresh tokens',
          'Integración con Stripe para pagos',
          'Sistema de cache con Redis',
          'Documentación automática con Swagger',
        ],
      },
      {
        id: 2,
        name: 'Microservicios Chat',
        type: 'microservices',
        description:
          'Sistema de chat en tiempo real con arquitectura de microservicios usando WebSockets, RabbitMQ para mensajería y Docker para orquestación.',
        technologies: ['node', 'docker', 'postgresql', 'redis'],
        github: 'https://github.com/usuario/chat-microservices',
        demo: 'https://chat-demo.vercel.app',
        status: 'completed',
        featured: true,
        stats: { stars: 38, forks: 8, commits: 203 },
        highlights: [
          'Arquitectura de microservicios',
          'WebSockets para tiempo real',
          'RabbitMQ para comunicación entre servicios',
          'Docker Compose para desarrollo',
          'Monitoreo con Prometheus',
        ],
      },
      {
        id: 3,
        name: 'FastAPI ML Service',
        type: 'ml',
        description:
          'Servicio de Machine Learning para predicciones usando FastAPI, TensorFlow y MLflow para gestión de modelos. Incluye pipeline CI/CD automatizado.',
        technologies: ['python', 'fastapi', 'postgresql', 'docker'],
        github: 'https://github.com/usuario/ml-service',
        demo: null,
        status: 'completed',
        featured: false,
        stats: { stars: 23, forks: 5, commits: 89 },
        highlights: [
          'API para modelos de ML',
          'Gestión de modelos con MLflow',
          'Validación automática de datos',
          'Containerización con Docker',
          'Pipeline de entrenamiento automatizado',
        ],
      },
    ];
  }

  renderProjectCards() {
    console.log('🎨 Starting renderProjectCards...');
    console.log('Grid container:', this.gridContainer);
    console.log('Projects to render:', this.projects.length);

    if (!this.gridContainer) {
      console.log('❌ No grid container found');
      return;
    }

    // Clear loading state
    console.log('🧹 Clearing loading state...');
    this.gridContainer.innerHTML = '';

    if (this.projects.length === 0) {
      console.log('⚠️ No projects to render');
      this.gridContainer.innerHTML = '<p>No hay proyectos disponibles</p>';
      return;
    }

    console.log('🔄 Creating project cards...');
    this.projects.forEach((project, index) => {
      console.log(`Creating card ${index + 1}:`, project.name);
      const card = this.createProjectCard(project);
      this.gridContainer.appendChild(card);
    });

    console.log('✅ All cards created');

    // Initialize Feather Icons for the new cards
    if (typeof feather !== 'undefined') {
      console.log('🪶 Replacing feather icons...');
      feather.replace();
    } else {
      console.log('⚠️ Feather icons not available');
    }
  }

  createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.projectId = project.id;

    const statusClass = project.status === 'completed' ? 'completed' : 'in-progress';
    const statusText = project.status === 'completed' ? 'Completado' : 'En Progreso';

    const techGrid = this.createTechGrid(project.technologies);
    const hoverInfo = this.createHoverInfo(project);

    card.innerHTML = `
      <div class="project__header">
        <div class="project__title-section">
          <h3 class="project__title">${project.name}</h3>
          <span class="project__type">${project.type}</span>
        </div>
        <div class="project__status project__status--${statusClass}">
          <span class="project__status-dot"></span>
          <span>${statusText}</span>
        </div>
      </div>

      <div class="project__content">
        <p class="project__description">${project.description}</p>

        <div class="project__technologies">
          <div class="project__tech-label">
            <i data-feather="code"></i>
            <span>Tecnologías</span>
          </div>
          <div class="project__tech-grid">
            ${techGrid}
          </div>
        </div>

        <div class="project__actions">
          <a href="${project.github}" target="_blank" class="project__action project__action--primary">
            <i data-feather="github"></i>
            <span>GitHub</span>
          </a>
          ${
            project.demo
              ? `
            <a href="${project.demo}" target="_blank" class="project__action">
              <i data-feather="external-link"></i>
              <span>Demo</span>
            </a>
          `
              : `
            <button class="project__action" onclick="projectsGrid.openModal(${project.id})">
              <i data-feather="info"></i>
              <span>Detalles</span>
            </button>
          `
          }
        </div>
      </div>

      ${hoverInfo}
    `;

    // Add click event for opening modal
    card.addEventListener('click', (e) => {
      // Only open modal if not clicking on action buttons
      if (!e.target.closest('.project__action')) {
        this.openModal(project.id);
      }
    });

    return card;
  }

  createTechGrid(technologies) {
    return technologies
      .slice(0, 6)
      .map((tech) => {
        const techName = this.getTechDisplayName(tech);
        const techIcon = this.getTechIcon(tech);

        return `
        <div class="tech-item" title="${techName}">
          <div class="tech-icon tech-icon--${tech}">${techIcon}</div>
          <span class="tech-name">${techName}</span>
        </div>
      `;
      })
      .join('');
  }

  createHoverInfo(project) {
    const highlights = project.highlights ? project.highlights.slice(0, 4) : [];

    return `
      <div class="project__hover-info">
        <div class="project__hover-content">
          <h4 class="project__hover-title">${project.name}</h4>
          
          ${
            highlights.length > 0
              ? `
            <ul class="project__highlights">
              ${highlights.map((highlight) => `<li>${highlight}</li>`).join('')}
            </ul>
          `
              : ''
          }

          <div class="project__stats">
            <div class="project__stat">
              <span class="project__stat-number">${project.stats.stars}</span>
              <span class="project__stat-label">Stars</span>
            </div>
            <div class="project__stat">
              <span class="project__stat-number">${project.stats.commits}</span>
              <span class="project__stat-label">Commits</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getTechDisplayName(tech) {
    const names = {
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
    };
    return names[tech] || tech.charAt(0).toUpperCase() + tech.slice(1);
  }

  getTechIcon(tech) {
    const icons = {
      node: '💚',
      express: '🚂',
      mongodb: '🍃',
      postgresql: '🐘',
      redis: '🔴',
      docker: '🐳',
      aws: '☁️',
      python: '🐍',
      fastapi: '⚡',
      typescript: '📘',
    };
    return icons[tech] || '⚙️';
  }

  openModal(projectId) {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return;

    this.modalBody.innerHTML = this.createModalContent(project);
    this.projectModal.classList.add('active');
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';

    // Initialize Feather Icons in modal
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  createModalContent(project) {
    const statusIcon = project.status === 'completed' ? 'check-circle' : 'clock';
    const statusText = project.status === 'completed' ? 'Completado' : 'En Progreso';
    const statusClass = project.status === 'completed' ? 'completed' : 'in-progress';

    const techList = project.technologies
      .map(
        (tech) => `
      <span class="tech-tag tech-tag--${tech}">
        ${this.getTechIcon(tech)} ${this.getTechDisplayName(tech)}
      </span>
    `
      )
      .join('');

    const highlights = project.highlights || [];

    return `
      <div class="modal-project-content">
        <div class="modal-project-header">
          <div class="modal-project-title">
            <h2>${project.name}</h2>
            <div class="modal-project-status modal-project-status--${statusClass}">
              <i data-feather="${statusIcon}"></i>
              <span>${statusText}</span>
            </div>
          </div>
          <div class="modal-project-type">${project.type}</div>
        </div>

        <div class="modal-project-description">
          <p>${project.description}</p>
        </div>

        ${
          highlights.length > 0
            ? `
          <div class="modal-project-highlights">
            <h3>
              <i data-feather="star"></i>
              Características Destacadas
            </h3>
            <ul>
              ${highlights.map((highlight) => `<li>${highlight}</li>`).join('')}
            </ul>
          </div>
        `
            : ''
        }

        <div class="modal-project-technologies">
          <h3>
            <i data-feather="code"></i>
            Tecnologías Utilizadas
          </h3>
          <div class="modal-tech-grid">
            ${techList}
          </div>
        </div>

        <div class="modal-project-stats">
          <div class="modal-stat-card">
            <i data-feather="star" class="modal-stat-icon"></i>
            <div class="modal-stat-info">
              <span class="modal-stat-number">${project.stats.stars}</span>
              <span class="modal-stat-label">GitHub Stars</span>
            </div>
          </div>
          <div class="modal-stat-card">
            <i data-feather="git-branch" class="modal-stat-icon"></i>
            <div class="modal-stat-info">
              <span class="modal-stat-number">${project.stats.forks}</span>
              <span class="modal-stat-label">Forks</span>
            </div>
          </div>
          <div class="modal-stat-card">
            <i data-feather="git-commit" class="modal-stat-icon"></i>
            <div class="modal-stat-info">
              <span class="modal-stat-number">${project.stats.commits}</span>
              <span class="modal-stat-label">Commits</span>
            </div>
          </div>
        </div>

        <div class="modal-project-actions">
          <a href="${project.github}" target="_blank" class="modal-action-btn modal-action-btn--primary">
            <i data-feather="github"></i>
            <span>Ver en GitHub</span>
          </a>
          ${
            project.demo
              ? `
            <a href="${project.demo}" target="_blank" class="modal-action-btn modal-action-btn--secondary">
              <i data-feather="external-link"></i>
              <span>Ver Demo</span>
            </a>
          `
              : ''
          }
        </div>
      </div>

      <style>
        .modal-project-content {
          font-family: var(--font-primary);
        }
        
        .modal-project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-xl);
          padding-bottom: var(--spacing-lg);
          border-bottom: 1px solid var(--color-border);
        }
        
        .modal-project-title h2 {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--color-text);
          font-size: var(--font-size-xl);
        }
        
        .modal-project-status {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: 600;
        }
        
        .modal-project-status--completed {
          background: var(--color-success-light);
          color: var(--color-success);
        }
        
        .modal-project-status--in-progress {
          background: var(--color-warning-light);
          color: var(--color-warning);
        }
        
        .modal-project-type {
          background: var(--color-accent-light);
          color: var(--color-accent);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .modal-project-description {
          margin-bottom: var(--spacing-xl);
          line-height: 1.6;
          color: var(--color-text-light);
        }
        
        .modal-project-highlights,
        .modal-project-technologies {
          margin-bottom: var(--spacing-xl);
        }
        
        .modal-project-highlights h3,
        .modal-project-technologies h3 {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin: 0 0 var(--spacing-md) 0;
          color: var(--color-text);
          font-size: var(--font-size-lg);
        }
        
        .modal-project-highlights ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .modal-project-highlights li {
          padding: var(--spacing-sm) 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--color-text-light);
        }
        
        .modal-project-highlights li::before {
          content: '';
          width: 6px;
          height: 6px;
          background: var(--color-accent);
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .modal-tech-grid {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }
        
        .tech-tag {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-text);
        }
        
        .modal-project-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
          padding: var(--spacing-lg);
          background: var(--color-background);
          border-radius: var(--radius-lg);
        }
        
        .modal-stat-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }
        
        .modal-stat-icon {
          color: var(--color-accent);
          width: 24px;
          height: 24px;
        }
        
        .modal-stat-number {
          display: block;
          font-size: var(--font-size-lg);
          font-weight: 700;
          color: var(--color-text);
        }
        
        .modal-stat-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-light);
        }
        
        .modal-project-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
        }
        
        .modal-action-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-xl);
          border-radius: var(--radius-md);
          text-decoration: none;
          font-weight: 600;
          transition: all var(--transition-fast);
        }
        
        .modal-action-btn--primary {
          background: var(--color-accent);
          color: var(--color-background);
        }
        
        .modal-action-btn--primary:hover {
          background: var(--color-accent-secondary);
          transform: translateY(-2px);
        }
        
        .modal-action-btn--secondary {
          background: var(--color-background);
          color: var(--color-text);
          border: 1px solid var(--color-border);
        }
        
        .modal-action-btn--secondary:hover {
          background: var(--color-accent-light);
          border-color: var(--color-accent);
        }
        
        @media (max-width: 768px) {
          .modal-project-header {
            flex-direction: column;
            gap: var(--spacing-md);
          }
          
          .modal-project-stats {
            grid-template-columns: 1fr;
          }
          
          .modal-project-actions {
            flex-direction: column;
          }
        }
      </style>
    `;
  }

  closeModal() {
    this.projectModal.classList.remove('active');
    this.isModalOpen = false;
    document.body.style.overflow = '';
  }

  updateStats() {
    const totalProjects = document.getElementById('totalProjects');
    const totalTechnologies = document.getElementById('totalTechnologies');
    const totalStars = document.getElementById('totalStars');
    const totalCommits = document.getElementById('totalCommits');

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
      const commitsCount = this.projects.reduce(
        (sum, p) => sum + (p.stats ? p.stats.commits : 0),
        0
      );
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

// Auto-initialize when section is loaded
document.addEventListener('sectionLoaded', (event) => {
  console.log('Event sectionLoaded received:', event.detail);
  if (event.detail.section === 'projects') {
    console.log('Initializing ProjectsGrid from sectionLoaded');
    window.projectsGrid = new ProjectsGrid();
  }
});

// Fallback initialization for non-modular version
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded - checking for projectsGrid element');
  const gridElement = document.getElementById('projectsGrid');
  console.log('Grid element found:', !!gridElement);

  if (gridElement && !window.projectsGrid) {
    console.log('Initializing ProjectsGrid from DOMContentLoaded');
    window.projectsGrid = new ProjectsGrid();
  }
});

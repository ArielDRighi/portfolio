/**
 * Sistema de carga modular para el portfolio
 * Carga dinámicamente las secciones desde archivos separados
 */
class ModuleLoader {
  constructor() {
    this.loadedModules = new Set();
    this.sectionContainers = new Map();
    this.init();
  }

  init() {
    this.setupSectionContainers();
    this.loadAllSections();
  }

  setupSectionContainers() {
    // Mapear containers de las secciones
    this.sectionContainers.set('header', document.querySelector('.header'));
    this.sectionContainers.set('about', document.querySelector('#about'));
    this.sectionContainers.set('experience', document.querySelector('#experience'));
    this.sectionContainers.set('projects', document.querySelector('#projects'));
    this.sectionContainers.set('contact', document.querySelector('#contact'));
    this.sectionContainers.set('footer', document.querySelector('.footer'));
  }

  async loadAllSections() {
    const sections = [
      { name: 'header', path: 'components/header' },
      { name: 'about', path: 'sections/about' },
      { name: 'experience', path: 'sections/experience' },
      { name: 'projects', path: 'sections/projects' },
      { name: 'contact', path: 'sections/contact' },
      { name: 'footer', path: 'components/footer' },
    ];

    // Cargar secciones en paralelo para mejor rendimiento
    const loadPromises = sections.map((section) => this.loadSection(section));
    await Promise.all(loadPromises);

    // Inicializar módulos después de que todo esté cargado
    this.initializeModules();
  }

  async loadSection({ name, path }) {
    try {
      const container = this.sectionContainers.get(name);
      if (!container) {
        console.warn(`Container para la sección '${name}' no encontrado`);
        return;
      }

      // Cargar HTML
      await this.loadHTML(container, `${path}/${name}.html`);

      // Cargar CSS específico
      await this.loadCSS(`${path}/${name}.css`);

      // Cargar JavaScript específico
      await this.loadJS(`${path}/${name}.js`);

      this.loadedModules.add(name);

      // Disparar evento personalizado
      this.dispatchSectionLoaded(name);

      console.log(`✅ Sección '${name}' cargada correctamente`);
    } catch (error) {
      console.error(`❌ Error cargando sección '${name}':`, error);
    }
  }

  async loadHTML(container, path) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();
      container.innerHTML = html;
    } catch (error) {
      console.warn(`HTML no disponible para ${path}:`, error.message);
    }
  }

  async loadCSS(path) {
    return new Promise((resolve, reject) => {
      // Verificar si ya está cargado
      if (document.querySelector(`link[href="${path}"]`)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = path;

      link.onload = () => resolve();
      link.onerror = () => {
        console.warn(`CSS no disponible: ${path}`);
        resolve(); // No fallar por CSS faltante
      };

      document.head.appendChild(link);
    });
  }

  async loadJS(path) {
    return new Promise((resolve, reject) => {
      // Verificar si ya está cargado
      if (document.querySelector(`script[src="${path}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = path;
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () => {
        console.warn(`JS no disponible: ${path}`);
        resolve(); // No fallar por JS faltante
      };

      document.body.appendChild(script);
    });
  }

  dispatchSectionLoaded(sectionName) {
    const event = new CustomEvent('sectionLoaded', {
      detail: { section: sectionName },
    });
    document.dispatchEvent(event);
  }

  initializeModules() {
    // Disparar evento cuando todos los módulos estén cargados
    const allLoaded = new CustomEvent('allSectionsLoaded', {
      detail: {
        loadedModules: Array.from(this.loadedModules),
        totalModules: this.sectionContainers.size,
      },
    });
    document.dispatchEvent(allLoaded);

    console.log('🎉 Todos los módulos cargados:', this.loadedModules);
  }

  // Método para cargar una sección específica bajo demanda
  async loadSectionOnDemand(sectionName, path) {
    if (this.loadedModules.has(sectionName)) {
      console.log(`Sección '${sectionName}' ya está cargada`);
      return;
    }

    await this.loadSection({ name: sectionName, path });
  }

  // Método para verificar si una sección está cargada
  isSectionLoaded(sectionName) {
    return this.loadedModules.has(sectionName);
  }

  // Método para obtener información del estado de carga
  getLoadingStatus() {
    return {
      loaded: Array.from(this.loadedModules),
      total: this.sectionContainers.size,
      pending: Array.from(this.sectionContainers.keys()).filter(
        (section) => !this.loadedModules.has(section)
      ),
    };
  }
}

// Inicializar el loader cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.moduleLoader = new ModuleLoader();
});

// Eventos para debugging y coordinación entre módulos
document.addEventListener('sectionLoaded', (event) => {
  console.log(`📦 Sección cargada: ${event.detail.section}`);
});

document.addEventListener('allSectionsLoaded', (event) => {
  console.log('🚀 Portfolio completamente cargado:', event.detail);
});

/**
 * Accessibility Utilities
 * Mejoras de accesibilidad para el portfolio
 */

export class AccessibilityManager {
  private skipLink: HTMLAnchorElement | null = null;

  constructor() {
    this.init();
  }

  init(): void {
    this.createSkipLink();
    this.enhanceFocusIndicators();
    this.setupKeyboardNavigation();
    this.announcePageChanges();
    console.log('✅ Accessibility Manager initialized');
  }

  /**
   * Crea skip link para navegación por teclado
   */
  private createSkipLink(): void {
    const existingSkipLink = document.querySelector('.skip-link');
    if (existingSkipLink) return;

    this.skipLink = document.createElement('a');
    this.skipLink.href = '#main-content';
    this.skipLink.className = 'skip-link';
    this.skipLink.textContent = 'Saltar al contenido principal';

    // Insertar al inicio del body
    document.body.insertBefore(this.skipLink, document.body.firstChild);

    // Manejar click
    this.skipLink.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const mainContent = document.getElementById('main-content') || document.querySelector('main');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /**
   * Mejora indicadores de foco para navegación por teclado
   */
  private enhanceFocusIndicators(): void {
    // Detectar si el usuario está usando teclado
    let isUsingKeyboard = false;

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        isUsingKeyboard = true;
        document.body.classList.add('using-keyboard');
      }
    });

    document.addEventListener('mousedown', () => {
      isUsingKeyboard = false;
      document.body.classList.remove('using-keyboard');
    });
  }

  /**
   * Configura navegación mejorada por teclado
   */
  private setupKeyboardNavigation(): void {
    // Escape key para cerrar modales/menús
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeAllMenus();
      }
    });

    // Arrow keys para navegación en grids
    this.setupGridNavigation();
  }

  /**
   * Navegación con flechas en grids de proyectos/tecnologías
   */
  private setupGridNavigation(): void {
    const grids = document.querySelectorAll('.tech-grid, #projectsGrid');

    grids.forEach((grid) => {
      grid.addEventListener('keydown', (e: Event) => {
        const event = e as KeyboardEvent;
        const target = event.target as HTMLElement;

        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
          return;
        }

        event.preventDefault();

        const items = Array.from(grid.querySelectorAll<HTMLElement>('.tech-item, .project-card'));
        const currentIndex = items.indexOf(
          target.closest('.tech-item, .project-card') as HTMLElement
        );

        if (currentIndex === -1) return;

        let nextIndex = currentIndex;

        switch (event.key) {
          case 'ArrowRight':
            nextIndex = Math.min(currentIndex + 1, items.length - 1);
            break;
          case 'ArrowLeft':
            nextIndex = Math.max(currentIndex - 1, 0);
            break;
          case 'ArrowDown':
            // Asumiendo 3 columnas en desktop
            nextIndex = Math.min(currentIndex + 3, items.length - 1);
            break;
          case 'ArrowUp':
            nextIndex = Math.max(currentIndex - 3, 0);
            break;
        }

        if (nextIndex !== currentIndex) {
          const nextItem = items[nextIndex];
          const focusableElement = nextItem.querySelector<HTMLElement>('a, button') || nextItem;
          focusableElement.focus();
        }
      });
    });
  }

  /**
   * Anuncia cambios de página para lectores de pantalla
   */
  private announcePageChanges(): void {
    // Crear región aria-live para anuncios
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    // Observar cambios en el título
    const observer = new MutationObserver(() => {
      announcer.textContent = `Página cargada: ${document.title}`;
    });

    observer.observe(document.querySelector('title')!, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  /**
   * Cierra todos los menús abiertos
   */
  private closeAllMenus(): void {
    // Cerrar menú de navegación
    const navMenu = document.querySelector('.nav__menu');
    const navToggle = document.getElementById('navToggle');

    if (navMenu?.classList.contains('nav__menu--open')) {
      navMenu.classList.remove('nav__menu--open');
      navToggle?.classList.remove('nav__toggle--open');
    }
  }

  /**
   * Valida y mejora atributos ARIA existentes
   */
  static validateAriaAttributes(): void {
    // Verificar que todos los botones tengan aria-label o texto
    const buttons = document.querySelectorAll<HTMLButtonElement>('button');
    buttons.forEach((button) => {
      if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
        console.warn('Button without text or aria-label:', button);
      }
    });

    // Verificar que todas las imágenes tengan alt
    const images = document.querySelectorAll<HTMLImageElement>('img');
    images.forEach((img) => {
      if (!img.getAttribute('alt')) {
        console.warn('Image without alt attribute:', img.src);
      }
    });
  }
}

// Export función de inicialización
export function initializeAccessibility(): AccessibilityManager {
  return new AccessibilityManager();
}

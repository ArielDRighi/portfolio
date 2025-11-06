/**
 * MAIN.TS - Funcionalidades principales del portfolio
 * Maneja navegación, formularios y utilidades generales
 */

import type { Config } from '../types';

// ===================================
// CONFIGURACIÓN Y CONSTANTES
// ===================================
export const CONFIG: Config = {
  animationDuration: 300,
  scrollOffset: 80,
  debounceDelay: 250,
};

// ===================================
// UTILIDADES
// ===================================
export const utils = {
  // Debounce function para optimizar eventos
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function executedFunction(...args: Parameters<T>): void {
      const later = (): void => {
        if (timeout) clearTimeout(timeout);
        func(...args);
      };
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Smooth scroll a una sección
  smoothScrollTo(element: HTMLElement, offset: number = CONFIG.scrollOffset): void {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  },

  // Verificar si un elemento está visible en el viewport
  isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Formatear fecha actual
  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },
};

// ===================================
// NAVEGACIÓN
// ===================================
export class Navigation {
  private navToggle: HTMLElement | null;
  private navMenu: HTMLElement | null;
  private navLinks: NodeListOf<HTMLElement>;
  private header: HTMLElement | null;

  constructor() {
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.querySelector<HTMLElement>('.nav__menu');
    this.navLinks = document.querySelectorAll<HTMLElement>('.nav__link');
    this.header = document.querySelector<HTMLElement>('.header');

    this.init();
  }

  init(): void {
    this.setupEventListeners();
    this.handleScroll(); // Check inicial
  }

  setupEventListeners(): void {
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Navigation links
    this.navLinks.forEach((link: HTMLElement) => {
      link.addEventListener('click', (e: Event) => this.handleNavClick(e));
    });

    // Scroll effects
    window.addEventListener('scroll', utils.debounce(() => this.handleScroll(), 100));

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        this.navMenu &&
        this.navToggle &&
        !this.navMenu.contains(target) &&
        !this.navToggle.contains(target)
      ) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu(): void {
    this.navMenu?.classList.toggle('nav__menu--open');
    this.navToggle?.classList.toggle('nav__toggle--open');
  }

  closeMobileMenu(): void {
    this.navMenu?.classList.remove('nav__menu--open');
    this.navToggle?.classList.remove('nav__toggle--open');
  }

  handleNavClick(e: Event): void {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const targetId = target.getAttribute('href');
    const targetSection = targetId ? document.querySelector<HTMLElement>(targetId) : null;

    if (targetSection) {
      utils.smoothScrollTo(targetSection);
      this.updateActiveLink(target);
      this.closeMobileMenu();
    }
  }

  updateActiveLink(activeLink: HTMLElement): void {
    this.navLinks.forEach((link: HTMLElement) => link.classList.remove('nav__link--active'));
    activeLink.classList.add('nav__link--active');
  }

  handleScroll(): void {
    // Header shadow on scroll
    if (window.scrollY > 50) {
      this.header?.classList.add('header--scrolled');
    } else {
      this.header?.classList.remove('header--scrolled');
    }

    // Update active link based on scroll position
    this.updateActiveNavOnScroll();
  }

  updateActiveNavOnScroll(): void {
    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach((section: HTMLElement) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop - CONFIG.scrollOffset && scrollY < sectionTop + sectionHeight) {
        const correspondingLink = document.querySelector<HTMLElement>(`.nav__link[href="#${sectionId}"]`);
        if (correspondingLink) {
          this.updateActiveLink(correspondingLink);
        }
      }
    });
  }
}

// ===================================
// ANIMACIONES DE ENTRADA
// ===================================
export class AnimationManager {
  private observedElements: Set<Element>;
  private observer!: IntersectionObserver;

  constructor() {
    this.observedElements = new Set();
    this.init();
  }

  init(): void {
    this.createObserver();
    this.observeElements();
  }

  createObserver(): void {
    const options: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target as HTMLElement);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  observeElements(): void {
    const elementsToAnimate = document.querySelectorAll<HTMLElement>(`
      .skills__category,
      .timeline__item,
      .contact__link,
      .about__photo,
      .about__info
    `);

    elementsToAnimate.forEach((element: HTMLElement) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      this.observer.observe(element);
    });
  }

  animateElement(element: HTMLElement): void {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }
}

// ===================================
// FORMULARIO DE CONTACTO
// ===================================
type NotificationType = 'success' | 'error';

interface FormDataObject {
  [key: string]: FormDataEntryValue;
}

export class ContactForm {
  private form: HTMLFormElement | null;

  constructor() {
    this.form = document.getElementById('contactForm') as HTMLFormElement | null;
    this.init();
  }

  init(): void {
    if (this.form) {
      this.bindEvents();
    }
  }

  bindEvents(): void {
    if (!this.form) return;

    this.form.addEventListener('submit', (e: Event) => this.handleSubmit(e));

    // Validación en tiempo real
    const inputs = this.form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
    inputs.forEach((input: HTMLInputElement | HTMLTextAreaElement) => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    if (!this.validateForm() || !this.form) {
      return;
    }

    const formData = this.getFormData();
    const submitButton = this.form.querySelector<HTMLButtonElement>('.form__button');

    try {
      if (submitButton) this.setSubmitting(true, submitButton);

      // Aquí iría la lógica para enviar el formulario
      // Por ahora, simulamos el envío
      await this.simulateFormSubmission(formData);

      this.showSuccess();
      this.resetForm();
    } catch (error) {
      this.showError('Hubo un error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      if (submitButton) this.setSubmitting(false, submitButton);
    }
  }

  validateForm(): boolean {
    if (!this.form) return false;

    const inputs = this.form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach((input: HTMLInputElement | HTMLTextAreaElement) => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field: HTMLInputElement | HTMLTextAreaElement): boolean {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Limpiar errores previos
    this.clearFieldError(field);

    // Validaciones específicas
    switch (fieldName) {
      case 'name':
        if (value.length < 2) {
          errorMessage = 'El nombre debe tener al menos 2 caracteres';
          isValid = false;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMessage = 'Ingresa un email válido';
          isValid = false;
        }
        break;
      case 'message':
        if (value.length < 10) {
          errorMessage = 'El mensaje debe tener al menos 10 caracteres';
          isValid = false;
        }
        break;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field: HTMLInputElement | HTMLTextAreaElement, message: string): void {
    field.classList.add('form__input--error');

    const parentNode = field.parentNode as HTMLElement;
    let errorElement = parentNode.querySelector<HTMLSpanElement>('.form__error');
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'form__error';
      parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  clearFieldError(field: HTMLInputElement | HTMLTextAreaElement): void {
    field.classList.remove('form__input--error');
    const parentNode = field.parentNode as HTMLElement;
    const errorElement = parentNode.querySelector('.form__error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  getFormData(): FormDataObject {
    if (!this.form) return {};
    const formData = new FormData(this.form);
    return Object.fromEntries(formData.entries());
  }

  setSubmitting(isSubmitting: boolean, button: HTMLButtonElement): void {
    if (isSubmitting) {
      button.disabled = true;
      button.textContent = 'Enviando...';
    } else {
      button.disabled = false;
      button.textContent = 'Enviar Mensaje';
    }
  }

  async simulateFormSubmission(data: FormDataObject): Promise<void> {
    // Simular delay de envío
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Datos del formulario:', data);
        resolve();
      }, 1500);
    });
  }

  showSuccess(): void {
    this.showNotification('¡Mensaje enviado exitosamente!', 'success');
  }

  showError(message: string): void {
    this.showNotification(message, 'error');
  }

  showNotification(message: string, type: NotificationType): void {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Mostrar con animación
    setTimeout(() => notification.classList.add('notification--show'), 100);

    // Ocultar después de 3 segundos
    setTimeout(() => {
      notification.classList.remove('notification--show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  resetForm(): void {
    this.form?.reset();
  }
}

// ===================================
// INICIALIZACIÓN
// ===================================
export function initializePortfolio() {
  // Inicializar componentes
  new Navigation();
  new AnimationManager();
  new ContactForm();

  console.log('Portfolio inicializado correctamente');
}

// Auto-initialize on DOMContentLoaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializePortfolio);
}

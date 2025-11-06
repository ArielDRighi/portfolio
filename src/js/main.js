/**
 * MAIN.JS - Funcionalidades principales del portfolio
 * Maneja navegación, formularios y utilidades generales
 */

// ===================================
// CONFIGURACIÓN Y CONSTANTES
// ===================================
export const CONFIG = {
  animationDuration: 300,
  scrollOffset: 80,
  debounceDelay: 250,
};

// ===================================
// UTILIDADES
// ===================================
export const utils = {
  // Debounce function para optimizar eventos
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Smooth scroll a una sección
  smoothScrollTo(element, offset = CONFIG.scrollOffset) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  },

  // Verificar si un elemento está visible en el viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Formatear fecha actual
  getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },
};

// ===================================
// NAVEGACIÓN
// ===================================
export class Navigation {
  constructor() {
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.querySelector('.nav__menu');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.header = document.querySelector('.header');

    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    // Toggle menú móvil
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Navegación suave
    this.navLinks.forEach((link) => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });

    // Scroll para header sticky
    window.addEventListener(
      'scroll',
      utils.debounce(() => this.handleScroll(), 100)
    );

    // Cerrar menú móvil al redimensionar
    window.addEventListener('resize', () => this.closeMobileMenu());
  }

  toggleMobileMenu() {
    this.navMenu.classList.toggle('nav__menu--open');
    this.navToggle.classList.toggle('nav__toggle--open');
  }

  closeMobileMenu() {
    this.navMenu.classList.remove('nav__menu--open');
    this.navToggle.classList.remove('nav__toggle--open');
  }

  handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      utils.smoothScrollTo(targetElement);
      this.closeMobileMenu();

      // Actualizar enlace activo
      this.updateActiveLink(e.target);
    }
  }

  updateActiveLink(activeLink) {
    this.navLinks.forEach((link) => link.classList.remove('nav__link--active'));
    activeLink.classList.add('nav__link--active');
  }

  handleScroll() {
    const scrollY = window.scrollY;

    // Efecto header sticky
    if (scrollY > 100) {
      this.header.classList.add('header--scrolled');
    } else {
      this.header.classList.remove('header--scrolled');
    }

    // Actualizar navegación activa basada en scroll
    this.updateActiveSection();
  }

  updateActiveSection() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + CONFIG.scrollOffset + 50;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const correspondingLink = document.querySelector(`[href="#${sectionId}"]`);
        if (correspondingLink) {
          this.navLinks.forEach((link) => link.classList.remove('nav__link--active'));
          correspondingLink.classList.add('nav__link--active');
        }
      }
    });
  }
}

// ===================================
// ANIMACIONES DE ENTRADA
// ===================================
export class AnimationManager {
  constructor() {
    this.observedElements = new Set();
    this.init();
  }

  init() {
    this.createObserver();
    this.observeElements();
  }

  createObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  observeElements() {
    const elementsToAnimate = document.querySelectorAll(`
      .skills__category,
      .timeline__item,
      .contact__link,
      .about__photo,
      .about__info
    `);

    elementsToAnimate.forEach((element) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      this.observer.observe(element);
    });
  }

  animateElement(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }
}

// ===================================
// FORMULARIO DE CONTACTO
// ===================================
export class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }

  init() {
    if (this.form) {
      this.bindEvents();
    }
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Validación en tiempo real
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach((input) => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const formData = this.getFormData();
    const submitButton = this.form.querySelector('.form__button');

    try {
      this.setSubmitting(true, submitButton);

      // Aquí iría la lógica para enviar el formulario
      // Por ahora, simulamos el envío
      await this.simulateFormSubmission(formData);

      this.showSuccess();
      this.resetForm();
    } catch (error) {
      this.showError('Hubo un error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      this.setSubmitting(false, submitButton);
    }
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
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

  showFieldError(field, message) {
    field.classList.add('form__input--error');

    let errorElement = field.parentNode.querySelector('.form__error');
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'form__error';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  clearFieldError(field) {
    field.classList.remove('form__input--error');
    const errorElement = field.parentNode.querySelector('.form__error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  getFormData() {
    const formData = new FormData(this.form);
    return Object.fromEntries(formData.entries());
  }

  setSubmitting(isSubmitting, button) {
    if (isSubmitting) {
      button.disabled = true;
      button.textContent = 'Enviando...';
    } else {
      button.disabled = false;
      button.textContent = 'Enviar Mensaje';
    }
  }

  async simulateFormSubmission(data) {
    // Simular delay de envío
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Datos del formulario:', data);
        resolve();
      }, 1500);
    });
  }

  showSuccess() {
    this.showNotification('¡Mensaje enviado exitosamente!', 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
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

  resetForm() {
    this.form.reset();
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

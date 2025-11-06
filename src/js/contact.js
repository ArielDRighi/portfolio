class ContactManager {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.submitBtn = document.getElementById('submitBtn');
    this.notification = document.getElementById('formNotification');
    this.charCounter = document.querySelector('.form__char-count');
    this.messageTextarea = document.getElementById('message');

    this.validators = {
      name: this.validateName.bind(this),
      email: this.validateEmail.bind(this),
      subject: this.validateSubject.bind(this),
      message: this.validateMessage.bind(this),
    };

    this.init();
  }

  init() {
    if (!this.form) return;

    this.setupEventListeners();
    this.animateStats();
    this.setupCharCounter();
  }

  setupEventListeners() {
    // Form submission
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    // Real-time validation
    Object.keys(this.validators).forEach((field) => {
      const input = document.getElementById(field);
      if (input) {
        input.addEventListener('blur', () => this.validateField(field));
        input.addEventListener('input', () => this.clearError(field));
      }
    });

    // Submit button loading state
    this.form.addEventListener('submit', this.setLoadingState.bind(this));
  }

  setupCharCounter() {
    if (this.messageTextarea && this.charCounter) {
      this.messageTextarea.addEventListener('input', () => {
        const length = this.messageTextarea.value.length;
        const maxLength = this.messageTextarea.getAttribute('maxlength') || 1000;
        this.charCounter.textContent = `${length}/${maxLength}`;

        // Visual feedback for approaching limit
        if (length > maxLength * 0.9) {
          this.charCounter.style.color = 'var(--color-warning)';
        } else {
          this.charCounter.style.color = 'var(--color-text-light)';
        }
      });
    }
  }

  validateField(fieldName) {
    const validator = this.validators[fieldName];
    if (validator) {
      const isValid = validator();
      const input = document.getElementById(fieldName);

      if (isValid) {
        this.markFieldValid(input);
      } else {
        this.markFieldInvalid(input);
      }

      return isValid;
    }
    return true;
  }

  validateName() {
    const nameInput = document.getElementById('name');
    const value = nameInput.value.trim();

    if (!value) {
      this.showError('nameError', 'El nombre es requerido');
      return false;
    }

    if (value.length < 2) {
      this.showError('nameError', 'El nombre debe tener al menos 2 caracteres');
      return false;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
      this.showError('nameError', 'El nombre solo debe contener letras');
      return false;
    }

    this.clearError('nameError');
    return true;
  }

  validateEmail() {
    const emailInput = document.getElementById('email');
    const value = emailInput.value.trim();

    if (!value) {
      this.showError('emailError', 'El email es requerido');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      this.showError('emailError', 'Formato de email inválido');
      return false;
    }

    this.clearError('emailError');
    return true;
  }

  validateSubject() {
    const subjectSelect = document.getElementById('subject');
    const value = subjectSelect.value;

    if (!value) {
      this.showError('subjectError', 'Selecciona el tipo de proyecto');
      return false;
    }

    this.clearError('subjectError');
    return true;
  }

  validateMessage() {
    const messageTextarea = document.getElementById('message');
    const value = messageTextarea.value.trim();

    if (!value) {
      this.showError('messageError', 'El mensaje es requerido');
      return false;
    }

    if (value.length < 20) {
      this.showError('messageError', 'El mensaje debe tener al menos 20 caracteres');
      return false;
    }

    if (value.length > 1000) {
      this.showError('messageError', 'El mensaje no puede exceder 1000 caracteres');
      return false;
    }

    this.clearError('messageError');
    return true;
  }

  validateForm() {
    let isValid = true;

    Object.keys(this.validators).forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  clearError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  markFieldValid(input) {
    input.classList.remove('form__input--error');
    input.classList.add('form__input--success');
  }

  markFieldInvalid(input) {
    input.classList.remove('form__input--success');
    input.classList.add('form__input--error');
  }

  setLoadingState(isLoading = true) {
    if (isLoading) {
      this.submitBtn.classList.add('form__button--loading');
      this.submitBtn.disabled = true;
    } else {
      this.submitBtn.classList.remove('form__button--loading');
      this.submitBtn.disabled = false;
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      this.showNotification('Por favor, corrige los errores en el formulario', 'error');
      return;
    }

    this.setLoadingState(true);

    try {
      // Simulate form submission
      await this.simulateFormSubmission();

      this.showNotification('¡Mensaje enviado correctamente! Te responderé pronto.', 'success');
      this.resetForm();
    } catch (error) {
      this.showNotification('Error al enviar el mensaje. Inténtalo nuevamente.', 'error');
    } finally {
      this.setLoadingState(false);
    }
  }

  async simulateFormSubmission() {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  showNotification(message, type = 'info') {
    if (!this.notification) return;

    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

    this.notification.querySelector('.notification__icon').textContent = icon;
    this.notification.querySelector('.notification__message').textContent = message;

    this.notification.className = `form__notification notification--${type} notification--visible`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.notification.classList.remove('notification--visible');
    }, 5000);
  }

  resetForm() {
    this.form.reset();

    // Clear all validation states
    const inputs = this.form.querySelectorAll('.form__input, .form__select, .form__textarea');
    inputs.forEach((input) => {
      input.classList.remove('form__input--success', 'form__input--error');
    });

    // Clear all error messages
    Object.keys(this.validators).forEach((field) => {
      this.clearError(field + 'Error');
    });

    // Reset character counter
    if (this.charCounter) {
      this.charCounter.textContent = '0/1000';
      this.charCounter.style.color = 'var(--color-text-light)';
    }
  }

  animateStats() {
    const stats = document.querySelectorAll('.contact__stat-number');

    const animateNumber = (element, target) => {
      const duration = 2000;
      const start = 0;
      const startTime = performance.now();

      const updateNumber = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          element.textContent = target;
        }
      };

      requestAnimationFrame(updateNumber);
    };

    // Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            animateNumber(entry.target, target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    stats.forEach((stat) => observer.observe(stat));
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ContactManager();
});

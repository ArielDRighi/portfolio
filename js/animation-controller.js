/**
 * ANIMATION CONTROLLER
 * Sistema de control de animaciones con Intersection Observer
 */

class AnimationController {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  init() {
    this.setupScrollReveal();
    this.setupTypingAnimation();
    this.setupProgressBars();
    this.setupStaggeredAnimations();
    this.setupParallax();
  }

  /**
   * Configurar animaciones de revelado en scroll
   */
  setupScrollReveal() {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, observerOptions);

    // Observar elementos con clases de scroll reveal
    const revealElements = document.querySelectorAll(
      [".scroll-reveal", ".scroll-reveal-left", ".scroll-reveal-right", ".scroll-reveal-scale"].join(", ")
    );

    revealElements.forEach((el) => observer.observe(el));
    this.observers.set("scrollReveal", observer);
  }

  /**
   * Configurar animaciones de escritura automática
   */
  setupTypingAnimation() {
    const typewriterElements = document.querySelectorAll(".typewriter");

    typewriterElements.forEach((element) => {
      const text = element.textContent;
      element.textContent = "";
      element.style.width = "0";

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.startTyping(element, text);
              observer.unobserve(element);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(element);
    });
  }

  /**
   * Ejecutar animación de escritura
   */
  startTyping(element, text) {
    let i = 0;
    element.style.width = "auto";
    element.textContent = "";

    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        // Remover el cursor parpadeante después de completar
        setTimeout(() => {
          element.style.borderRight = "none";
        }, 1000);
      }
    }, 100);
  }

  /**
   * Configurar animaciones de barras de progreso
   */
  setupProgressBars() {
    const progressBars = document.querySelectorAll(".progress-bar");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const percentage = bar.getAttribute("data-percentage") || "0";

            setTimeout(() => {
              bar.style.width = percentage + "%";
            }, 300);

            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.5 }
    );

    progressBars.forEach((bar) => observer.observe(bar));
  }

  /**
   * Configurar animaciones escalonadas
   */
  setupStaggeredAnimations() {
    const staggerGroups = document.querySelectorAll("[data-stagger]");

    staggerGroups.forEach((group) => {
      const children = group.children;
      const delay = parseInt(group.getAttribute("data-stagger-delay")) || 200;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                  child.classList.add("animate-fade-in-up");
                }, index * delay);
              });
              observer.unobserve(group);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(group);
    });
  }

  /**
   * Configurar efecto parallax simple
   */
  setupParallax() {
    const parallaxElements = document.querySelectorAll(".parallax");

    if (parallaxElements.length === 0) return;

    const updateParallax = () => {
      const scrollY = window.pageYOffset;

      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.getAttribute("data-speed")) || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    // Throttle scroll events
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /**
   * Animar contador numérico
   */
  animateCounter(element, targetValue, duration = 2000) {
    const startValue = 0;
    const increment = targetValue / (duration / 16);
    let currentValue = startValue;

    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(timer);
      }
      element.textContent = Math.floor(currentValue).toLocaleString();
    }, 16);
  }

  /**
   * Configurar contadores animados
   */
  setupCounters() {
    const counters = document.querySelectorAll("[data-count]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const targetValue = parseInt(counter.getAttribute("data-count"));
            const duration = parseInt(counter.getAttribute("data-duration")) || 2000;

            this.animateCounter(counter, targetValue, duration);
            observer.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  /**
   * Agregar animación de entrada a un elemento
   */
  addEntranceAnimation(element, animationType = "fadeInUp", delay = 0) {
    element.style.opacity = "0";

    setTimeout(() => {
      element.classList.add(`animate-${animationType}`);
    }, delay);
  }

  /**
   * Animar elemento con efecto de rebote
   */
  bounceElement(element) {
    element.classList.add("animate-bounce");

    setTimeout(() => {
      element.classList.remove("animate-bounce");
    }, 1000);
  }

  /**
   * Animar carga de imagen con fade-in
   */
  animateImageLoad(img) {
    img.style.opacity = "0";
    img.style.transition = "opacity 300ms ease-out";

    img.onload = () => {
      img.style.opacity = "1";
    };
  }

  /**
   * Configurar animaciones de navegación móvil
   */
  setupMobileNavAnimation() {
    const navToggle = document.querySelector(".nav__toggle");
    const navMenu = document.querySelector(".nav__menu");

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener("click", () => {
      const isActive = navMenu.classList.contains("active");

      if (isActive) {
        navMenu.classList.remove("active");
      } else {
        navMenu.classList.add("active");

        // Animar elementos del menú secuencialmente
        const menuItems = navMenu.querySelectorAll(".nav__item");
        menuItems.forEach((item, index) => {
          item.style.opacity = "0";
          item.style.transform = "translateX(-20px)";

          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateX(0)";
            item.style.transition = "all 300ms ease-out";
          }, index * 100);
        });
      }
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
      }
    });
  }

  /**
   * Limpiar observadores
   */
  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }

  /**
   * Verificar soporte para motion
   */
  static supportsMotion() {
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /**
   * Inicializar solo si el motion está soportado
   */
  static init() {
    if (AnimationController.supportsMotion()) {
      return new AnimationController();
    }
    return null;
  }
}

// Exportar para uso modular
export default AnimationController;

// Auto-inicializar cuando el DOM esté listo
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    window.animationController = AnimationController.init();
  });
}

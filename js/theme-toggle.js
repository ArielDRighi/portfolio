/**
 * THEME-TOGGLE.JS - Sistema de cambio de tema claro/oscuro
 * Maneja la persistencia y aplicación de temas
 */

// ===================================
// CONFIGURACIÓN DE TEMAS
// ===================================
const THEME_CONFIG = {
  storageKey: "portfolio-theme",
  themes: {
    light: "light",
    dark: "dark",
  },
  icons: {
    light: "☀️",
    dark: "🌙",
  },
  transitions: {
    duration: "0.3s",
    easing: "ease-in-out",
  },
};

// ===================================
// CLASE THEME MANAGER
// ===================================
class ThemeManager {
  constructor() {
    this.toggleButton = document.getElementById("themeToggle");
    this.body = document.body;
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();

    this.init();
  }

  init() {
    this.setupThemeTransitions();
    this.applyTheme(this.currentTheme, false);
    this.bindEvents();
    this.updateToggleButton();
  }

  setupThemeTransitions() {
    // Añadir transiciones suaves a elementos que cambian con el tema
    const elementsToTransition = [
      "body",
      ".header",
      ".nav__link",
      ".section",
      ".skills__category",
      ".timeline__content",
      ".contact__link",
      ".form__input",
      ".form__textarea",
      ".project-icon",
    ];

    const transitionProperties = ["background-color", "color", "border-color", "box-shadow"].join(
      ` ${THEME_CONFIG.transitions.duration} ${THEME_CONFIG.transitions.easing}, `
    );

    const transitionRule = `${transitionProperties} ${THEME_CONFIG.transitions.duration} ${THEME_CONFIG.transitions.easing}`;

    // Crear y añadir estilo de transiciones
    if (!document.getElementById("theme-transitions")) {
      const style = document.createElement("style");
      style.id = "theme-transitions";
      style.textContent = `
        ${elementsToTransition.join(", ")} {
          transition: ${transitionRule};
        }
      `;
      document.head.appendChild(style);
    }
  }

  bindEvents() {
    if (this.toggleButton) {
      this.toggleButton.addEventListener("click", () => this.toggleTheme());
    }

    // Escuchar cambios en las preferencias del sistema
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", (e) => this.handleSystemThemeChange(e));
    }

    // Atajos de teclado
    document.addEventListener("keydown", (e) => this.handleKeyboardShortcuts(e));
  }

  toggleTheme() {
    const newTheme =
      this.currentTheme === THEME_CONFIG.themes.light ? THEME_CONFIG.themes.dark : THEME_CONFIG.themes.light;

    this.applyTheme(newTheme, true);
  }

  applyTheme(theme, animate = true) {
    // Remover tema anterior
    this.body.classList.remove("light-theme", "dark-theme");

    // Aplicar nuevo tema
    this.body.classList.add(`${theme}-theme`);

    // Actualizar tema actual
    this.currentTheme = theme;

    // Guardar en localStorage
    this.storeTheme(theme);

    // Actualizar botón
    this.updateToggleButton();

    // Actualizar meta theme-color para navegadores móviles
    this.updateMetaThemeColor(theme);

    // Animación del toggle si está habilitada
    if (animate && this.toggleButton) {
      this.animateToggleButton();
    }

    // Disparar evento personalizado
    this.dispatchThemeChangeEvent(theme);
  }

  updateToggleButton() {
    if (!this.toggleButton) return;

    const icon = this.toggleButton.querySelector(".theme-toggle__icon");
    if (icon) {
      icon.textContent =
        this.currentTheme === THEME_CONFIG.themes.dark ? THEME_CONFIG.icons.light : THEME_CONFIG.icons.dark;
    }

    // Actualizar aria-label para accesibilidad
    const label = this.currentTheme === THEME_CONFIG.themes.dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro";
    this.toggleButton.setAttribute("aria-label", label);
  }

  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.name = "theme-color";
      document.head.appendChild(metaThemeColor);
    }

    const themeColors = {
      [THEME_CONFIG.themes.light]: "#FFFFFF",
      [THEME_CONFIG.themes.dark]: "#1A1A1A",
    };

    metaThemeColor.content = themeColors[theme];
  }

  animateToggleButton() {
    this.toggleButton.style.transform = "scale(0.9)";

    setTimeout(() => {
      this.toggleButton.style.transform = "scale(1)";
    }, 150);
  }

  getStoredTheme() {
    try {
      return localStorage.getItem(THEME_CONFIG.storageKey);
    } catch (error) {
      console.warn("No se pudo acceder a localStorage para el tema");
      return null;
    }
  }

  storeTheme(theme) {
    try {
      localStorage.setItem(THEME_CONFIG.storageKey, theme);
    } catch (error) {
      console.warn("No se pudo guardar el tema en localStorage");
    }
  }

  getSystemTheme() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return THEME_CONFIG.themes.dark;
    }
    return THEME_CONFIG.themes.light;
  }

  handleSystemThemeChange(mediaQuery) {
    // Solo cambiar si no hay preferencia guardada por el usuario
    if (!this.getStoredTheme()) {
      const newTheme = mediaQuery.matches ? THEME_CONFIG.themes.dark : THEME_CONFIG.themes.light;
      this.applyTheme(newTheme, true);
    }
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + Shift + T para cambiar tema
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "t") {
      e.preventDefault();
      this.toggleTheme();
    }
  }

  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent("themechange", {
      detail: { theme },
    });
    document.dispatchEvent(event);
  }

  // Métodos públicos para uso externo
  getCurrentTheme() {
    return this.currentTheme;
  }

  setTheme(theme) {
    if (Object.values(THEME_CONFIG.themes).includes(theme)) {
      this.applyTheme(theme, true);
    } else {
      console.warn(`Tema no válido: ${theme}`);
    }
  }

  resetToSystemTheme() {
    // Remover preferencia guardada y usar tema del sistema
    try {
      localStorage.removeItem(THEME_CONFIG.storageKey);
    } catch (error) {
      console.warn("No se pudo remover la preferencia de tema");
    }

    const systemTheme = this.getSystemTheme();
    this.applyTheme(systemTheme, true);
  }
}

// ===================================
// UTILIDADES DE TEMA
// ===================================
const ThemeUtils = {
  // Obtener valor de variable CSS del tema actual
  getCSSVariable(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  },

  // Verificar si está en tema oscuro
  isDarkTheme() {
    return document.body.classList.contains("dark-theme");
  },

  // Obtener colores del tema actual
  getCurrentThemeColors() {
    return {
      primary: this.getCSSVariable("--color-primary"),
      secondary: this.getCSSVariable("--color-secondary"),
      accent: this.getCSSVariable("--color-accent"),
      background: this.getCSSVariable("--color-background"),
      text: this.getCSSVariable("--color-text"),
    };
  },

  // Aplicar tema a canvas o elementos que no heredan CSS
  applyThemeToCanvas(canvas, context) {
    const colors = this.getCurrentThemeColors();
    const isDark = this.isDarkTheme();

    return {
      background: colors.background,
      text: colors.text,
      primary: colors.primary,
      isDark: isDark,
    };
  },
};

// ===================================
// INICIALIZACIÓN
// ===================================
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar theme manager
  window.themeManager = new ThemeManager();

  // Escuchar eventos de cambio de tema
  document.addEventListener("themechange", (e) => {
    console.log(`Tema cambiado a: ${e.detail.theme}`);

    // Aquí se pueden añadir acciones adicionales cuando cambie el tema
    // Por ejemplo, actualizar gráficos, mapas, etc.
  });
});

// ===================================
// EXPORTAR PARA USO EXTERNO
// ===================================
window.ThemeManager = ThemeManager;
window.ThemeUtils = ThemeUtils;
window.THEME_CONFIG = THEME_CONFIG;

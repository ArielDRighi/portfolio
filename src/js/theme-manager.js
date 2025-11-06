/**
 * Theme Toggle System
 * Maneja el cambio entre tema claro y oscuro con persistencia
 */
export class ThemeManager {
  constructor() {
    this.themes = {
      light: {
        name: "light",
        label: "Claro",
        icon: "fas fa-sun",
      },
      dark: {
        name: "dark",
        label: "Oscuro",
        icon: "fas fa-moon",
      },
    };

    this.currentTheme = this.loadSavedTheme();
    this.init();
  }

  /**
   * Inicializa el sistema de temas
   */
  init() {
    this.createThemeButton();
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
    console.log("✅ Theme Manager initialized:", this.currentTheme);
  }

  /**
   * Configura el botón de toggle de tema existente
   */
  createThemeButton() {
    // Buscar el botón existente en el HTML
    const existingButton = document.getElementById("themeToggle");
    if (existingButton) {
      // Usar el botón existente y actualizar su contenido
      this.updateButtonContent(existingButton);
      return;
    }

    // Solo crear uno nuevo si no existe (fallback)
    const themeButton = document.createElement("button");
    themeButton.id = "themeToggle";
    themeButton.className = "theme-toggle";
    themeButton.setAttribute("aria-label", "Cambiar tema");
    themeButton.setAttribute("title", "Cambiar tema");

    this.updateButtonContent(themeButton);

    // Agregar al header o crear container si no existe
    const header = document.querySelector("header") || document.querySelector(".header");
    if (header) {
      header.appendChild(themeButton);
    } else {
      // Crear container fijo si no hay header
      const themeContainer = document.createElement("div");
      themeContainer.className = "theme-container";
      themeContainer.appendChild(themeButton);
      document.body.appendChild(themeContainer);
    }
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    const themeButton = document.getElementById("themeToggle") || document.getElementById("theme-toggle");
    if (themeButton) {
      themeButton.addEventListener("click", () => this.toggleTheme());
    }

    // Escuchar cambios del sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => {
      if (!this.hasUserPreference()) {
        this.applyTheme(e.matches ? "dark" : "light");
      }
    });

    // Shortcut keyboard
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "T") {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  /**
   * Cambia entre temas
   */
  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);

    // Notificar cambio
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { theme: newTheme, previousTheme: this.currentTheme },
      })
    );

    this.currentTheme = newTheme;
    console.log("🎨 Theme changed to:", newTheme);
  }

  /**
   * Aplica un tema específico
   */
  applyTheme(themeName) {
    const root = document.documentElement;

    // Remover tema anterior
    root.classList.remove("light-theme", "dark-theme");

    // Aplicar nuevo tema
    root.classList.add(`${themeName}-theme`);
    root.setAttribute("data-theme", themeName);

    // Actualizar botón
    const themeButton = document.getElementById("themeToggle") || document.getElementById("theme-toggle");
    if (themeButton) {
      this.updateButtonContent(themeButton);
    }

    // Actualizar meta theme-color para móviles
    this.updateMetaThemeColor(themeName);
  }

  /**
   * Actualiza el contenido del botón (solo icono)
   */
  updateButtonContent(button) {
    const icon = button.querySelector(".theme-toggle__icon");

    if (icon) {
      // Actualizar solo el icono del botón existente
      if (this.currentTheme === "light") {
        icon.textContent = "🌙"; // Mostrar luna en tema claro (para cambiar a oscuro)
      } else {
        icon.textContent = "☀️"; // Mostrar sol en tema oscuro (para cambiar a claro)
      }
    } else {
      // Fallback para botón creado dinámicamente
      const nextTheme = this.currentTheme === "light" ? "dark" : "light";
      const iconEmoji = nextTheme === "dark" ? "🌙" : "☀️";

      button.innerHTML = `<span class="theme-toggle__icon">${iconEmoji}</span>`;
    }

    const nextThemeName = this.currentTheme === "light" ? "oscuro" : "claro";
    button.setAttribute("title", `Cambiar a tema ${nextThemeName}`);
    button.setAttribute("aria-label", `Cambiar a tema ${nextThemeName}`);
  }

  /**
   * Actualiza el color del tema para móviles
   */
  updateMetaThemeColor(themeName) {
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (!themeColorMeta) {
      themeColorMeta = document.createElement("meta");
      themeColorMeta.name = "theme-color";
      document.head.appendChild(themeColorMeta);
    }

    const colors = {
      light: "#ffffff",
      dark: "#1a1a1a",
    };

    themeColorMeta.content = colors[themeName] || colors.light;
  }

  /**
   * Carga el tema guardado
   */
  loadSavedTheme() {
    try {
      const saved = localStorage.getItem("theme-preference");
      if (saved && this.themes[saved]) {
        return saved;
      }
    } catch (error) {
      console.warn("Error loading saved theme:", error);
    }

    // Fallback al tema del sistema
    return this.getSystemTheme();
  }

  /**
   * Guarda el tema actual
   */
  saveTheme(themeName) {
    try {
      localStorage.setItem("theme-preference", themeName);
    } catch (error) {
      console.warn("Error saving theme:", error);
    }
  }

  /**
   * Obtiene el tema preferido del sistema
   */
  getSystemTheme() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  /**
   * Verifica si el usuario tiene una preferencia guardada
   */
  hasUserPreference() {
    return localStorage.getItem("theme-preference") !== null;
  }

  /**
   * Obtiene el tema actual
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Establece un tema específico
   */
  setTheme(themeName) {
    if (this.themes[themeName]) {
      this.applyTheme(themeName);
      this.saveTheme(themeName);
      this.currentTheme = themeName;
    }
  }

  /**
   * Obtiene las variables CSS del tema actual
   */
  getThemeVariables() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    return {
      primary: computedStyle.getPropertyValue("--color-primary").trim(),
      secondary: computedStyle.getPropertyValue("--color-secondary").trim(),
      background: computedStyle.getPropertyValue("--color-background").trim(),
      text: computedStyle.getPropertyValue("--color-text").trim(),
      accent: computedStyle.getPropertyValue("--color-accent").trim(),
    };
  }

  /**
   * Verifica si el tema oscuro está activo
   */
  isDarkTheme() {
    return this.currentTheme === "dark";
  }

  /**
   * Destructor
   */
  destroy() {
    const themeButton = document.getElementById("themeToggle") || document.getElementById("theme-toggle");
    if (themeButton) {
      themeButton.remove();
    }

    const themeContainer = document.querySelector(".theme-container");
    if (themeContainer) {
      themeContainer.remove();
    }
  }
}

// Inicializar automáticamente cuando el DOM esté listo
export function initializeThemeManager() {
  return new ThemeManager();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    window.themeManager = initializeThemeManager();
  });
}

// Legacy support
if (typeof module !== "undefined" && module.exports) {
  module.exports = ThemeManager;
}

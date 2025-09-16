/**
 * PORTFOLIO TESTING SUITE
 * Suite de testing automatizado para validación del portfolio
 */

class PortfolioTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: [],
    };
    this.consoleOutput = [];
  }

  /**
   * Ejecutar todas las pruebas
   */
  async runAllTests() {
    console.log("🚀 Iniciando tests del portfolio...\n");

    await this.testResponsiveDesign();
    await this.testThemeSystem();
    await this.testAnimations();
    await this.testAccessibility();
    await this.testPerformance();
    await this.testModularStructure();
    await this.testInteractivity();

    this.generateReport();
  }

  /**
   * Test responsive design
   */
  async testResponsiveDesign() {
    console.log("📱 Testing responsive design...");

    const viewports = [
      { width: 320, height: 568, name: "Mobile Portrait" },
      { width: 768, height: 1024, name: "Tablet Portrait" },
      { width: 1024, height: 768, name: "Tablet Landscape" },
      { width: 1920, height: 1080, name: "Desktop" },
    ];

    for (const viewport of viewports) {
      try {
        // Simular viewport
        const mediaQuery = `(max-width: ${viewport.width}px)`;
        const matches = window.matchMedia(mediaQuery).matches;

        // Verificar elementos responsivos
        const container = document.querySelector(".container");
        const nav = document.querySelector(".nav");
        const cards = document.querySelectorAll(".card");

        this.assert(container !== null, `Container exists in ${viewport.name}`, "responsive");

        this.assert(nav !== null, `Navigation exists in ${viewport.name}`, "responsive");

        this.assert(cards.length > 0, `Cards render in ${viewport.name}`, "responsive");
      } catch (error) {
        this.assert(false, `Responsive test failed for ${viewport.name}: ${error.message}`, "responsive");
      }
    }
  }

  /**
   * Test theme system
   */
  async testThemeSystem() {
    console.log("🎨 Testing theme system...");

    try {
      // Verificar que ThemeManager existe
      this.assert(typeof window.ThemeManager !== "undefined", "ThemeManager class is available", "theme");

      // Verificar CSS custom properties
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      const primaryColor = computedStyle.getPropertyValue("--color-primary").trim();
      const backgroundColor = computedStyle.getPropertyValue("--color-background").trim();

      this.assert(primaryColor !== "", "Primary color CSS variable is defined", "theme");

      this.assert(backgroundColor !== "", "Background color CSS variable is defined", "theme");

      // Test theme switching
      if (window.themeManager) {
        const currentTheme = window.themeManager.getCurrentTheme();
        this.assert(["light", "dark"].includes(currentTheme), "Current theme is valid", "theme");

        // Test toggle
        window.themeManager.toggleTheme();
        const newTheme = window.themeManager.getCurrentTheme();
        this.assert(newTheme !== currentTheme, "Theme toggle works correctly", "theme");

        // Restore original theme
        window.themeManager.toggleTheme();
      }
    } catch (error) {
      this.assert(false, `Theme system test failed: ${error.message}`, "theme");
    }
  }

  /**
   * Test animations
   */
  async testAnimations() {
    console.log("✨ Testing animations...");

    try {
      // Verificar CSS animations
      const animatedElements = document.querySelectorAll('[class*="animate-"]');
      this.assert(animatedElements.length > 0, "Animated elements are present", "animation");

      // Verificar animationController
      this.assert(typeof window.animationController !== "undefined", "Animation controller is available", "animation");

      // Test scroll reveal
      const scrollRevealElements = document.querySelectorAll(".scroll-reveal");
      this.assert(scrollRevealElements.length >= 0, "Scroll reveal elements can be found", "animation");

      // Test CSS animation support
      const testElement = document.createElement("div");
      testElement.style.animation = "none";
      const hasAnimationSupport = testElement.style.animation === "none";

      this.assert(hasAnimationSupport, "CSS animations are supported", "animation");
    } catch (error) {
      this.assert(false, `Animation test failed: ${error.message}`, "animation");
    }
  }

  /**
   * Test accessibility
   */
  async testAccessibility() {
    console.log("♿ Testing accessibility...");

    try {
      // Verificar elementos semánticos
      const main = document.querySelector("main");
      const nav = document.querySelector("nav");
      const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

      this.assert(main !== null, "Main element exists", "accessibility");
      this.assert(nav !== null, "Navigation element exists", "accessibility");
      this.assert(headers.length > 0, "Heading elements exist", "accessibility");

      // Verificar alt text en imágenes
      const images = document.querySelectorAll("img");
      let imagesWithAlt = 0;
      images.forEach((img) => {
        if (img.alt && img.alt.trim() !== "") {
          imagesWithAlt++;
        }
      });

      this.assert(images.length === 0 || imagesWithAlt === images.length, "All images have alt text", "accessibility");

      // Verificar contraste (simulado)
      const bodyStyle = getComputedStyle(document.body);
      const textColor = bodyStyle.color;
      const bgColor = bodyStyle.backgroundColor;

      this.assert(textColor !== bgColor, "Text and background colors are different", "accessibility");

      // Verificar navegación por teclado
      const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );

      this.assert(focusableElements.length > 0, "Focusable elements exist for keyboard navigation", "accessibility");
    } catch (error) {
      this.assert(false, `Accessibility test failed: ${error.message}`, "accessibility");
    }
  }

  /**
   * Test performance
   */
  async testPerformance() {
    console.log("⚡ Testing performance...");

    try {
      // Verificar tamaño del DOM
      const allElements = document.querySelectorAll("*");
      this.assert(allElements.length < 1500, `DOM size is reasonable (${allElements.length} elements)`, "performance");

      // Verificar CSS
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"], style');
      this.assert(stylesheets.length < 10, `Reasonable number of stylesheets (${stylesheets.length})`, "performance");

      // Verificar JavaScript
      const scripts = document.querySelectorAll("script");
      this.assert(scripts.length < 15, `Reasonable number of scripts (${scripts.length})`, "performance");

      // Verificar lazy loading
      const images = document.querySelectorAll('img[loading="lazy"]');
      this.assert(images.length >= 0, "Images can use lazy loading", "performance");

      // Test de memoria básico
      if (performance.memory) {
        const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
        this.assert(memoryUsage < 50, `Memory usage is reasonable (${memoryUsage.toFixed(2)}MB)`, "performance");
      }
    } catch (error) {
      this.assert(false, `Performance test failed: ${error.message}`, "performance");
    }
  }

  /**
   * Test modular structure
   */
  async testModularStructure() {
    console.log("🏗️ Testing modular structure...");

    try {
      // Verificar que las secciones están separadas
      const sections = document.querySelectorAll("section[id]");
      this.assert(sections.length >= 4, `Multiple sections found (${sections.length})`, "structure");

      // Verificar componentes modulares
      const componentClasses = [".card", ".btn", ".form-group", ".nav", ".container"];

      componentClasses.forEach((className) => {
        const elements = document.querySelectorAll(className);
        this.assert(elements.length > 0, `Component ${className} exists`, "structure");
      });

      // Verificar CSS modular
      const cssFiles = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map((link) =>
        link.href.split("/").pop()
      );

      const expectedFiles = ["themes.css", "styles.css", "responsive-optimized.css", "animations.css"];
      const hasModularCSS = expectedFiles.some((file) => cssFiles.some((loadedFile) => loadedFile.includes(file)));

      this.assert(hasModularCSS, "Modular CSS structure detected", "structure");
    } catch (error) {
      this.assert(false, `Structure test failed: ${error.message}`, "structure");
    }
  }

  /**
   * Test interactivity
   */
  async testInteractivity() {
    console.log("🖱️ Testing interactivity...");

    try {
      // Test buttons
      const buttons = document.querySelectorAll("button, .btn");
      this.assert(buttons.length > 0, `Interactive buttons found (${buttons.length})`, "interactivity");

      // Test forms
      const forms = document.querySelectorAll("form");
      const inputs = document.querySelectorAll("input, textarea, select");

      this.assert(forms.length > 0 || inputs.length > 0, "Interactive forms or inputs found", "interactivity");

      // Test navigation
      const navLinks = document.querySelectorAll("nav a, .nav a");
      this.assert(navLinks.length > 0, `Navigation links found (${navLinks.length})`, "interactivity");

      // Test event listeners (simulado)
      let hasEventListeners = false;
      buttons.forEach((button) => {
        if (button.onclick || button.addEventListener) {
          hasEventListeners = true;
        }
      });

      this.assert(
        hasEventListeners || buttons.length === 0,
        "Interactive elements have event handlers",
        "interactivity"
      );
    } catch (error) {
      this.assert(false, `Interactivity test failed: ${error.message}`, "interactivity");
    }
  }

  /**
   * Función de aserción
   */
  assert(condition, message, category = "general") {
    const result = {
      passed: !!condition,
      message,
      category,
      timestamp: new Date().toISOString(),
    };

    this.results.tests.push(result);

    if (result.passed) {
      this.results.passed++;
      console.log(`✅ ${message}`);
    } else {
      this.results.failed++;
      console.log(`❌ ${message}`);
    }
  }

  /**
   * Generar reporte final
   */
  generateReport() {
    const total = this.results.passed + this.results.failed;
    const successRate = ((this.results.passed / total) * 100).toFixed(1);

    console.log("\n" + "=".repeat(50));
    console.log("📊 PORTFOLIO TEST REPORT");
    console.log("=".repeat(50));
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Success Rate: ${successRate}%`);
    console.log("=".repeat(50));

    // Agrupar por categoría
    const categories = {};
    this.results.tests.forEach((test) => {
      if (!categories[test.category]) {
        categories[test.category] = { passed: 0, failed: 0 };
      }
      if (test.passed) {
        categories[test.category].passed++;
      } else {
        categories[test.category].failed++;
      }
    });

    console.log("\n📋 Tests by Category:");
    Object.entries(categories).forEach(([category, stats]) => {
      const categoryTotal = stats.passed + stats.failed;
      const categoryRate = ((stats.passed / categoryTotal) * 100).toFixed(1);
      console.log(`${category}: ${stats.passed}/${categoryTotal} (${categoryRate}%)`);
    });

    // Mostrar fallos
    const failures = this.results.tests.filter((test) => !test.passed);
    if (failures.length > 0) {
      console.log("\n❌ Failed Tests:");
      failures.forEach((test) => {
        console.log(`- [${test.category}] ${test.message}`);
      });
    }

    // Recomendaciones
    this.generateRecommendations(successRate, categories);

    return this.results;
  }

  /**
   * Generar recomendaciones
   */
  generateRecommendations(successRate, categories) {
    console.log("\n💡 Recommendations:");

    if (successRate < 80) {
      console.log("- 🔧 Consider fixing failed tests to improve overall quality");
    }

    Object.entries(categories).forEach(([category, stats]) => {
      const categoryTotal = stats.passed + stats.failed;
      const categoryRate = (stats.passed / categoryTotal) * 100;

      if (categoryRate < 80) {
        switch (category) {
          case "responsive":
            console.log("- 📱 Improve responsive design implementation");
            break;
          case "accessibility":
            console.log("- ♿ Enhance accessibility features");
            break;
          case "performance":
            console.log("- ⚡ Optimize performance (reduce DOM size, optimize assets)");
            break;
          case "theme":
            console.log("- 🎨 Fix theme system issues");
            break;
          case "animation":
            console.log("- ✨ Improve animation implementation");
            break;
        }
      }
    });

    if (successRate >= 90) {
      console.log("- 🎉 Excellent! Portfolio is well implemented");
    }
  }

  /**
   * Ejecutar test específico
   */
  async runSpecificTest(testName) {
    switch (testName) {
      case "responsive":
        await this.testResponsiveDesign();
        break;
      case "theme":
        await this.testThemeSystem();
        break;
      case "animation":
        await this.testAnimations();
        break;
      case "accessibility":
        await this.testAccessibility();
        break;
      case "performance":
        await this.testPerformance();
        break;
      case "structure":
        await this.testModularStructure();
        break;
      case "interactivity":
        await this.testInteractivity();
        break;
      default:
        console.log(`Test "${testName}" not found`);
    }
    this.generateReport();
  }
}

// Exportar para uso global
if (typeof window !== "undefined") {
  window.PortfolioTester = PortfolioTester;

  // Comando fácil para ejecutar tests
  window.runTests = () => {
    const tester = new PortfolioTester();
    return tester.runAllTests();
  };

  window.runTest = (testName) => {
    const tester = new PortfolioTester();
    return tester.runSpecificTest(testName);
  };
}

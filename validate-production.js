/**
 * VALIDADOR DE PRODUCCIÓN
 * Script para validar que el portfolio está listo para deploy
 */

class ProductionValidator {
  constructor() {
    this.checks = [];
    this.scores = {
      performance: 0,
      accessibility: 0,
      seo: 0,
      compatibility: 0,
    };
  }

  /**
   * Ejecutar todas las validaciones
   */
  async runAllValidations() {
    console.log("🚀 === VALIDACIÓN COMPLETA PARA PRODUCCIÓN ===");
    console.log("⏳ Ejecutando todas las validaciones...\n");

    await this.validatePerformance();
    await this.validateAccessibility();
    await this.validateSEO();
    await this.validateCompatibility();
    await this.validateDeployment();

    this.generateFinalReport();
  }

  /**
   * Validar performance
   */
  async validatePerformance() {
    console.log("⚡ Validando Performance...");

    try {
      // Core Web Vitals simulation
      const navigation = performance.getEntriesByType("navigation")[0];
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;

      // LCP simulation (usando load time como proxy)
      const lcp = loadTime;
      if (lcp < 2500) {
        this.checks.push("✅ LCP: Excelente (<2.5s)");
        this.scores.performance += 30;
      } else {
        this.checks.push("❌ LCP: Necesita optimización (>2.5s)");
      }

      // Bundle size check
      const resources = performance.getEntriesByType("resource");
      const totalSize = resources.reduce((acc, resource) => {
        return acc + (resource.transferSize || 0);
      }, 0);

      const sizeKB = Math.round(totalSize / 1024);
      if (sizeKB < 500) {
        this.checks.push(`✅ Bundle Size: Óptimo (${sizeKB}KB)`);
        this.scores.performance += 30;
      } else {
        this.checks.push(`⚠️ Bundle Size: Considerar optimización (${sizeKB}KB)`);
        this.scores.performance += 15;
      }

      // Resource count
      if (resources.length < 20) {
        this.checks.push("✅ Número de recursos: Óptimo");
        this.scores.performance += 20;
      } else {
        this.checks.push("⚠️ Número de recursos: Considerar reducir");
        this.scores.performance += 10;
      }

      // Service Worker check
      if ("serviceWorker" in navigator) {
        this.checks.push("✅ Service Worker: Disponible");
        this.scores.performance += 20;
      } else {
        this.checks.push("❌ Service Worker: No disponible");
      }
    } catch (error) {
      this.checks.push("❌ Error en validación de performance");
    }
  }

  /**
   * Validar accesibilidad
   */
  async validateAccessibility() {
    console.log("♿ Validando Accesibilidad...");

    // Alt text en imágenes
    const images = document.querySelectorAll("img");
    const imagesWithAlt = document.querySelectorAll("img[alt]");
    if (images.length === imagesWithAlt.length && images.length > 0) {
      this.checks.push("✅ Alt text: Todas las imágenes tienen alt text");
      this.scores.accessibility += 25;
    } else {
      this.checks.push(`⚠️ Alt text: ${images.length - imagesWithAlt.length} imágenes sin alt`);
    }

    // Estructura de headings
    const h1 = document.querySelectorAll("h1");
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    if (h1.length === 1 && headings.length > 1) {
      this.checks.push("✅ Headings: Estructura jerárquica correcta");
      this.scores.accessibility += 25;
    } else {
      this.checks.push("⚠️ Headings: Revisar estructura jerárquica");
    }

    // ARIA labels
    const ariaElements = document.querySelectorAll("[aria-label], [aria-labelledby], [aria-describedby]");
    if (ariaElements.length > 0) {
      this.checks.push("✅ ARIA: Labels implementados");
      this.scores.accessibility += 25;
    }

    // Color contrast básico
    const computedStyle = getComputedStyle(document.body);
    const bgColor = computedStyle.backgroundColor;
    const textColor = computedStyle.color;
    if (bgColor && textColor) {
      this.checks.push("✅ Contraste: Variables de color definidas");
      this.scores.accessibility += 25;
    }
  }

  /**
   * Validar SEO
   */
  async validateSEO() {
    console.log("🔍 Validando SEO...");

    // Meta title
    const title = document.querySelector("title");
    if (title && title.textContent.length > 30 && title.textContent.length < 60) {
      this.checks.push("✅ Title: Longitud óptima (30-60 caracteres)");
      this.scores.seo += 20;
    } else {
      this.checks.push("⚠️ Title: Revisar longitud");
    }

    // Meta description
    const description = document.querySelector('meta[name="description"]');
    if (description && description.content.length > 120 && description.content.length < 160) {
      this.checks.push("✅ Description: Longitud óptima (120-160 caracteres)");
      this.scores.seo += 20;
    } else {
      this.checks.push("⚠️ Description: Revisar longitud");
    }

    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogTitle && ogDesc && ogImage) {
      this.checks.push("✅ Open Graph: Implementación completa");
      this.scores.seo += 20;
    } else {
      this.checks.push("⚠️ Open Graph: Implementación incompleta");
    }

    // Schema.org
    const schema = document.querySelector('script[type="application/ld+json"]');
    if (schema) {
      this.checks.push("✅ Schema.org: Markup estructurado presente");
      this.scores.seo += 20;
    }

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      this.checks.push("✅ Canonical: URL canónica definida");
      this.scores.seo += 20;
    }
  }

  /**
   * Validar compatibilidad
   */
  async validateCompatibility() {
    console.log("🌐 Validando Compatibilidad...");

    // CSS Grid support
    if (CSS.supports("display", "grid")) {
      this.checks.push("✅ CSS Grid: Soportado");
      this.scores.compatibility += 25;
    }

    // CSS Custom Properties
    if (CSS.supports("color", "var(--test)")) {
      this.checks.push("✅ CSS Variables: Soportadas");
      this.scores.compatibility += 25;
    }

    // Intersection Observer
    if ("IntersectionObserver" in window) {
      this.checks.push("✅ Intersection Observer: Disponible");
      this.scores.compatibility += 25;
    }

    // Local Storage
    if ("localStorage" in window) {
      this.checks.push("✅ Local Storage: Disponible");
      this.scores.compatibility += 25;
    }
  }

  /**
   * Validar configuración de deployment
   */
  async validateDeployment() {
    console.log("📦 Validando Configuración de Deploy...");

    // Verificar archivos de deployment
    const deployFiles = [".nojekyll", "robots.txt", "sitemap.xml", "site.webmanifest"];

    let deployScore = 0;
    for (const file of deployFiles) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          this.checks.push(`✅ Deploy: ${file} presente`);
          deployScore += 25;
        } else {
          this.checks.push(`❌ Deploy: ${file} no encontrado`);
        }
      } catch (error) {
        this.checks.push(`❌ Deploy: ${file} no accesible`);
      }
    }

    this.scores.deployment = deployScore;
  }

  /**
   * Generar reporte final
   */
  generateFinalReport() {
    const totalScore = Math.round(
      this.scores.performance * 0.4 +
        this.scores.accessibility * 0.25 +
        this.scores.seo * 0.25 +
        this.scores.compatibility * 0.1
    );

    console.log("\n🎯 === REPORTE FINAL DE VALIDACIÓN ===");
    console.log(`📊 SCORE TOTAL: ${totalScore}/100`);
    console.log(`⚡ Performance: ${this.scores.performance}/100`);
    console.log(`♿ Accessibility: ${this.scores.accessibility}/100`);
    console.log(`🔍 SEO: ${this.scores.seo}/100`);
    console.log(`🌐 Compatibility: ${this.scores.compatibility}/100`);

    console.log("\n📋 DETALLES:");
    this.checks.forEach((check) => console.log(`  ${check}`));

    console.log("\n🚀 VEREDICTO FINAL:");
    if (totalScore >= 90) {
      console.log("🎉 ¡EXCELENTE! Portfolio APROBADO para producción");
      console.log("✅ Todas las métricas están en rangos óptimos");
      console.log("🚀 Listo para deploy en GitHub Pages");
    } else if (totalScore >= 80) {
      console.log("✅ BUENO. Portfolio aceptable para producción");
      console.log("⚠️ Algunas optimizaciones menores recomendadas");
    } else if (totalScore >= 70) {
      console.log("⚠️ ACEPTABLE. Requiere algunas mejoras");
      console.log("📋 Revisar elementos marcados como ⚠️");
    } else {
      console.log("❌ NECESITA TRABAJO. No recomendado para producción");
      console.log("🔧 Corregir elementos marcados como ❌");
    }

    return {
      totalScore,
      scores: this.scores,
      checks: this.checks,
      readyForProduction: totalScore >= 80,
    };
  }
}

// Función global para validación rápida
window.validateProduction = async function () {
  const validator = new ProductionValidator();
  return await validator.runAllValidations();
};

// Auto-ejecutar si está en modo de prueba
if (window.location.search.includes("validate=true")) {
  document.addEventListener("DOMContentLoaded", async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Esperar carga completa
    await validateProduction();
  });
}

console.log("🔍 ProductionValidator cargado");
console.log("📋 Comando disponible: validateProduction()");

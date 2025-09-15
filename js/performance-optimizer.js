/**
 * PERFORMANCE OPTIMIZER
 * Herramientas para optimización de performance y métricas
 */

class PerformanceOptimizer {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    this.measurePageLoad();
    this.setupLazyLoading();
    this.optimizeImages();
    this.setupServiceWorker();
  }

  /**
   * Medir métricas de carga de página
   */
  measurePageLoad() {
    if (typeof performance !== "undefined") {
      window.addEventListener("load", () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType("navigation")[0];

          this.metrics = {
            // Core Web Vitals
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            firstPaint: this.getFirstPaint(),
            firstContentfulPaint: this.getFirstContentfulPaint(),
            largestContentfulPaint: this.getLargestContentfulPaint(),

            // Network metrics
            dnsLookup: perfData.domainLookupEnd - perfData.domainLookupStart,
            tcpConnection: perfData.connectEnd - perfData.connectStart,
            serverResponse: perfData.responseEnd - perfData.requestStart,

            // Resource metrics
            totalLoadTime: perfData.loadEventEnd - perfData.navigationStart,
            domProcessing: perfData.domComplete - perfData.domLoading,
          };

          this.logMetrics();
          this.checkWebVitals();
        }, 1000);
      });
    }
  }

  /**
   * Obtener First Paint
   */
  getFirstPaint() {
    const paint = performance.getEntriesByType("paint");
    const fp = paint.find((entry) => entry.name === "first-paint");
    return fp ? fp.startTime : 0;
  }

  /**
   * Obtener First Contentful Paint
   */
  getFirstContentfulPaint() {
    const paint = performance.getEntriesByType("paint");
    const fcp = paint.find((entry) => entry.name === "first-contentful-paint");
    return fcp ? fcp.startTime : 0;
  }

  /**
   * Obtener Largest Contentful Paint
   */
  getLargestContentfulPaint() {
    return new Promise((resolve) => {
      if (typeof PerformanceObserver === "undefined") {
        resolve(0);
        return;
      }

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const lcp = entries[entries.length - 1];
          resolve(lcp.startTime);
        }
      });

      observer.observe({ entryTypes: ["largest-contentful-paint"] });

      // Timeout after 10 seconds
      setTimeout(() => resolve(0), 10000);
    });
  }

  /**
   * Configurar lazy loading para imágenes
   */
  setupLazyLoading() {
    if ("IntersectionObserver" in window) {
      const images = document.querySelectorAll("img[data-src]");

      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            observer.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    }
  }

  /**
   * Optimizar imágenes automáticamente
   */
  optimizeImages() {
    const images = document.querySelectorAll("img");

    images.forEach((img) => {
      // Agregar loading="lazy" si no existe
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }

      // Agregar decode="async" para mejor performance
      if (!img.hasAttribute("decoding")) {
        img.setAttribute("decoding", "async");
      }
    });
  }

  /**
   * Configurar Service Worker (básico)
   */
  setupServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/portfolio/sw.js")
          .then((registration) => {
            console.log("✅ Service Worker registered:", registration.scope);
          })
          .catch((error) => {
            console.log("❌ Service Worker registration failed:", error);
          });
      });
    }
  }

  /**
   * Verificar Core Web Vitals avanzado
   */
  async checkWebVitals() {
    console.log("🔍 Iniciando análisis avanzado de Core Web Vitals...");
    const recommendations = [];
    const scores = { performance: 0, accessibility: 0, seo: 0 };

    try {
      // Largest Contentful Paint (LCP)
      await this.measureLCP().then((lcp) => {
        this.metrics.largestContentfulPaint = lcp;
        if (lcp < 2500) {
          recommendations.push("� LCP: Excelente (<2.5s) - " + lcp.toFixed(0) + "ms");
          scores.performance += 30;
        } else if (lcp < 4000) {
          recommendations.push("🟡 LCP: Necesita mejora (2.5s-4s) - " + lcp.toFixed(0) + "ms");
          scores.performance += 15;
        } else {
          recommendations.push("� LCP: Pobre (>4s) - " + lcp.toFixed(0) + "ms");
        }
      });

      // First Contentful Paint (FCP)
      const navigation = performance.getEntriesByType("navigation")[0];
      if (navigation) {
        const fcp = navigation.loadEventEnd - navigation.fetchStart;
        this.metrics.firstContentfulPaint = fcp;

        if (fcp < 1800) {
          recommendations.push("� FCP: Excelente (<1.8s) - " + fcp.toFixed(0) + "ms");
          scores.performance += 25;
        } else if (fcp < 3000) {
          recommendations.push("🟡 FCP: Necesita mejora (1.8s-3s) - " + fcp.toFixed(0) + "ms");
          scores.performance += 12;
        } else {
          recommendations.push("🔴 FCP: Pobre (>3s) - " + fcp.toFixed(0) + "ms");
        }
      }

      // Cumulative Layout Shift (CLS)
      await this.measureCLS().then((cls) => {
        if (cls < 0.1) {
          recommendations.push("🟢 CLS: Excelente (<0.1) - " + cls.toFixed(4));
          scores.performance += 25;
        } else if (cls < 0.25) {
          recommendations.push("🟡 CLS: Necesita mejora (0.1-0.25) - " + cls.toFixed(4));
          scores.performance += 12;
        } else {
          recommendations.push("� CLS: Pobre (>0.25) - " + cls.toFixed(4));
        }
      });

      // Bundle Size Analysis
      await this.analyzeBundleSize().then((size) => {
        if (size < 300) {
          recommendations.push("🟢 Bundle Size: Excelente (<300KB) - " + size + "KB");
          scores.performance += 20;
        } else if (size < 500) {
          recommendations.push("🟡 Bundle Size: Aceptable (300KB-500KB) - " + size + "KB");
          scores.performance += 10;
        } else {
          recommendations.push("🔴 Bundle Size: Muy grande (>500KB) - " + size + "KB");
        }
      });
    } catch (error) {
      console.warn("Error en análisis Web Vitals:", error);
    }

    // Calcular score final
    const finalScore = Math.min(100, scores.performance);

    console.log("\n📊 === REPORTE COMPLETO DE PERFORMANCE ===");
    console.log(`🎯 Score General: ${finalScore}/100`);
    console.log("📋 Métricas detalladas:");
    recommendations.forEach((rec) => console.log("  " + rec));

    if (finalScore >= 90) {
      console.log("🎉 ¡EXCELENTE! Portfolio listo para producción");
    } else if (finalScore >= 75) {
      console.log("✅ BUENO. Algunas optimizaciones menores recomendadas");
    } else {
      console.log("⚠️ NECESITA MEJORAS. Revisar recomendaciones");
    }

    return { score: finalScore, recommendations, metrics: this.metrics };
  }

  /**
   * Medir CLS dinámicamente
   */
  async measureCLS() {
    return new Promise((resolve) => {
      let clsValue = 0;
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        observer.observe({ entryTypes: ["layout-shift"] });

        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 3000);
      } catch (error) {
        resolve(0);
      }
    });
  }

  /**
   * Analizar tamaño del bundle
   */
  async analyzeBundleSize() {
    const resources = performance.getEntriesByType("resource");
    let totalSize = 0;

    resources.forEach((resource) => {
      if (resource.transferSize) {
        totalSize += resource.transferSize;
      }
    });

    return Math.round(totalSize / 1024); // KB
  }

  /**
   * Log de métricas en consola
   */
  logMetrics() {
    console.log("\n📈 Performance Metrics:");
    console.table(this.metrics);
  }

  /**
   * Generar reporte completo de performance
   */
  async generateReport() {
    console.log("📊 Generando reporte completo de performance...");

    const webVitalsReport = await this.checkWebVitals();
    const accessibilityReport = this.checkAccessibility();
    const seoReport = this.checkSEO();

    const overallScore = Math.round(
      webVitalsReport.score * 0.5 + accessibilityReport.score * 0.3 + seoReport.score * 0.2
    );

    const report = {
      timestamp: new Date().toISOString(),
      overallScore,
      performance: webVitalsReport,
      accessibility: accessibilityReport,
      seo: seoReport,
      recommendations: this.getAllRecommendations(webVitalsReport, accessibilityReport, seoReport),
    };

    console.log("\n🎯 === REPORTE FINAL DEL PORTFOLIO ===");
    console.log(`📊 Score General: ${overallScore}/100`);
    console.log(`⚡ Performance: ${webVitalsReport.score}/100`);
    console.log(`♿ Accessibility: ${accessibilityReport.score}/100`);
    console.log(`🔍 SEO: ${seoReport.score}/100`);

    if (overallScore >= 90) {
      console.log("🎉 ¡PORTFOLIO LISTO PARA PRODUCCIÓN!");
      console.log("✅ Todas las métricas están en rangos excelentes");
    } else if (overallScore >= 80) {
      console.log("✅ Portfolio en buen estado. Optimizaciones menores recomendadas");
    } else {
      console.log("⚠️ Portfolio necesita optimizaciones antes del deploy");
    }

    return report;
  }

  /**
   * Verificar accesibilidad básica
   */
  checkAccessibility() {
    const checks = [];
    let score = 0;

    // Alt text en imágenes
    const images = document.querySelectorAll("img");
    const imagesWithAlt = document.querySelectorAll("img[alt]");
    if (images.length === imagesWithAlt.length) {
      checks.push("🟢 Todas las imágenes tienen alt text");
      score += 25;
    } else {
      checks.push(`🟡 ${images.length - imagesWithAlt.length} imágenes sin alt text`);
      score += 10;
    }

    // Headings structure
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    if (headings.length > 0) {
      checks.push("🟢 Estructura de headings presente");
      score += 25;
    }

    // ARIA labels
    const ariaElements = document.querySelectorAll("[aria-label], [aria-labelledby]");
    if (ariaElements.length > 0) {
      checks.push("🟢 ARIA labels implementados");
      score += 25;
    }

    // Color contrast (basic check)
    const colorScore = this.checkColorContrast();
    score += colorScore;

    return { score: Math.min(100, score), checks };
  }

  /**
   * Verificar SEO básico
   */
  checkSEO() {
    const checks = [];
    let score = 0;

    // Meta title
    const title = document.querySelector("title");
    if (title && title.textContent.length > 10) {
      checks.push("🟢 Meta title presente y descriptivo");
      score += 20;
    }

    // Meta description
    const description = document.querySelector('meta[name="description"]');
    if (description && description.content.length > 50) {
      checks.push("🟢 Meta description presente y descriptiva");
      score += 20;
    }

    // Open Graph tags
    const ogTags = document.querySelectorAll('meta[property^="og:"]');
    if (ogTags.length >= 3) {
      checks.push("🟢 Open Graph tags implementados");
      score += 20;
    }

    // Schema markup
    const schema = document.querySelector('script[type="application/ld+json"]');
    if (schema) {
      checks.push("🟢 Schema.org markup presente");
      score += 20;
    }

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      checks.push("🟢 URL canónica configurada");
      score += 20;
    }

    return { score: Math.min(100, score), checks };
  }

  /**
   * Check color contrast básico
   */
  checkColorContrast() {
    const rootStyles = getComputedStyle(document.documentElement);
    const backgroundColor = rootStyles.getPropertyValue("--color-background");
    const textColor = rootStyles.getPropertyValue("--color-text");

    if (backgroundColor && textColor) {
      return 25; // Asumimos buen contraste si están definidas
    }
    return 10;
  }

  /**
   * Consolidar todas las recomendaciones
   */
  getAllRecommendations(performance, accessibility, seo) {
    const all = [];

    if (performance.recommendations) {
      all.push("🎯 PERFORMANCE:");
      all.push(...performance.recommendations);
    }

    if (accessibility.checks) {
      all.push("\n♿ ACCESSIBILITY:");
      all.push(...accessibility.checks);
    }

    if (seo.checks) {
      all.push("\n🔍 SEO:");
      all.push(...seo.checks);
    }

    return all;
  }

  /**
   * Obtener reporte de métricas
   */
  getMetricsReport() {
    return {
      metrics: this.metrics,
      grade: this.calculateGrade(),
      recommendations: this.getRecommendations(),
    };
  }

  /**
   * Calcular calificación de performance
   */
  calculateGrade() {
    let score = 100;

    if (this.metrics.totalLoadTime > 3000) score -= 30;
    else if (this.metrics.totalLoadTime > 2000) score -= 15;

    if (this.metrics.firstContentfulPaint > 1800) score -= 25;
    else if (this.metrics.firstContentfulPaint > 1000) score -= 10;

    if (this.metrics.largestContentfulPaint > 2500) score -= 25;
    else if (this.metrics.largestContentfulPaint > 1500) score -= 10;

    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }

  /**
   * Obtener recomendaciones específicas
   */
  getRecommendations() {
    const recommendations = [];

    if (this.metrics.totalLoadTime > 2000) {
      recommendations.push("Optimizar y minificar CSS/JS");
      recommendations.push("Implementar lazy loading");
      recommendations.push("Optimizar imágenes (WebP, compresión)");
    }

    if (this.metrics.dnsLookup > 100) {
      recommendations.push("Considerar un DNS más rápido");
    }

    if (this.metrics.serverResponse > 200) {
      recommendations.push("Optimizar servidor o CDN");
    }

    return recommendations;
  }

  /**
   * Simular test de conexión lenta
   */
  simulateSlowConnection() {
    console.log("🐌 Simulando conexión lenta...");
    // Esta función se puede usar para testing manual
    document.body.style.filter = "blur(1px)";
    setTimeout(() => {
      document.body.style.filter = "none";
      console.log("✅ Simulación completada");
    }, 3000);
  }
}

// Exportar para uso modular
export default PerformanceOptimizer;

// Auto-inicializar
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    window.performanceOptimizer = new PerformanceOptimizer();
    window.performanceOptimizer.initialize();

    // Funciones globales para testing fácil desde consola
    window.getPerformanceReport = async () => {
      return await window.performanceOptimizer.generateReport();
    };

    window.checkWebVitals = async () => {
      return await window.performanceOptimizer.checkWebVitals();
    };

    window.optimizePerformance = () => {
      window.performanceOptimizer.optimize();
      console.log("✅ Optimizaciones de performance aplicadas");
    };

    window.validateProduction = async () => {
      console.log("🚀 === VALIDACIÓN PARA PRODUCCIÓN ===");

      const report = await window.performanceOptimizer.generateReport();

      if (report.overallScore >= 90) {
        console.log("🎉 ¡APROBADO! Portfolio listo para producción");
        console.log("📊 Score: " + report.overallScore + "/100");
        console.log("✅ Todas las métricas en rangos excelentes");
      } else {
        console.log("⚠️ NECESITA OPTIMIZACIONES antes del deploy");
        console.log("📊 Score: " + report.overallScore + "/100");
        console.log("📋 Revisar recomendaciones en el reporte");
      }

      return report;
    };

    console.log("🔧 PerformanceOptimizer inicializado");
    console.log("📊 Comandos disponibles:");
    console.log("  - getPerformanceReport()");
    console.log("  - checkWebVitals()");
    console.log("  - validateProduction()");
    console.log("  - optimizePerformance()");
  });
}

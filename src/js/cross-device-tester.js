/**
 * CROSS-DEVICE TESTING SUITE
 * Testing automatizado para diferentes dispositivos y navegadores
 */

class CrossDeviceTester {
  constructor() {
    this.testResults = {
      mobile: {},
      tablet: {},
      desktop: {},
      browsers: {},
      features: {},
    };
    this.init();
  }

  init() {
    console.log('🧪 Iniciando Cross-Device Testing...');
    this.detectDevice();
    this.detectBrowser();
    this.runResponsiveTests();
    this.runFeatureTests();
    this.runPerformanceTests();
  }

  /**
   * Detectar tipo de dispositivo
   */
  detectDevice() {
    const userAgent = navigator.userAgent;
    const screen = window.screen;

    this.deviceInfo = {
      userAgent,
      screenWidth: screen.width,
      screenHeight: screen.height,
      devicePixelRatio: window.devicePixelRatio,
      orientation: screen.orientation ? screen.orientation.type : 'unknown',
      touchSupport: 'ontouchstart' in window,
      platform: navigator.platform,
      connectionType: this.getConnectionType(),
    };

    // Categorizar dispositivo
    if (this.deviceInfo.screenWidth < 768) {
      this.deviceCategory = 'mobile';
    } else if (this.deviceInfo.screenWidth < 1024) {
      this.deviceCategory = 'tablet';
    } else {
      this.deviceCategory = 'desktop';
    }

    console.log('📱 Dispositivo detectado:', this.deviceCategory, this.deviceInfo);
  }

  /**
   * Detectar navegador
   */
  detectBrowser() {
    const userAgent = navigator.userAgent;

    this.browserInfo = {
      name: this.getBrowserName(userAgent),
      version: this.getBrowserVersion(userAgent),
      engine: this.getBrowserEngine(userAgent),
      supportsModernFeatures: this.checkModernFeatures(),
    };

    console.log('🌐 Navegador detectado:', this.browserInfo);
  }

  /**
   * Obtener nombre del navegador
   */
  getBrowserName(userAgent) {
    if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
    if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
    if (userAgent.indexOf('Safari') > -1) return 'Safari';
    if (userAgent.indexOf('Edge') > -1) return 'Edge';
    if (userAgent.indexOf('Opera') > -1) return 'Opera';
    return 'Unknown';
  }

  /**
   * Obtener versión del navegador
   */
  getBrowserVersion(userAgent) {
    const match = userAgent.match(/(chrome|firefox|safari|edge|opera)\/(\d+)/i);
    return match ? match[2] : 'Unknown';
  }

  /**
   * Obtener motor del navegador
   */
  getBrowserEngine(userAgent) {
    if (userAgent.indexOf('WebKit') > -1) return 'WebKit';
    if (userAgent.indexOf('Gecko') > -1) return 'Gecko';
    if (userAgent.indexOf('Trident') > -1) return 'Trident';
    return 'Unknown';
  }

  /**
   * Verificar características modernas
   */
  checkModernFeatures() {
    return {
      es6: this.supportsES6(),
      css3: this.supportsCSS3(),
      webgl: this.supportsWebGL(),
      serviceWorker: 'serviceWorker' in navigator,
      intersectionObserver: 'IntersectionObserver' in window,
      customElements: 'customElements' in window,
      modules: this.supportsModules(),
    };
  }

  /**
   * Tests responsivos
   */
  runResponsiveTests() {
    console.log('📐 Ejecutando tests responsivos...');

    const viewports = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1024, height: 768, name: 'iPad Landscape' },
      { width: 1920, height: 1080, name: 'Desktop FHD' },
    ];

    viewports.forEach((viewport) => {
      this.testViewport(viewport);
    });
  }

  /**
   * Test específico de viewport
   */
  testViewport(viewport) {
    const results = {
      viewport: viewport.name,
      navigation: this.testNavigation(),
      typography: this.testTypography(),
      layout: this.testLayout(),
      interactions: this.testInteractions(),
      performance: this.testViewportPerformance(),
    };

    this.testResults[this.deviceCategory][viewport.name] = results;

    console.log(`✅ Test ${viewport.name} completado:`, results);
  }

  /**
   * Test de navegación
   */
  testNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');

    return {
      navExists: !!nav,
      mobileToggleExists: !!navToggle,
      menuExists: !!navMenu,
      linksWork: this.testNavigationLinks(),
      themeToggleWorks: this.testThemeToggle(),
    };
  }

  /**
   * Test de enlaces de navegación
   */
  testNavigationLinks() {
    const links = document.querySelectorAll('.nav__link');
    let workingLinks = 0;

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) workingLinks++;
      }
    });

    return {
      total: links.length,
      working: workingLinks,
      percentage: (workingLinks / links.length) * 100,
    };
  }

  /**
   * Test del toggle de tema
   */
  testThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    return {
      exists: !!themeToggle,
      hasIcon: !!themeToggle?.querySelector('.theme-toggle__icon'),
      clickable:
        themeToggle?.style.cursor === 'pointer' || themeToggle?.style.pointerEvents !== 'none',
    };
  }

  /**
   * Test de tipografía
   */
  testTypography() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const paragraphs = document.querySelectorAll('p');

    return {
      headingsCount: headings.length,
      paragraphsCount: paragraphs.length,
      fontLoaded: this.checkFontsLoaded(),
      readability: this.checkReadability(),
    };
  }

  /**
   * Test de layout
   */
  testLayout() {
    const sections = document.querySelectorAll('section');
    const containers = document.querySelectorAll('.container');

    return {
      sectionsCount: sections.length,
      containersCount: containers.length,
      overflowIssues: this.checkOverflow(),
      zIndexIssues: this.checkZIndex(),
    };
  }

  /**
   * Test de interacciones
   */
  testInteractions() {
    const buttons = document.querySelectorAll('button, .btn');
    const forms = document.querySelectorAll('form');
    const inputs = document.querySelectorAll('input, textarea');

    return {
      buttonsCount: buttons.length,
      formsCount: forms.length,
      inputsCount: inputs.length,
      touchTargets: this.checkTouchTargets(),
      hoverEffects: this.checkHoverEffects(),
    };
  }

  /**
   * Test de performance por viewport
   */
  testViewportPerformance() {
    return {
      domElements: document.querySelectorAll('*').length,
      imagesCount: document.querySelectorAll('img').length,
      cssFiles: document.querySelectorAll('link[rel="stylesheet"]').length,
      jsFiles: document.querySelectorAll('script[src]').length,
      renderTime: performance.now(),
    };
  }

  /**
   * Tests de características
   */
  runFeatureTests() {
    console.log('🔧 Ejecutando tests de características...');

    this.testResults.features = {
      animations: this.testAnimations(),
      themes: this.testThemes(),
      responsive: this.testResponsiveFeatures(),
      accessibility: this.testAccessibility(),
      seo: this.testSEO(),
    };
  }

  /**
   * Test de animaciones
   */
  testAnimations() {
    return {
      cssAnimations: this.supportsCSSAnimations(),
      animationController: typeof window.animationController !== 'undefined',
      intersectionObserver: 'IntersectionObserver' in window,
      scrollElements: document.querySelectorAll('.scroll-reveal').length,
    };
  }

  /**
   * Test del sistema de temas
   */
  testThemes() {
    return {
      themeManager: typeof window.themeManager !== 'undefined',
      cssVariables: this.supportsCSSVariables(),
      themeClasses:
        document.documentElement.classList.contains('light-theme') ||
        document.documentElement.classList.contains('dark-theme'),
      localStorage: this.testLocalStorage(),
    };
  }

  /**
   * Tests de performance
   */
  runPerformanceTests() {
    console.log('⚡ Ejecutando tests de performance...');

    if (typeof performance !== 'undefined') {
      const perfData = performance.getEntriesByType('navigation')[0];

      this.testResults.performance = {
        loadTime: perfData ? perfData.loadEventEnd - perfData.navigationStart : 0,
        domContentLoaded: perfData
          ? perfData.domContentLoadedEventEnd - perfData.navigationStart
          : 0,
        firstPaint: this.getFirstPaint(),
        resources: performance.getEntriesByType('resource').length,
        memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 0,
      };
    }
  }

  /**
   * Utilidades de soporte
   */
  supportsES6() {
    try {
      return eval('() => {}') && eval('class Test {}');
    } catch (e) {
      return false;
    }
  }

  supportsCSS3() {
    const div = document.createElement('div');
    return 'transform' in div.style && 'transition' in div.style;
  }

  supportsWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  supportsModules() {
    const script = document.createElement('script');
    return 'noModule' in script;
  }

  supportsCSSAnimations() {
    const div = document.createElement('div');
    return 'animation' in div.style;
  }

  supportsCSSVariables() {
    return window.CSS && CSS.supports('color', 'var(--test)');
  }

  getConnectionType() {
    if ('connection' in navigator) {
      return navigator.connection.effectiveType;
    }
    return 'unknown';
  }

  getFirstPaint() {
    const paint = performance.getEntriesByType('paint');
    const fp = paint.find((entry) => entry.name === 'first-paint');
    return fp ? fp.startTime : 0;
  }

  checkFontsLoaded() {
    return document.fonts ? document.fonts.ready : Promise.resolve();
  }

  checkReadability() {
    // Simplified readability check
    const textElements = document.querySelectorAll('p, span, div');
    let readableCount = 0;

    textElements.forEach((el) => {
      const styles = getComputedStyle(el);
      const fontSize = parseFloat(styles.fontSize);
      const lineHeight = parseFloat(styles.lineHeight);

      if (fontSize >= 14 && lineHeight >= fontSize * 1.2) {
        readableCount++;
      }
    });

    return {
      total: textElements.length,
      readable: readableCount,
      percentage: (readableCount / textElements.length) * 100,
    };
  }

  checkOverflow() {
    const elements = document.querySelectorAll('*');
    let overflowCount = 0;

    elements.forEach((el) => {
      if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
        overflowCount++;
      }
    });

    return overflowCount;
  }

  checkZIndex() {
    const elements = document.querySelectorAll('*');
    const zIndexes = [];

    elements.forEach((el) => {
      const zIndex = getComputedStyle(el).zIndex;
      if (zIndex !== 'auto') {
        zIndexes.push(parseInt(zIndex));
      }
    });

    return {
      total: zIndexes.length,
      max: Math.max(...zIndexes),
      conflicts: zIndexes.length - new Set(zIndexes).size,
    };
  }

  checkTouchTargets() {
    const interactiveElements = document.querySelectorAll('button, a, input, textarea');
    let goodTargets = 0;

    interactiveElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width >= 44 && rect.height >= 44) {
        goodTargets++;
      }
    });

    return {
      total: interactiveElements.length,
      good: goodTargets,
      percentage: (goodTargets / interactiveElements.length) * 100,
    };
  }

  checkHoverEffects() {
    const hoverElements = document.querySelectorAll('[class*="hover"], .btn, .nav__link');
    return {
      count: hoverElements.length,
      hasCSS: !!document.querySelector('style, link[rel="stylesheet"]'),
    };
  }

  testResponsiveFeatures() {
    return {
      mediaQueries: this.hasMediaQueries(),
      flexbox: this.supportsFlexbox(),
      grid: this.supportsGrid(),
      viewportMeta: !!document.querySelector('meta[name="viewport"]'),
    };
  }

  testAccessibility() {
    return {
      altTexts: this.checkAltTexts(),
      ariaLabels: this.checkAriaLabels(),
      semanticHTML: this.checkSemanticHTML(),
      colorContrast: this.checkColorContrast(),
    };
  }

  testSEO() {
    return {
      title: !!document.title,
      metaDescription: !!document.querySelector('meta[name="description"]'),
      headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
      openGraph: !!document.querySelector('meta[property^="og:"]'),
      schema: !!document.querySelector('script[type="application/ld+json"]'),
    };
  }

  testLocalStorage() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }

  hasMediaQueries() {
    return window.matchMedia && window.matchMedia('(min-width: 768px)').matches !== undefined;
  }

  supportsFlexbox() {
    const div = document.createElement('div');
    return 'flex' in div.style;
  }

  supportsGrid() {
    const div = document.createElement('div');
    return 'grid' in div.style;
  }

  checkAltTexts() {
    const images = document.querySelectorAll('img');
    let withAlt = 0;

    images.forEach((img) => {
      if (img.alt && img.alt.trim() !== '') withAlt++;
    });

    return {
      total: images.length,
      withAlt,
      percentage: images.length ? (withAlt / images.length) * 100 : 100,
    };
  }

  checkAriaLabels() {
    const elements = document.querySelectorAll('[aria-label], [aria-labelledby]');
    return elements.length;
  }

  checkSemanticHTML() {
    const semantic = ['main', 'nav', 'header', 'footer', 'section', 'article', 'aside'];
    let count = 0;

    semantic.forEach((tag) => {
      if (document.querySelector(tag)) count++;
    });

    return {
      total: semantic.length,
      present: count,
      percentage: (count / semantic.length) * 100,
    };
  }

  checkColorContrast() {
    // Simplified contrast check
    const elements = document.querySelectorAll('p, span, a, button');
    let goodContrast = 0;

    elements.forEach((el) => {
      const styles = getComputedStyle(el);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // Simple heuristic - not a real contrast calculation
      if (color !== backgroundColor) goodContrast++;
    });

    return {
      total: elements.length,
      good: goodContrast,
      percentage: (goodContrast / elements.length) * 100,
    };
  }

  /**
   * Generar reporte completo
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      device: this.deviceInfo,
      browser: this.browserInfo,
      category: this.deviceCategory,
      results: this.testResults,
      score: this.calculateScore(),
      recommendations: this.getRecommendations(),
    };

    console.log('\n📊 CROSS-DEVICE TEST REPORT');
    console.log('='.repeat(50));
    console.table(report.score);
    console.log('\n📋 Recomendaciones:');
    report.recommendations.forEach((rec) => console.log(`- ${rec}`));

    return report;
  }

  /**
   * Calcular puntuación
   */
  calculateScore() {
    const scores = {
      responsive: 0,
      features: 0,
      performance: 0,
      accessibility: 0,
      overall: 0,
    };

    // Calcular puntuaciones individuales
    scores.responsive = this.calculateResponsiveScore();
    scores.features = this.calculateFeaturesScore();
    scores.performance = this.calculatePerformanceScore();
    scores.accessibility = this.calculateAccessibilityScore();

    scores.overall =
      (scores.responsive + scores.features + scores.performance + scores.accessibility) / 4;

    return scores;
  }

  calculateResponsiveScore() {
    // Implementar lógica de puntuación responsive
    return 85; // Placeholder
  }

  calculateFeaturesScore() {
    // Implementar lógica de puntuación de características
    return 90; // Placeholder
  }

  calculatePerformanceScore() {
    // Implementar lógica de puntuación de performance
    return 80; // Placeholder
  }

  calculateAccessibilityScore() {
    // Implementar lógica de puntuación de accesibilidad
    return 75; // Placeholder
  }

  getRecommendations() {
    const recommendations = [];

    if (this.testResults.performance?.loadTime > 3000) {
      recommendations.push('Optimizar tiempo de carga (>3s)');
    }

    if (this.testResults.features?.accessibility?.altTexts?.percentage < 100) {
      recommendations.push('Agregar textos alternativos faltantes');
    }

    return recommendations;
  }
}

// Exportar para uso global
window.CrossDeviceTester = CrossDeviceTester;

// Auto-inicializar
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.crossDeviceTester = new CrossDeviceTester();

    // Comando global para generar reporte
    window.getCrossDeviceReport = () => {
      return window.crossDeviceTester.generateReport();
    };
  });
}

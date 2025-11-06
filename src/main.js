/**
 * Main entry point for the portfolio application
 * This file initializes all modules and components
 */

// Import external dependencies
import feather from 'feather-icons';

// Import stylesheets (order matters!)
import './css/variables.css';
import './css/themes.css';
import './css/styles.css';
import './sections/projects/projects-simple.css';
import './sections/projects/projects-states.css';
import './css/accessibility.css';
import './css/responsive.css';

// Import JavaScript modules
import { initializeAccessibility } from './js/accessibility.ts';
import './js/theme-manager.ts'; // Auto-inicializa el theme manager

// Import other modules (will be converted to ES6 modules in future tasks)
import './js/animation-controller.js';
import './js/portfolio-tester.js';
import './js/performance-optimizer.js';
import './js/cross-device-tester.js';
import './js/experience.js';
import './js/contact.js';
import './sections/projects/projects-simple.ts';

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Feather Icons from npm package
  feather.replace();

  // Initialize Accessibility features
  initializeAccessibility();

  console.log('🚀 Portfolio initialized with Vite + ES6 Modules + npm dependencies');
});

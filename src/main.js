/**
 * Main entry point for the portfolio application
 * This file initializes all modules and components
 */

// Import stylesheets
import "./css/themes.css";
import "./css/styles.css";
import "./sections/projects/projects-simple.css";
import "./css/responsive.css";

// Import JavaScript modules
import "./js/theme-manager.js";
import "./js/animation-controller.js";
import "./js/portfolio-tester.js";
import "./js/performance-optimizer.js";
import "./js/cross-device-tester.js";
import "./js/main.js";
import "./js/experience.js";
import "./js/contact.js";
import "./sections/projects/projects-simple.js";

// Initialize Feather Icons (will be replaced with npm package later)
document.addEventListener("DOMContentLoaded", () => {
  if (typeof feather !== "undefined") {
    feather.replace();
  }
});

console.log("🚀 Portfolio initialized with Vite");

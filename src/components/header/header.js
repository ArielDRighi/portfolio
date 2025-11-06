/**
 * Módulo de navegación del header
 * Maneja la navegación, menú móvil y scroll activo
 */
class HeaderNavigation {
  constructor() {
    this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.header = document.querySelector('.header');

    this.isMenuOpen = false;
    this.currentSection = 'about';

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollDetection();
    this.setupSectionObserver();
  }

  setupEventListeners() {
    // Mobile menu toggle
    if (this.mobileMenuToggle && this.navMenu) {
      this.mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
    }

    // Navigation links
    this.navLinks.forEach((link) => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });

    // Close menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.header.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  setupScrollDetection() {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      // Add/remove scrolled class for styling
      if (scrollY > 20) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }

      lastScrollY = scrollY;
    });
  }

  setupSectionObserver() {
    const sections = document.querySelectorAll('.section[id]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            this.setActiveNavLink(sectionId);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMenuOpen = true;
    this.navMenu.classList.add('active');
    this.mobileMenuToggle.classList.add('active');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'true');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.navMenu.classList.remove('active');
    this.mobileMenuToggle.classList.remove('active');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'false');

    // Restore body scroll
    document.body.style.overflow = '';
  }

  handleNavClick(e) {
    e.preventDefault();

    const link = e.currentTarget;
    const targetSection =
      link.getAttribute('data-section') || link.getAttribute('href').substring(1);

    this.navigateToSection(targetSection);

    // Close mobile menu if open
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }

  navigateToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);

    if (targetElement) {
      const headerHeight = this.header.offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      this.setActiveNavLink(sectionId);
    }
  }

  setActiveNavLink(sectionId) {
    if (this.currentSection === sectionId) return;

    this.currentSection = sectionId;

    // Remove active class from all links
    this.navLinks.forEach((link) => {
      link.classList.remove('active');
    });

    // Add active class to current section link
    const activeLink = document.querySelector(
      `[data-section="${sectionId}"], [href="#${sectionId}"]`
    );
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  // Method to highlight specific section (useful for external calls)
  highlightSection(sectionId) {
    this.setActiveNavLink(sectionId);
  }

  // Method to get current active section
  getCurrentSection() {
    return this.currentSection;
  }
}

// Auto-initialize when section is loaded
document.addEventListener('sectionLoaded', (event) => {
  if (event.detail.section === 'header') {
    window.headerNavigation = new HeaderNavigation();
  }
});

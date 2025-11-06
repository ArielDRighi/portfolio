# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-27

### 🎉 Major Refactoring - Modern Architecture

Complete architectural modernization from vanilla HTML/CSS/JS to TypeScript + Vite with comprehensive testing.

### Added

#### Build System & Tooling

- **Vite 7.2.1** as build tool and dev server
- **TypeScript 5.9** with strict mode enabled
- **Vitest 4.0.7** for unit testing with 40 tests
- **ESLint** flat config for code quality
- **Prettier** for consistent code formatting
- **GitHub Actions** CI/CD workflows
- **Husky + lint-staged** for pre-commit hooks

#### Architecture

- Service layer pattern with `ProjectService`
- Centralized data management with caching
- ES6 module system
- TypeScript interfaces for all data types
- Component-based modular design

#### Testing Infrastructure

- 16 unit tests for utility functions
- 24 integration tests for ProjectService
- 100% coverage on service layer
- Test coverage reporting with v8
- Vitest UI for interactive testing
- Happy-dom environment for DOM testing

#### Accessibility (WCAG 2.1 AA)

- Comprehensive accessibility manager (`accessibility.ts`)
- Skip navigation links
- Keyboard navigation support
- ARIA attributes and live regions
- Focus management and indicators
- Reduced motion support
- Screen reader optimizations

#### Features

- Lazy loading for all images (25 images)
- Loading and error states for async operations
- Theme persistence with localStorage
- Professional error handling
- Debounced scroll events
- Smooth scrolling with intersection observers

#### Documentation

- Modern README with badges and quick start
- Architecture diagrams
- Testing documentation
- Deployment guides
- Contribution guidelines with conventional commits
- Code quality checks documentation

### Changed

#### Project Structure

```
Before: Flat structure with mixed concerns
After:  Organized by feature in src/ directory
- src/js/ - Core TypeScript modules
- src/services/ - Data services
- src/sections/ - UI components
- src/css/ - Styles with design tokens
- src/types/ - TypeScript interfaces
```

#### Code Quality

- Migrated all JavaScript to TypeScript
- Strict type checking enabled
- 100% type coverage on service layer
- Conventional commit messages
- Automated linting and formatting

#### Dependencies

- Replaced feather-icons CDN with npm package
- All dependencies managed through npm
- DevDependencies separated from runtime deps

### Optimized

- **Bundle size:** 164KB JS + 63KB CSS (optimized)
- **Code splitting:** Vite automatic chunking
- **Tree shaking:** Dead code elimination
- **CSS minification:** Production builds
- **Caching strategy:** Service layer caching
- **Performance:** Debounced events, lazy loading

### Removed

- Duplicate project components (kept projects-simple)
- CDN dependencies (replaced with npm)
- Inline scripts (moved to modules)
- Manual testing (replaced with automated tests)

### Fixed

- Type safety issues (now 100% typed)
- Memory leaks from event listeners
- Performance issues with scroll handlers
- Accessibility violations
- Code duplication across components

### Technical Details

#### Commits in this release

- 21 conventional commits
- 5 phases of refactoring
- 22 tasks completed
- Branch: `refactor/modern-architecture`

#### Test Coverage

```
Test Files: 2 passed (2)
Tests: 40 passed (40)
Coverage: 27.07% overall, 100% on services
```

#### Build Configuration

- TypeScript target: ES2020
- Module resolution: bundler
- Source maps: enabled in dev
- HMR: enabled with Vite

### Breaking Changes

⚠️ **For developers working on this project:**

1. **Node.js required:** Must use npm for development
2. **Build step required:** No longer static HTML
3. **TypeScript knowledge:** Helpful for contributions
4. **New scripts:** Use `npm run dev` instead of opening HTML

**For end users:** No breaking changes - portfolio looks and behaves identically!

### Migration Guide

If you're contributing or forking:

```bash
# Old way (v1.x)
# Open index.html in browser

# New way (v2.x)
npm install
npm run dev
```

See README.md for full setup instructions.

---

## [1.0.0] - 2024

### Initial Release

- Static HTML/CSS/JavaScript portfolio
- Projects and experience sections
- Theme toggle (light/dark)
- Responsive design
- Contact form
- GitHub integration

[2.0.0]: https://github.com/ArielDRighi/portfolio/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/ArielDRighi/portfolio/releases/tag/v1.0.0

# 🔧 Plan de Refactorización - Portfolio

> Documento de trabajo para migrar el portfolio a mejores prácticas y arquitectura moderna

---

## 📊 Estado Actual del Proyecto

- **Arquitectura:** HTML/CSS/JS Vanilla sin build system
- **Gestión de dependencias:** CDN (sin npm)
- **Modularización:** Parcial (múltiples archivos JS pero sin ES6 modules)
- **TypeScript:** No
- **Testing:** No
- **CI/CD:** No

---

## 🎯 Objetivo Final

Portfolio moderno con:
- ✅ Sistema de build moderno (Vite)
- ✅ TypeScript para type safety
- ✅ Componentes modulares reutilizables
- ✅ Testing automatizado
- ✅ Performance optimizado
- ✅ Código mantenible y escalable

---

## 📋 FASE 1: SETUP MODERNO Y BUILD SYSTEM

### ✅ Tarea 1.1: Inicializar npm y configurar Vite
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 30 minutos  
**Commit:** `feat: initialize npm and vite build system`

**Acciones:**
- [ ] Ejecutar `npm init -y`
- [ ] Instalar Vite: `npm install -D vite`
- [ ] Crear `vite.config.js`
- [ ] Actualizar `.gitignore` para incluir `node_modules/` y `dist/`
- [ ] Agregar scripts en `package.json`:
  ```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
  ```
- [ ] Probar que `npm run dev` funcione

**Archivos afectados:**
- `package.json` (nuevo)
- `vite.config.js` (nuevo)
- `.gitignore` (modificar)

---

### ✅ Tarea 1.2: Reorganizar estructura de carpetas
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 45 minutos  
**Commit:** `refactor: reorganize project structure for build system`

**Acciones:**
- [ ] Crear carpeta `src/`
- [ ] Mover `index.html` a raíz (Vite lo requiere)
- [ ] Crear `src/main.js` como punto de entrada
- [ ] Mover archivos a nueva estructura:
  ```
  src/
    ├── js/          (scripts actuales)
    ├── styles/      (CSS actual)
    ├── components/  (mantener)
    ├── sections/    (mantener)
    └── data/        (mantener)
  ```
- [ ] Mantener `assets/` en `public/`
- [ ] Actualizar referencias en `index.html`

**Archivos afectados:**
- Todos los archivos del proyecto (reorganización)

---

### ✅ Tarea 1.3: Migrar a ES6 Modules
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 2 horas  
**Commit:** `refactor: convert to ES6 modules`

**Acciones:**
- [ ] Convertir `js/main.js` a ES6 module
- [ ] Exportar clases y funciones:
  ```javascript
  export class Navigation { }
  export const utils = { }
  ```
- [ ] Crear `src/main.js` que importe todo:
  ```javascript
  import { Navigation } from './js/main.js';
  import { ThemeManager } from './js/theme-manager.js';
  ```
- [ ] Eliminar scripts individuales del HTML
- [ ] Agregar solo: `<script type="module" src="/src/main.js"></script>`
- [ ] Probar que todo funcione

**Archivos afectados:**
- `index.html`
- `src/main.js` (nuevo)
- `src/js/main.js`
- `src/js/theme-manager.js`
- `src/js/experience.js`
- Todos los archivos JS

---

### ✅ Tarea 1.4: Centralizar dependencias externas
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 30 minutos  
**Commit:** `feat: install feather-icons as npm dependency`

**Acciones:**
- [ ] Instalar Feather Icons: `npm install feather-icons`
- [ ] Remover CDN del HTML
- [ ] Importar en `src/main.js`:
  ```javascript
  import feather from 'feather-icons';
  feather.replace();
  ```
- [ ] Probar que los iconos se muestren correctamente

**Archivos afectados:**
- `index.html`
- `src/main.js`
- `package.json`

---

### ✅ Tarea 1.5: Configurar linting y formatting
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 45 minutos  
**Commit:** `chore: setup eslint and prettier`

**Acciones:**
- [ ] Instalar ESLint: `npm install -D eslint`
- [ ] Inicializar: `npx eslint --init`
- [ ] Instalar Prettier: `npm install -D prettier`
- [ ] Crear `.prettierrc`:
  ```json
  {
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "printWidth": 100
  }
  ```
- [ ] Agregar scripts:
  ```json
  "lint": "eslint src/**/*.js",
  "format": "prettier --write src/**/*.{js,css,html}"
  ```
- [ ] Ejecutar `npm run format` en todo el código

**Archivos afectados:**
- `.eslintrc.js` (nuevo)
- `.prettierrc` (nuevo)
- `package.json`
- Todos los archivos JS (formateo)

---

## 📋 FASE 2: TYPESCRIPT MIGRATION

### ✅ Tarea 2.1: Configurar TypeScript
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 1 hora  
**Commit:** `feat: setup typescript configuration`

**Acciones:**
- [ ] Instalar TypeScript: `npm install -D typescript`
- [ ] Instalar tipos de Node: `npm install -D @types/node`
- [ ] Crear `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "module": "ESNext",
      "lib": ["ES2020", "DOM"],
      "moduleResolution": "bundler",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "resolveJsonModule": true,
      "allowJs": true,
      "outDir": "./dist"
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
  }
  ```
- [ ] Actualizar `vite.config.js` para TS
- [ ] Probar que el build funcione

**Archivos afectados:**
- `tsconfig.json` (nuevo)
- `package.json`
- `vite.config.js`

---

### ✅ Tarea 2.2: Crear interfaces de datos
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 1 hora  
**Commit:** `feat: add typescript interfaces for data models`

**Acciones:**
- [ ] Crear `src/types/Project.ts`:
  ```typescript
  export interface Project {
    id: number;
    name: string;
    type: string;
    description: string;
    technologies: string[];
    github: string;
    demo?: string;
    status: 'completed' | 'in-progress';
    stats: ProjectStats;
    highlights?: string[];
  }
  
  export interface ProjectStats {
    stars: number;
    forks: number;
    commits: number;
  }
  ```
- [ ] Crear `src/types/Experience.ts`
- [ ] Crear `src/types/index.ts` para exportar todo

**Archivos afectados:**
- `src/types/Project.ts` (nuevo)
- `src/types/Experience.ts` (nuevo)
- `src/types/index.ts` (nuevo)

---

### ✅ Tarea 2.3: Migrar main.js a TypeScript
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 1.5 horas  
**Commit:** `refactor: migrate main.js to typescript`

**Acciones:**
- [ ] Renombrar `src/js/main.js` → `src/js/main.ts`
- [ ] Agregar tipos a todas las funciones y variables
- [ ] Usar interfaces creadas
- [ ] Ejemplo:
  ```typescript
  class Navigation {
    private navToggle: HTMLElement | null;
    private navMenu: HTMLElement | null;
    
    constructor() {
      this.navToggle = document.getElementById('navToggle');
      this.navMenu = document.querySelector('.nav__menu');
      this.init();
    }
    
    private init(): void {
      this.bindEvents();
    }
  }
  ```
- [ ] Corregir errores de tipos
- [ ] Probar funcionamiento

**Archivos afectados:**
- `src/js/main.ts` (renombrado)
- `src/main.ts`

---

### ✅ Tarea 2.4: Migrar projects-simple.js a TypeScript
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 1 hora  
**Commit:** `refactor: migrate projects module to typescript`

**Acciones:**
- [ ] Renombrar `sections/projects/projects-simple.js` → `.ts`
- [ ] Importar interface `Project`
- [ ] Tipar métodos y propiedades
- [ ] Ejemplo:
  ```typescript
  import type { Project } from '../../types';
  
  class SimpleProjectsGrid {
    private projects: Project[];
    private gridContainer: HTMLElement | null;
    
    getProjects(): Project[] {
      return [ /* ... */ ];
    }
  }
  ```
- [ ] Probar visualización de proyectos

**Archivos afectados:**
- `src/sections/projects/projects-simple.ts` (renombrado)
- `src/main.ts`

---

### ✅ Tarea 2.5: Migrar módulos restantes a TypeScript
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 2 horas  
**Commit:** `refactor: complete typescript migration`

**Acciones:**
- [ ] Migrar `theme-manager.js` → `.ts`
- [ ] Migrar `experience.js` → `.ts`
- [ ] Migrar `contact.js` → `.ts`
- [ ] Migrar archivos restantes
- [ ] Corregir todos los errores de tipos
- [ ] Ejecutar `npm run build` sin errores

**Archivos afectados:**
- Todos los archivos `.js` → `.ts`

---

## 📋 FASE 3: REFACTORIZACIÓN DE COMPONENTES

### ✅ Tarea 3.1: Eliminar archivos duplicados
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 30 minutos  
**Commit:** `refactor: remove duplicate files`

**Acciones:**
- [ ] Eliminar `projects.js` (mantener solo `projects-simple.js`)
- [ ] Eliminar `index-modular.html` (mantener solo `index.html`)
- [ ] Eliminar archivos no usados en `/js`
- [ ] Verificar que nada se rompa

**Archivos afectados:**
- `sections/projects/projects.js` (eliminar)
- `index-modular.html` (eliminar)
- Archivos no usados

---

### ✅ Tarea 3.2: Crear servicio para manejo de datos
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 1 hora  
**Commit:** `feat: create data service layer`

**Acciones:**
- [ ] Crear `src/services/ProjectService.ts`:
  ```typescript
  export class ProjectService {
    private static instance: ProjectService;
    
    static getInstance(): ProjectService {
      if (!ProjectService.instance) {
        ProjectService.instance = new ProjectService();
      }
      return ProjectService.instance;
    }
    
    async getProjects(): Promise<Project[]> {
      try {
        const response = await fetch('/data/projects.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error('Error loading projects:', error);
        return this.getFallbackProjects();
      }
    }
    
    private getFallbackProjects(): Project[] {
      // Proyectos hardcodeados como fallback
    }
  }
  ```
- [ ] Usar en `projects-simple.ts`
- [ ] Probar que cargue correctamente

**Archivos afectados:**
- `src/services/ProjectService.ts` (nuevo)
- `src/sections/projects/projects-simple.ts`

---

### ✅ Tarea 3.3: Refactorizar clase ProjectsGrid
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 1.5 horas  
**Commit:** `refactor: improve projects grid architecture`

**Acciones:**
- [ ] Separar responsabilidades:
  - Renderizado
  - Manejo de datos
  - Manejo de eventos
- [ ] Crear métodos privados claros
- [ ] Mejorar manejo de errores
- [ ] Agregar estados: loading, error, success
- [ ] Mostrar mensajes de error al usuario

**Archivos afectados:**
- `src/sections/projects/projects-simple.ts`

---

### ✅ Tarea 3.4: Optimizar carga de imágenes
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 45 minutos  
**Commit:** `perf: add lazy loading for images`

**Acciones:**
- [ ] Agregar `loading="lazy"` a todas las imágenes
- [ ] Ejemplo:
  ```html
  <img 
    src="assets/images/profile/1MB.png" 
    alt="Profile"
    loading="lazy"
  />
  ```
- [ ] Agregar placeholders mientras cargan
- [ ] Optimizar iconos de tecnologías

**Archivos afectados:**
- `index.html`
- `src/sections/projects/projects-simple.ts`

---

### ✅ Tarea 3.5: Migrar CSS a SCSS
**Prioridad:** 🟢 BAJA  
**Tiempo estimado:** 2 horas  
**Commit:** `refactor: migrate css to scss`

**Acciones:**
- [ ] Instalar Sass: `npm install -D sass`
- [ ] Crear estructura:
  ```
  src/styles/
    ├── base/
    │   ├── _reset.scss
    │   ├── _typography.scss
    │   └── _variables.scss
    ├── components/
    │   ├── _header.scss
    │   ├── _projects.scss
    │   └── _buttons.scss
    ├── layout/
    │   └── _grid.scss
    └── main.scss
  ```
- [ ] Migrar variables CSS a SCSS
- [ ] Importar en `main.scss`
- [ ] Reemplazar en HTML: `<link rel="stylesheet" href="/src/styles/main.scss">`

**Archivos afectados:**
- `src/styles/**/*.scss` (nuevos)
- `index.html`
- Archivos CSS antiguos (eliminar después)

---

## 📋 FASE 4: TESTING Y CALIDAD

### ✅ Tarea 4.1: Configurar Vitest
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 45 minutos  
**Commit:** `test: setup vitest testing framework`

**Acciones:**
- [ ] Instalar Vitest: `npm install -D vitest @vitest/ui`
- [ ] Agregar a `vite.config.ts`:
  ```typescript
  import { defineConfig } from 'vite';
  
  export default defineConfig({
    test: {
      globals: true,
      environment: 'jsdom'
    }
  });
  ```
- [ ] Instalar jsdom: `npm install -D jsdom`
- [ ] Agregar script: `"test": "vitest"`

**Archivos afectados:**
- `vite.config.ts`
- `package.json`

---

### ✅ Tarea 4.2: Escribir tests para utils
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 1 hora  
**Commit:** `test: add unit tests for utility functions`

**Acciones:**
- [ ] Crear `src/js/__tests__/utils.test.ts`
- [ ] Testear funciones de `utils`:
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { utils } from '../main';
  
  describe('Utils', () => {
    describe('debounce', () => {
      it('should delay function execution', async () => {
        // test implementation
      });
    });
  });
  ```
- [ ] Ejecutar: `npm run test`

**Archivos afectados:**
- `src/js/__tests__/utils.test.ts` (nuevo)

---

### ✅ Tarea 4.3: Tests para ProjectService
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 1 hora  
**Commit:** `test: add tests for project service`

**Acciones:**
- [ ] Crear `src/services/__tests__/ProjectService.test.ts`
- [ ] Mockear fetch
- [ ] Testear casos:
  - Carga exitosa
  - Error de red
  - Fallback
- [ ] Cobertura > 80%

**Archivos afectados:**
- `src/services/__tests__/ProjectService.test.ts` (nuevo)

---

### ✅ Tarea 4.4: Mejorar accesibilidad (A11y)
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 1.5 horas  
**Commit:** `a11y: improve accessibility standards`

**Acciones:**
- [ ] Agregar roles ARIA apropiados
- [ ] Mejorar navegación por teclado
- [ ] Ejemplo:
  ```html
  <nav role="navigation" aria-label="Main navigation">
  <article role="article" aria-labelledby="project-title-1">
  <button aria-expanded="false" aria-controls="menu">
  ```
- [ ] Asegurar contraste de colores (WCAG AA)
- [ ] Testear con herramientas:
  - Lighthouse
  - axe DevTools
  - Navegación solo con teclado

**Archivos afectados:**
- `index.html`
- `src/sections/projects/projects-simple.ts`
- `src/styles/**/*.scss`

---

### ✅ Tarea 4.5: Optimización de performance
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 1 hora  
**Commit:** `perf: optimize bundle size and loading`

**Acciones:**
- [ ] Analizar bundle: `npm run build -- --analyze`
- [ ] Implementar code splitting
- [ ] Minificar CSS y JS en producción
- [ ] Optimizar imágenes:
  ```bash
  npm install -D vite-plugin-imagemin
  ```
- [ ] Configurar compresión gzip
- [ ] Meta de Lighthouse: > 90 en todas las categorías

**Archivos afectados:**
- `vite.config.ts`
- Imágenes en `public/assets/`

---

## 📋 FASE 5: CI/CD Y DEPLOYMENT

### ✅ Tarea 5.1: Configurar GitHub Actions
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 45 minutos  
**Commit:** `ci: setup github actions workflow`

**Acciones:**
- [ ] Crear `.github/workflows/deploy.yml`:
  ```yaml
  name: Deploy Portfolio
  
  on:
    push:
      branches: [main]
  
  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
          with:
            node-version: '18'
        - run: npm ci
        - run: npm run build
        - run: npm run test
        - name: Deploy to GitHub Pages
          uses: peaceiris/actions-gh-pages@v3
          with:
            github_token: ${{ secrets.GITHUB_TOKEN }}
            publish_dir: ./dist
  ```
- [ ] Probar workflow

**Archivos afectados:**
- `.github/workflows/deploy.yml` (nuevo)

---

### ✅ Tarea 5.2: Pre-commit hooks
**Prioridad:** 🟢 BAJA  
**Tiempo estimado:** 30 minutos  
**Commit:** `chore: add pre-commit hooks with husky`

**Acciones:**
- [ ] Instalar Husky: `npm install -D husky lint-staged`
- [ ] Inicializar: `npx husky-init`
- [ ] Configurar en `package.json`:
  ```json
  "lint-staged": {
    "*.{js,ts}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["prettier --write"]
  }
  ```
- [ ] Agregar pre-commit hook

**Archivos afectados:**
- `.husky/pre-commit` (nuevo)
- `package.json`

---

### ✅ Tarea 5.3: Documentación final
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 1 hora  
**Commit:** `docs: update project documentation`

**Acciones:**
- [ ] Actualizar `README.md` con:
  - Descripción del proyecto
  - Stack tecnológico
  - Comandos de desarrollo
  - Estructura de carpetas
  - Cómo contribuir
- [ ] Crear `CONTRIBUTING.md`
- [ ] Agregar comentarios JSDoc en funciones principales

**Archivos afectados:**
- `README.md`
- `CONTRIBUTING.md` (nuevo)
- Archivos TS (comentarios)

---

## 📊 RESUMEN DE TAREAS

| Fase | Tareas | Tiempo Total | Prioridad |
|------|--------|--------------|-----------|
| **Fase 1** | 5 tareas | ~5 horas | 🔴 CRÍTICA |
| **Fase 2** | 5 tareas | ~6.5 horas | 🟠 ALTA |
| **Fase 3** | 5 tareas | ~6.5 horas | 🟡 MEDIA |
| **Fase 4** | 5 tareas | ~6 horas | 🟠 ALTA |
| **Fase 5** | 3 tareas | ~2 horas | 🟡 MEDIA |
| **TOTAL** | **23 tareas** | **~26 horas** | - |

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Revisar y aprobar este plan
2. ✅ Crear branch: `git checkout -b refactor/modern-architecture`
3. ✅ Comenzar con **Fase 1 - Tarea 1.1**
4. ✅ Hacer commit después de cada tarea completada
5. ✅ Crear PR al finalizar cada fase

---

## 📝 NOTAS IMPORTANTES

- ⚠️ **No hacer múltiples cambios en un solo commit**
- ⚠️ **Probar después de cada tarea**
- ⚠️ **Mantener la funcionalidad actual mientras refactorizamos**
- ⚠️ **El sitio debe funcionar en todo momento**

---

**Última actualización:** 2025-11-06  
**Estado:** 📋 Planificación completa  
**Progreso:** 0/23 tareas completadas (0%)

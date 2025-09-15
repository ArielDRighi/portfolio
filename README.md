# Portfolio - Desarrollador Backend

![Portfolio Preview](https://via.placeholder.com/800x400/2C3E50/FFFFFF?text=Portfolio+Preview)

Un portfolio profesional único con diseño de escritorio Windows para mostrar proyectos de desarrollo backend de manera innovadora y atractiva.

## 🚀 Características Principales

### 🎨 Diseño Único

- **Escritorio Windows**: Interfaz inspirada en Windows donde cada proyecto es un icono interactivo
- **Tema Claro/Oscuro**: Cambio dinámico entre temas con persistencia
- **Responsive**: Adaptado para móviles, tablets y desktop
- **Animaciones Suaves**: Transiciones y efectos que mejoran la experiencia

### 📱 Secciones

1. **Información Personal**: Presentación, foto y habilidades técnicas organizadas
2. **Experiencia Laboral**: Timeline interactivo con historial profesional
3. **Proyectos**: Escritorio virtual con iconos que enlazan a repositorios GitHub
4. **Contacto**: Información de contacto y formulario funcional

### ⚡ Funcionalidades Técnicas

- **Performance Optimizado**: Carga rápida y navegación fluida
- **SEO Friendly**: Meta tags y estructura semántica
- **Accesibilidad**: Navegación por teclado y lectores de pantalla
- **GitHub Pages Ready**: Configurado para deploy automático

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Variables, Grid, Flexbox, animaciones
- **JavaScript ES6+**: Módulos, clases, async/await
- **Git**: Control de versiones
- **GitHub Pages**: Hosting gratuito

## 📂 Estructura del Proyecto

```
portfolio/
├── index.html              # Página principal
├── css/
│   ├── styles.css          # Estilos base y variables
│   ├── desktop.css         # Estilos del escritorio Windows
│   └── responsive.css      # Media queries y responsive
├── js/
│   ├── main.js            # Funcionalidades principales
│   ├── desktop.js         # Lógica del escritorio de proyectos
│   └── theme-toggle.js    # Sistema de temas
├── assets/
│   ├── images/
│   │   ├── profile/       # Foto de perfil
│   │   ├── projects/      # Imágenes de proyectos
│   │   └── icons/         # Iconos y elementos gráficos
│   └── documents/
│       └── cv.pdf         # CV en PDF (opcional)
├── data/
│   ├── projects.json      # Datos de proyectos
│   └── experience.json    # Datos de experiencia laboral
├── PROJECT_DOCUMENTATION.md  # Documentación completa
├── README.md              # Este archivo
└── .gitignore            # Archivos ignorados por Git
```

## 🚦 Cómo Empezar

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/portfolio.git
cd portfolio
```

### 2. Personalizar Contenido

#### Información Personal (index.html)

- Actualiza tu nombre, título y descripción
- Cambia las habilidades técnicas en la sección skills
- Añade tu foto de perfil en `assets/images/profile/`

#### Proyectos (data/projects.json)

```json
{
  "id": 1,
  "title": "Tu Proyecto",
  "description": "Descripción del proyecto",
  "type": "api", // api, web, mobile, desktop, library, tool, game, bot
  "technologies": ["node", "mongodb", "docker"],
  "status": "completed", // completed, in-progress, planned
  "repository": "https://github.com/tu-usuario/tu-proyecto",
  "featured": true
}
```

#### Experiencia (data/experience.json)

```json
{
  "company": "Tu Empresa",
  "position": "Tu Cargo",
  "startDate": "2023-01-01",
  "endDate": null, // null si es trabajo actual
  "current": true,
  "description": "Descripción del puesto",
  "technologies": ["node", "python", "aws"],
  "achievements": ["Logro 1", "Logro 2"]
}
```

### 3. Configurar Información de Contacto

Actualiza los enlaces en la sección de contacto:

- Email
- LinkedIn
- GitHub
- Ubicación

### 4. Subir a GitHub Pages

#### Crear Repositorio en GitHub

1. Ve a GitHub.com
2. Crea un nuevo repositorio público
3. **No** inicialices con README (ya tienes uno)

#### Subir Código

```bash
git add .
git commit -m "Initial commit: Portfolio base structure"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git push -u origin main
```

#### Activar GitHub Pages

1. Ve a Settings → Pages en tu repositorio
2. Selecciona "Deploy from a branch"
3. Elige "main" branch y "/ (root)"
4. Guarda los cambios

Tu portfolio estará disponible en: `https://tu-usuario.github.io/tu-repositorio`

## 🎨 Personalización Avanzada

### Colores

Modifica las variables CSS en `css/styles.css`:

```css
:root {
  --color-primary: #2c3e50; /* Color principal */
  --color-accent: #27ae60; /* Color de acento */
  --color-background: #ffffff; /* Fondo */
}
```

### Iconos de Proyectos

En `js/desktop.js`, personaliza los iconos por tipo:

```javascript
iconTypes: {
  api: '🔗',
  web: '🌐',
  mobile: '📱',
  // Añade más tipos según necesites
}
```

### Tecnologías y Badges

Añade nuevos badges de tecnología en `css/desktop.css`:

```css
.tech-badge--tu-tech {
  background: #tu-color;
}
```

## 📱 Responsive Design

El portfolio está optimizado para:

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Características Móviles

- Menú hamburguesa
- Escritorio adaptado a 2 columnas
- Timeline simplificada
- Formulario optimizado

## 🔧 Funcionalidades JavaScript

### Navegación Suave

```javascript
// Scroll automático a secciones
utils.smoothScrollTo(targetElement);
```

### Sistema de Temas

```javascript
// Cambiar tema programáticamente
themeManager.setTheme("dark");
themeManager.toggleTheme();
```

### Escritorio de Proyectos

```javascript
// Añadir proyecto dinámicamente
desktopManager.addProject(projectData);

// Filtrar por tecnología
desktopManager.filterByTechnology("node");
```

## 📊 Performance

### Optimizaciones Incluidas

- **CSS**: Variables para reutilización
- **JavaScript**: Módulos y lazy loading
- **Imágenes**: Formato optimizado y lazy loading
- **Fonts**: Preload de fuentes críticas

### Métricas Objetivo

- **Lighthouse Score**: >90
- **First Contentful Paint**: <2s
- **Largest Contentful Paint**: <3s

## 🤝 Contribución

Si encuentras bugs o tienes sugerencias:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Reconocimientos

- Iconos de [Emojipedia](https://emojipedia.org/)
- Fuentes de [Google Fonts](https://fonts.google.com/)
- Inspiración en el diseño clásico de Windows

---

## 📞 Contacto

Si tienes preguntas sobre este portfolio:

- **Email**: tu-email@ejemplo.com
- **LinkedIn**: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- **GitHub**: [Tu Usuario](https://github.com/tu-usuario)

---

**¡Hecho con ❤️ para la comunidad de desarrolladores!**

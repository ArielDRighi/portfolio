/**
 * GitHub Integration Simple
 * Enriquece proyectos existentes con datos básicos de GitHub
 */
class GitHubIntegration {
  constructor() {
    this.apiBase = 'https://api.github.com';
    this.username = null;
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutos
  }

  /**
   * Configura el usuario de GitHub
   */
  setUsername(username) {
    this.username = username;
    this.clearCache();
  }

  /**
   * Enriquece un proyecto con datos de GitHub
   */
  async enrichProject(project) {
    // Si el proyecto ya tiene URL de GitHub, extraer el nombre del repo
    if (!project.github || !this.username) {
      return project;
    }

    try {
      const repoName = this.extractRepoName(project.github);
      if (!repoName) return project;

      const repoData = await this.getRepositoryBasicData(repoName);
      if (!repoData) return project;

      // Solo agregar/actualizar campos básicos
      return {
        ...project,
        description: project.description || repoData.description || 'Sin descripción',
        technologies: project.technologies || this.detectBasicTechnologies(repoData),
        github: repoData.html_url,
        stats: {
          stars: repoData.stargazers_count || 0,
          forks: repoData.forks_count || 0,
        },
        language: repoData.language,
        lastUpdate: repoData.updated_at,
      };
    } catch (error) {
      console.warn(`No se pudo enriquecer proyecto ${project.name}:`, error);
      return project;
    }
  }

  /**
   * Enriquece una lista de proyectos
   */
  async enrichProjects(projects) {
    if (!this.username || !projects || projects.length === 0) {
      return projects;
    }

    console.log(`Enriqueciendo ${projects.length} proyectos con datos de GitHub...`);

    const enrichedProjects = [];

    for (const project of projects) {
      const enriched = await this.enrichProject(project);
      enrichedProjects.push(enriched);

      // Pequeña pausa para no saturar la API
      await this.delay(200);
    }

    return enrichedProjects;
  }

  /**
   * Obtiene datos básicos de un repositorio
   */
  async getRepositoryBasicData(repoName) {
    const cacheKey = `repo:${this.username}/${repoName}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.apiBase}/repos/${this.username}/${repoName}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Repositorio no encontrado: ${repoName}`);
          return null;
        }
        throw new Error(`GitHub API Error: ${response.status}`);
      }

      const repoData = await response.json();

      // Guardar en caché solo los datos que necesitamos
      const basicData = {
        name: repoData.name,
        description: repoData.description,
        html_url: repoData.html_url,
        language: repoData.language,
        stargazers_count: repoData.stargazers_count,
        forks_count: repoData.forks_count,
        updated_at: repoData.updated_at,
        topics: repoData.topics || [],
      };

      this.setCache(cacheKey, basicData);
      return basicData;
    } catch (error) {
      console.warn(`Error obteniendo datos de ${repoName}:`, error);
      return null;
    }
  }

  /**
   * Detecta tecnologías básicas del repositorio
   */
  detectBasicTechnologies(repoData) {
    const technologies = [];

    // Agregar lenguaje principal
    if (repoData.language) {
      const lang = repoData.language.toLowerCase();
      technologies.push(this.normalizeTechnology(lang));
    }

    // Agregar tecnologías de los topics
    if (repoData.topics && repoData.topics.length > 0) {
      const knownTechs = [
        'react',
        'vue',
        'angular',
        'node',
        'express',
        'mongodb',
        'postgresql',
        'mysql',
        'docker',
        'aws',
      ];

      repoData.topics.forEach((topic) => {
        const normalizedTopic = topic.toLowerCase();
        if (knownTechs.includes(normalizedTopic) && !technologies.includes(normalizedTopic)) {
          technologies.push(this.normalizeTechnology(normalizedTopic));
        }
      });
    }

    // Máximo 4 tecnologías para mantener el diseño limpio
    return technologies.slice(0, 4);
  }

  /**
   * Normaliza nombres de tecnologías
   */
  normalizeTechnology(tech) {
    const techMap = {
      javascript: 'javascript',
      typescript: 'typescript',
      python: 'python',
      java: 'java',
      csharp: 'c#',
      cpp: 'c++',
      node: 'node',
      nodejs: 'node',
      react: 'react',
      vue: 'vue',
      angular: 'angular',
      express: 'express',
      mongodb: 'mongodb',
      postgresql: 'postgresql',
      mysql: 'mysql',
      docker: 'docker',
      aws: 'aws',
    };

    return techMap[tech.toLowerCase()] || tech;
  }

  /**
   * Extrae el nombre del repositorio de una URL de GitHub
   */
  extractRepoName(githubUrl) {
    try {
      const url = new URL(githubUrl);
      const pathParts = url.pathname.split('/').filter((part) => part);

      if (pathParts.length >= 2 && url.hostname === 'github.com') {
        return pathParts[1]; // El segundo elemento es el nombre del repo
      }

      return null;
    } catch (error) {
      console.warn('URL de GitHub inválida:', githubUrl);
      return null;
    }
  }

  /**
   * Verifica si GitHub está configurado
   */
  isConfigured() {
    return !!this.username;
  }

  /**
   * Obtiene configuración desde localStorage
   */
  loadConfiguration() {
    try {
      const config = localStorage.getItem('github-config');
      if (config) {
        const parsed = JSON.parse(config);
        if (parsed.username) {
          this.setUsername(parsed.username);
          return true;
        }
      }
    } catch (error) {
      console.warn('Error cargando configuración de GitHub:', error);
    }
    return false;
  }

  /**
   * Manejo de caché simple
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clearCache() {
    this.cache.clear();
  }

  /**
   * Utilidad para añadir delays
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Obtiene estadísticas simples del usuario
   */
  async getUserStats() {
    if (!this.username) return null;

    try {
      const response = await fetch(`${this.apiBase}/users/${this.username}`);
      if (!response.ok) return null;

      const userData = await response.json();
      return {
        repos: userData.public_repos || 0,
        followers: userData.followers || 0,
        following: userData.following || 0,
      };
    } catch (error) {
      console.warn('Error obteniendo estadísticas de usuario:', error);
      return null;
    }
  }
}

// Instancia global
window.githubIntegration = new GitHubIntegration();

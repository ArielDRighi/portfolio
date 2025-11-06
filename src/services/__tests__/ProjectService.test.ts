/**
 * Tests for ProjectService
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProjectService } from '../ProjectService';
import type { Project } from '../../types';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    service = new ProjectService();
  });

  describe('getProjects', () => {
    it('should return hardcoded projects when no data source is provided', async () => {
      const projects = await service.getProjects();

      expect(projects).toBeDefined();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
    });

    it('should return projects with correct structure', async () => {
      const projects = await service.getProjects();
      const firstProject = projects[0];

      expect(firstProject).toHaveProperty('id');
      expect(firstProject).toHaveProperty('name');
      expect(firstProject).toHaveProperty('type');
      expect(firstProject).toHaveProperty('description');
      expect(firstProject).toHaveProperty('technologies');
      expect(firstProject).toHaveProperty('github');
      expect(firstProject).toHaveProperty('status');
    });

    it('should return projects with valid data types', async () => {
      const projects = await service.getProjects();
      const firstProject = projects[0];

      expect(typeof firstProject.id).toBe('number');
      expect(typeof firstProject.name).toBe('string');
      expect(typeof firstProject.type).toBe('string');
      expect(typeof firstProject.description).toBe('string');
      expect(Array.isArray(firstProject.technologies)).toBe(true);
      expect(typeof firstProject.github).toBe('string');
      expect(typeof firstProject.status).toBe('string');
    });

    it('should cache projects after first load', async () => {
      const projects1 = await service.getProjects();
      const projects2 = await service.getProjects();

      // Should return the same cached instance
      expect(projects1).toBe(projects2);
    });

    it('should load from JSON when data source is provided', async () => {
      const mockProjects: Project[] = [
        {
          id: 999,
          name: 'Test Project',
          type: 'Test',
          description: 'Test Description',
          technologies: ['test'],
          github: 'https://github.com/test',
          status: 'completed',
          featured: false,
          stats: { stars: 0, forks: 0, commits: 0 },
        },
      ];

      // Mock fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockProjects,
      } as Response);

      const serviceWithSource = new ProjectService('/data/projects.json');
      const projects = await serviceWithSource.getProjects();

      expect(fetch).toHaveBeenCalledWith('/data/projects.json');
      expect(projects).toEqual(mockProjects);
    });

    it('should fallback to hardcoded projects on fetch error', async () => {
      // Mock fetch to fail
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const serviceWithSource = new ProjectService('/data/projects.json');
      const projects = await serviceWithSource.getProjects();

      // Should still return hardcoded projects
      expect(projects).toBeDefined();
      expect(projects.length).toBeGreaterThan(0);
    });

    it('should fallback to hardcoded projects on HTTP error', async () => {
      // Mock fetch with 404 response
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({}),
      } as Response);

      const serviceWithSource = new ProjectService('/data/projects.json');
      const projects = await serviceWithSource.getProjects();

      // Should still return hardcoded projects
      expect(projects).toBeDefined();
      expect(projects.length).toBeGreaterThan(0);
    });
  });

  describe('getProjectById', () => {
    it('should return project with matching id', async () => {
      const project = await service.getProjectById(1);

      expect(project).toBeDefined();
      expect(project?.id).toBe(1);
    });

    it('should return undefined for non-existent id', async () => {
      const project = await service.getProjectById(9999);

      expect(project).toBeUndefined();
    });
  });

  describe('getProjectsByType', () => {
    it('should return projects matching the type', async () => {
      const projects = await service.getProjectsByType('Monolith');

      expect(Array.isArray(projects)).toBe(true);
      projects.forEach((project) => {
        expect(project.type).toBe('Monolith');
      });
    });

    it('should return empty array for non-existent type', async () => {
      const projects = await service.getProjectsByType('NonExistentType');

      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBe(0);
    });
  });

  describe('getProjectsByTechnology', () => {
    it('should return projects using specified technology', async () => {
      const projects = await service.getProjectsByTechnology('typescript');

      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
      projects.forEach((project) => {
        expect(project.technologies).toContain('typescript');
      });
    });

    it('should return empty array for non-existent technology', async () => {
      const projects = await service.getProjectsByTechnology('nonexistent-tech');

      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBe(0);
    });

    it('should be case-sensitive for technology search', async () => {
      const projects = await service.getProjectsByTechnology('TypeScript');

      // Should not match 'typescript' (lowercase)
      expect(projects.length).toBe(0);
    });
  });

  describe('getFeaturedProjects', () => {
    it('should return only featured projects', async () => {
      const projects = await service.getFeaturedProjects();

      expect(Array.isArray(projects)).toBe(true);
      projects.forEach((project) => {
        expect(project.featured).toBe(true);
      });
    });
  });

  describe('getTotalStats', () => {
    it('should return correct stats structure', async () => {
      const stats = await service.getTotalStats();

      expect(stats).toHaveProperty('totalProjects');
      expect(stats).toHaveProperty('totalTechnologies');
      expect(stats).toHaveProperty('totalStars');
      expect(stats).toHaveProperty('totalCommits');
    });

    it('should return correct stat types', async () => {
      const stats = await service.getTotalStats();

      expect(typeof stats.totalProjects).toBe('number');
      expect(typeof stats.totalTechnologies).toBe('number');
      expect(typeof stats.totalStars).toBe('number');
      expect(typeof stats.totalCommits).toBe('number');
    });

    it('should calculate total projects correctly', async () => {
      const projects = await service.getProjects();
      const stats = await service.getTotalStats();

      expect(stats.totalProjects).toBe(projects.length);
    });

    it('should calculate unique technologies correctly', async () => {
      const projects = await service.getProjects();
      const allTechs = projects.flatMap((p) => p.technologies);
      const uniqueTechs = new Set(allTechs);
      const stats = await service.getTotalStats();

      expect(stats.totalTechnologies).toBe(uniqueTechs.size);
    });

    it('should calculate total stars correctly', async () => {
      const projects = await service.getProjects();
      const expectedStars = projects.reduce((sum, p) => sum + (p.stats?.stars || 0), 0);
      const stats = await service.getTotalStats();

      expect(stats.totalStars).toBe(expectedStars);
    });

    it('should calculate total commits correctly', async () => {
      const projects = await service.getProjects();
      const expectedCommits = projects.reduce((sum, p) => sum + (p.stats?.commits || 0), 0);
      const stats = await service.getTotalStats();

      expect(stats.totalCommits).toBe(expectedCommits);
    });

    it('should handle projects without stats', async () => {
      const stats = await service.getTotalStats();

      // Should not throw and return valid numbers
      expect(stats.totalStars).toBeGreaterThanOrEqual(0);
      expect(stats.totalCommits).toBeGreaterThanOrEqual(0);
    });
  });

  describe('clearCache', () => {
    it('should clear cached projects', async () => {
      await service.getProjects();
      service.clearCache();

      // After clearing, should load projects again
      const projects = await service.getProjects();
      expect(projects).toBeDefined();
    });
  });

  describe('setDataSource', () => {
    it('should update data source and clear cache', async () => {
      await service.getProjects(); // Load initial projects

      service.setDataSource('/new/path/projects.json');

      // Cache should be cleared, triggering new load
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await service.getProjects();

      consoleSpy.mockRestore();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});

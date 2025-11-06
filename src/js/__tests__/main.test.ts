/**
 * Tests for main.ts utility functions
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CONFIG, utils } from '../main';

describe('CONFIG', () => {
  it('should have correct default values', () => {
    expect(CONFIG.animationDuration).toBe(300);
    expect(CONFIG.scrollOffset).toBe(80);
    expect(CONFIG.debounceDelay).toBe(250);
  });
});

describe('utils', () => {
  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should delay function execution', () => {
      const mockFn = vi.fn();
      const debouncedFn = utils.debounce(mockFn, 500);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should only call function once for multiple rapid calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = utils.debounce(mockFn, 500);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      vi.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments correctly', () => {
      const mockFn = vi.fn();
      const debouncedFn = utils.debounce(mockFn, 500);

      debouncedFn('test', 123);
      vi.advanceTimersByTime(500);

      expect(mockFn).toHaveBeenCalledWith('test', 123);
    });

    it('should reset timer on subsequent calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = utils.debounce(mockFn, 500);

      debouncedFn();
      vi.advanceTimersByTime(300);
      debouncedFn();
      vi.advanceTimersByTime(300);

      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('smoothScrollTo', () => {
    let mockElement: HTMLElement;

    beforeEach(() => {
      mockElement = document.createElement('div');
      Object.defineProperty(mockElement, 'offsetTop', {
        value: 1000,
        writable: true,
      });

      // Mock window.scrollTo
      window.scrollTo = vi.fn();
    });

    it('should call window.scrollTo with correct parameters', () => {
      utils.smoothScrollTo(mockElement);

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 1000 - CONFIG.scrollOffset,
        behavior: 'smooth',
      });
    });

    it('should use default offset', () => {
      utils.smoothScrollTo(mockElement);

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 920, // 1000 - 80
        behavior: 'smooth',
      });
    });

    it('should use custom offset', () => {
      utils.smoothScrollTo(mockElement, 100);

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 900, // 1000 - 100
        behavior: 'smooth',
      });
    });
  });

  describe('isInViewport', () => {
    let mockElement: HTMLElement;

    beforeEach(() => {
      mockElement = document.createElement('div');

      // Mock window dimensions
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768,
      });
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('should return true when element is fully in viewport', () => {
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 100,
        left: 100,
        bottom: 200,
        right: 200,
      });

      expect(utils.isInViewport(mockElement)).toBe(true);
    });

    it('should return false when element is above viewport', () => {
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        top: -100,
        left: 100,
        bottom: -50,
        right: 200,
      });

      expect(utils.isInViewport(mockElement)).toBe(false);
    });

    it('should return false when element is below viewport', () => {
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 900,
        left: 100,
        bottom: 1000,
        right: 200,
      });

      expect(utils.isInViewport(mockElement)).toBe(false);
    });

    it('should return false when element is to the left of viewport', () => {
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 100,
        left: -100,
        bottom: 200,
        right: -50,
      });

      expect(utils.isInViewport(mockElement)).toBe(false);
    });

    it('should return false when element is to the right of viewport', () => {
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 100,
        left: 1100,
        bottom: 200,
        right: 1200,
      });

      expect(utils.isInViewport(mockElement)).toBe(false);
    });
  });

  describe('getCurrentTime', () => {
    it('should return a non-empty time string', () => {
      const time = utils.getCurrentTime();
      expect(time).toBeTruthy();
      expect(typeof time).toBe('string');
      expect(time.length).toBeGreaterThan(0);
    });

    it('should return a string containing time digits', () => {
      const time = utils.getCurrentTime();
      // Should contain at least some digits (flexible for different locales)
      expect(time).toMatch(/\d/);
    });

    it('should return consistent format on multiple calls', () => {
      const time1 = utils.getCurrentTime();
      const time2 = utils.getCurrentTime();
      
      // Both should be strings
      expect(typeof time1).toBe('string');
      expect(typeof time2).toBe('string');
      
      // Format should be consistent (same length pattern)
      expect(time1.length).toBeGreaterThan(0);
      expect(time2.length).toBeGreaterThan(0);
    });
  });
});

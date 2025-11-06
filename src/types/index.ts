/**
 * Central export for all type definitions
 */

export * from './Project';
export * from './Experience';

// Common utility types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export type Theme = 'light' | 'dark';

export interface Config {
  animationDuration: number;
  scrollOffset: number;
  debounceDelay: number;
}

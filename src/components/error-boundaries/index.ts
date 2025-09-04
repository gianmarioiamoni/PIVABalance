/**
 * Error Boundaries
 *
 * Comprehensive error boundary system for React applications
 * Provides different levels of error handling with user-friendly fallbacks
 */

export { ErrorBoundary } from "./ErrorBoundary";
export { PageErrorBoundary } from "./PageErrorBoundary";
export { SectionErrorBoundary } from "./SectionErrorBoundary";
export { AuthErrorBoundary } from "./AuthErrorBoundary";

// Re-export types for convenience
export type {
  ErrorBoundaryInfo,
  ErrorBoundaryState,
  ErrorBoundaryProps,
} from "./ErrorBoundary";

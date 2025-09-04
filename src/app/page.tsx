import React from 'react';
import { AuthRedirectWrapper, HomePage } from '@/components/homepage';

/**
 * Home Page Route (App Router)
 * 
 * This is now a clean, simple composition of:
 * - AuthRedirectWrapper (Client Component): Handles authentication logic
 * - HomePage (Server Component): Renders the actual homepage content
 * 
 * Benefits of this refactoring:
 * - Single Responsibility: Each component has one clear purpose
 * - Server-Side Rendering: Most content is SSR for better SEO and performance
 * - Maintainability: Easy to modify individual sections
 * - Testability: Each component can be tested in isolation
 * - Extensibility: Easy to add new sections or modify existing ones
 */
export default function Home() {
  return (
    <AuthRedirectWrapper>
      <HomePage />
    </AuthRedirectWrapper>
  );
}

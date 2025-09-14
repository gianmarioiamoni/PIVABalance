import { setupSuperAdmin } from '@/lib/init/setupSuperAdmin';

/**
 * Server Initializer Component
 * 
 * Handles server-side initialization tasks that need to run
 * when the application starts. This includes:
 * - Super admin user setup
 * - Database migrations (if any)
 * - System health checks
 * 
 * This component runs only on the server side and doesn't render anything.
 * It's used to ensure system initialization happens before serving pages.
 */
export async function ServerInitializer() {
  // Only run initialization in production or when explicitly enabled
  const shouldInitialize = 
    process.env.NODE_ENV === 'production' || 
    process.env.ENABLE_INIT === 'true';

  if (shouldInitialize) {
    // Initialize super admin
    await setupSuperAdmin();
  }

  // This component doesn't render anything
  return null;
}

/**
 * Client wrapper that does nothing on client side
 * This ensures the initialization only runs on server
 */
export function ClientInitializer() {
  return null;
}

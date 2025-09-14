import { ensureSuperAdmin } from '@/lib/auth/authorization';

/**
 * Setup Super Admin
 * 
 * Initializes the super admin user if none exists.
 * This should be called during application startup.
 * 
 * Environment Variables Required:
 * - SUPER_ADMIN_EMAIL: Email for the super admin account
 * - SUPER_ADMIN_PASSWORD: Password for the super admin account  
 * - SUPER_ADMIN_NAME: Display name for the super admin (optional)
 * 
 * Security:
 * - Only creates super admin if none exists
 * - Uses secure password hashing
 * - Logs creation for audit trail
 */
export async function setupSuperAdmin(): Promise<void> {
  try {
    console.log('🔧 Initializing super admin...');
    await ensureSuperAdmin();
    console.log('✅ Super admin initialization complete');
  } catch (error) {
    console.error('❌ Super admin initialization failed:', error);
  }
}

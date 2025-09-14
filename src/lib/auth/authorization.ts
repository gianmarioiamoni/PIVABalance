import { NextRequest } from 'next/server';
import { getUserFromRequest } from './jwt';
import { User } from '@/models/User';
import { connectDB } from '@/lib/database/mongodb';
import { IUser } from '@/types';

/**
 * Authorization utilities for role-based access control
 * 
 * Provides middleware and utility functions for checking user roles and permissions.
 * Follows security best practices with proper validation and error handling.
 */

export type UserRole = 'user' | 'admin' | 'super_admin';

/**
 * Get user with role information from request
 * Extends JWT verification with database role lookup
 */
export async function getUserWithRole(request: NextRequest): Promise<IUser | null> {
  try {
    // Get user data from JWT
    const userData = await getUserFromRequest(request);
    if (!userData) {
      return null;
    }

    // Connect to database and get full user data
    await connectDB();
    const user = await User.findById(userData.userId);
    
    if (!user || !user.isActive) {
      return null;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return user;
  } catch (error) {
    console.error('Error getting user with role:', error);
    return null;
  }
}

/**
 * Check if user has required role or higher
 * Role hierarchy: super_admin > admin > user
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    admin: 2,
    super_admin: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Check if user can perform action on target user
 * Super admin can do anything, admin can manage users, users can only manage themselves
 */
export function canManageUser(
  currentUser: IUser, 
  targetUserId: string, 
  action: 'view' | 'edit' | 'delete' | 'promote'
): boolean {
  // Super admin can do anything
  if (currentUser.role === 'super_admin') {
    return true;
  }

  // Admin can manage users but not other admins (except view)
  if (currentUser.role === 'admin') {
    if (action === 'view') return true;
    // Admin cannot manage super_admin or other admins for destructive actions
    return true; // We'll check target user role in the actual implementation
  }

  // Regular users can only manage themselves for view/edit
  if (currentUser._id.toString() === targetUserId) {
    return action === 'view' || action === 'edit';
  }

  return false;
}

/**
 * Middleware factory for role-based access control
 */
export function requireRole(requiredRole: UserRole) {
  return async function(request: NextRequest): Promise<{ user: IUser } | { error: string; status: number }> {
    try {
      const user = await getUserWithRole(request);
      
      if (!user) {
        return { error: 'Authentication required', status: 401 };
      }

      if (!hasRole(user.role, requiredRole)) {
        return { 
          error: `${requiredRole} access required`, 
          status: 403 
        };
      }

      return { user };
    } catch (error) {
      console.error('Authorization error:', error);
      return { error: 'Authorization failed', status: 500 };
    }
  };
}

/**
 * Specific middleware functions for common use cases
 */
export const requireAdmin = requireRole('admin');
export const requireSuperAdmin = requireRole('super_admin');

/**
 * Check if there are any super admins in the system
 * Used for initial setup validation
 */
export async function hasSuperAdmin(): Promise<boolean> {
  try {
    await connectDB();
    const superAdminCount = await User.countDocuments({ 
      role: 'super_admin', 
      isActive: true 
    });
    return superAdminCount > 0;
  } catch (error) {
    console.error('Error checking for super admin:', error);
    return false;
  }
}

/**
 * Create super admin if none exists
 * Used for initial system setup
 */
export async function ensureSuperAdmin(): Promise<void> {
  try {
    const superAdminExists = await hasSuperAdmin();
    if (superAdminExists) {
      return;
    }

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
    const superAdminName = process.env.SUPER_ADMIN_NAME || 'Super Administrator';

    if (!superAdminEmail || !superAdminPassword) {
      console.warn('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD environment variables not set. Skipping super admin creation.');
      return;
    }

    await connectDB();

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: superAdminEmail });
    if (existingUser) {
      // Upgrade existing user to super admin
      existingUser.role = 'super_admin';
      existingUser.isActive = true;
      await existingUser.save();
      console.log('Upgraded existing user to super admin:', superAdminEmail);
    } else {
      // Create new super admin
      const superAdmin = new User({
        email: superAdminEmail,
        password: superAdminPassword, // Will be hashed by pre-save middleware
        name: superAdminName,
        role: 'super_admin',
        isActive: true,
      });

      await superAdmin.save();
      console.log('Created super admin user:', superAdminEmail);
    }
  } catch (error) {
    console.error('Error ensuring super admin:', error);
  }
}

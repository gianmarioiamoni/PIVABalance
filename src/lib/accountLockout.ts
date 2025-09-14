/**
 * Account Lockout Service
 * SRP: Account security and lockout management ONLY
 */

interface LockoutEntry {
  failedAttempts: number;
  lockoutUntil?: number;
  lastAttempt: number;
}

/**
 * Simple in-memory account lockout manager
 * For production, consider using Redis or database storage
 */
class AccountLockoutManager {
  private lockouts: Map<string, LockoutEntry> = new Map();
  private readonly maxAttempts = 5;
  private readonly lockoutDuration = 15 * 60 * 1000; // 15 minutes
  private readonly attemptWindow = 15 * 60 * 1000; // 15 minutes

  /**
   * Record a failed login attempt
   */
  recordFailedAttempt(identifier: string): { isLocked: boolean; lockoutUntil?: number } {
    const now = Date.now();
    let entry = this.lockouts.get(identifier);

    if (!entry) {
      entry = {
        failedAttempts: 1,
        lastAttempt: now,
      };
    } else {
      // Reset counter if last attempt was outside the window
      if (now - entry.lastAttempt > this.attemptWindow) {
        entry.failedAttempts = 1;
        entry.lockoutUntil = undefined;
      } else {
        entry.failedAttempts++;
      }
      entry.lastAttempt = now;
    }

    // Lock account if max attempts exceeded
    if (entry.failedAttempts >= this.maxAttempts) {
      entry.lockoutUntil = now + this.lockoutDuration;
    }

    this.lockouts.set(identifier, entry);

    return {
      isLocked: !!entry.lockoutUntil && entry.lockoutUntil > now,
      lockoutUntil: entry.lockoutUntil,
    };
  }

  /**
   * Check if account is currently locked
   */
  isAccountLocked(identifier: string): { isLocked: boolean; lockoutUntil?: number; remainingTime?: number } {
    const entry = this.lockouts.get(identifier);
    const now = Date.now();

    if (!entry || !entry.lockoutUntil) {
      return { isLocked: false };
    }

    if (entry.lockoutUntil <= now) {
      // Lockout expired, reset entry
      entry.lockoutUntil = undefined;
      entry.failedAttempts = 0;
      this.lockouts.set(identifier, entry);
      return { isLocked: false };
    }

    return {
      isLocked: true,
      lockoutUntil: entry.lockoutUntil,
      remainingTime: entry.lockoutUntil - now,
    };
  }

  /**
   * Clear failed attempts (successful login)
   */
  clearFailedAttempts(identifier: string): void {
    this.lockouts.delete(identifier);
  }

  /**
   * Get current status without modifying
   */
  getStatus(identifier: string): { 
    failedAttempts: number; 
    isLocked: boolean; 
    remainingTime?: number;
    maxAttempts: number;
  } {
    const entry = this.lockouts.get(identifier);
    const lockStatus = this.isAccountLocked(identifier);

    return {
      failedAttempts: entry?.failedAttempts || 0,
      isLocked: lockStatus.isLocked,
      remainingTime: lockStatus.remainingTime,
      maxAttempts: this.maxAttempts,
    };
  }

  /**
   * Manually unlock account (admin function)
   */
  unlockAccount(identifier: string): void {
    this.lockouts.delete(identifier);
  }
}

// Global instance
export const accountLockout = new AccountLockoutManager();

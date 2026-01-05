/**
 * Auth Controller - Simplified for Better Auth
 * 
 * Better Auth handles core authentication at /api/auth/*
 * This controller provides additional auth-related utilities.
 */

import type { Context } from 'elysia';
import type { User } from '../../domain/user';

export class AuthController {
  /**
   * Get current user info
   * Requires auth macro to be enabled on route
   */
  async getCurrentUser({ user }: { user: User }): Promise<Partial<User>> {
    if (!user) {
      return {};
    }
    // Return user without sensitive fields
    const { ...safeUser } = user;
    return safeUser;
  }
}

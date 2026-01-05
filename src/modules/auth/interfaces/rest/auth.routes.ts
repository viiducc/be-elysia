/**
 * Auth Routes - Info only (Better Auth handles all auth at /api/auth/*)
 */

import type { Config } from '../../../../config/types';
import { createBaseElysia } from '../../../../shared/utils/base-elysia';

export const getAuthRoutes = (config: Config) => {
  return createBaseElysia(config)
    .get('/info', () => ({
      message: 'Use Better Auth endpoints directly',
      endpoints: {
        signUp: 'POST /api/auth/sign-up/email',
        signIn: 'POST /api/auth/sign-in/email',
        signOut: 'POST /api/auth/sign-out',
        getSession: 'GET /api/auth/get-session',
      },
    }), {
      detail: {
        tags: ['Auth'],
        summary: 'Auth endpoints info',
      },
    });
};

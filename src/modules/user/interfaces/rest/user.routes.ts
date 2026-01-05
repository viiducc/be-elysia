import { createBaseElysia } from '@@/shared/utils/base-elysia';
import { t } from 'elysia';
import type { Config } from '../../../../config/types';
import { auth } from '@/src/config/better-auth';

export const getUserRoutes = (config: Config) => {
  return createBaseElysia(config)
    // Get current user profile (requires auth)
    .get('/me', async ({ request, set }) => {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user) {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      return { user: session.user };
    }, {
      detail: {
        tags: ['Users'],
        summary: 'Get current user profile',
      },
    })
    // Get user by ID
    .get('/:id', async ({ params, set }) => {
      // TODO: Implement get user by ID from database
      return { userId: params.id, message: 'Get user by ID - not implemented' };
    }, {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ['Users'],
        summary: 'Get user by ID',
      },
    })
    // Update user profile
    .put('/me', async ({ request, body, set }) => {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user) {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      // TODO: Implement update user profile
      return {
        message: 'Profile update - not implemented',
        userId: session.user.id,
        updates: body,
      };
    }, {
      body: t.Object({
        email: t.Optional(t.String({ format: 'email' })),
        name: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Users'],
        summary: 'Update current user profile',
      },
    });
};

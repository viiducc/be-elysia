import { Elysia } from 'elysia';
import type { SharedConfig } from '../../config/types';
import { authConfig } from '../../src/config/auth.config';
import { fileConfig } from '../../src/config/file.config';
import { getAuthRoutes } from '../../src/modules/auth/interfaces/rest/auth.routes';
import { getConfigRoutes } from '../../src/modules/config/interfaces/rest/config.routes';
import { getFileRoutes } from '../../src/modules/file/interfaces/rest/file.routes';
import { getUserRoutes } from '../../src/modules/user/interfaces/rest/user.routes';

export const registerRoutes = (sharedConfig: SharedConfig) => {
  return (
    new Elysia()

      // Register services routes, these routes are independent of each other.
      // Not allow to share configs between services.
      .use(
        getAuthRoutes({
          ...sharedConfig,
          module: authConfig,
          prefix: '/auth',
          name: 'auth_service',
        }),
      )
      .use(
        getFileRoutes({
          ...sharedConfig,
          module: fileConfig,
          prefix: '/files',
          name: 'file_service',
        }),
      )
      .use(getUserRoutes({ ...sharedConfig, prefix: '/users', name: 'user_service' }))
      .use(getConfigRoutes({ ...sharedConfig, prefix: '/configs', name: 'config_service' }))
  );
};

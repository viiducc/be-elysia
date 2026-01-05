import { createBaseElysia } from '@/src/shared/utils/base-elysia';
import type { Config } from '../../../../config/types';
import { ConfigController } from './config.controller';

export const getConfigRoutes = (config: Config) => {
  const configController = new ConfigController();
  return createBaseElysia(config)
    .get('/', configController.getConfig, {
      detail: {
        tags: ['Config'],
        summary: 'Get application configuration',
      },
    });
};

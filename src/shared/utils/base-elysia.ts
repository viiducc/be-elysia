import { Elysia } from 'elysia';
import pino from 'pino';
import type { LoggerConfig } from '../../../config/types';
import type { Config } from '../../config/types';

export function createBaseElysia(config?: Config) {
  return new Elysia({
    name: config?.name ?? '',
    prefix: config?.prefix ?? '/',
  }).decorate('logger', createLogger(config?.logger ?? { level: 'info' }));
}

function createLogger(config: LoggerConfig) {
  return pino({
    name: 'agripos-api',
    level: config.level,
  });
}

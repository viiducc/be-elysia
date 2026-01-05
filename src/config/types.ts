import type { SharedConfig } from '../../config/types';

export type Config<T extends AuthConfig | FileConfig = any> = SharedConfig & {
  prefix?: string;
  name?: string;
  module?: T;
};

// TYPES
export interface FileConfig {
  maxFileSize: number;
}

export interface AuthConfig {
  serviceUrl: string;
  jwtSecret: string;
  jwtExpiration: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiration: string;
}

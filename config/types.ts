export interface DbConfig {
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
  ssl?: 'require' | 'allow' | 'prefer' | 'verify-full' | boolean | object;
  driver?: string;
  migrationsSchema?: string;
}

export interface LoggerConfig {
  level: string;
}

export interface AppConfig {
  port: number;
  env: string;
  version: string;
  publicUrl: string;
}

export interface SharedConfig {
  app: AppConfig;
  logger: LoggerConfig;
}

export interface EmailConfig {
  resendApiKey: string;
  fromEmail: string;
  fromName: string;
}

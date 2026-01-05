import postgres from 'postgres';
import type { DbConfig } from '../../../config/types';

export function create(config: DbConfig) {
  return postgres({
    host: config.host,
    port: config.port,
    db: config.name,
    username: config.username,
    password: config.password,
    ssl: config.ssl ? {
      rejectUnauthorized: false  // Allow self-signed certificates
    } : false,

    // Performance optimizations
    max: 10,                    // Connection pool size
    idle_timeout: 30,           // Close idle connections after 30s
    connect_timeout: 10,        // Connection timeout
    prepare: true,              // Use prepared statements
    transform: {
      undefined: null,          // Transform undefined to null
    },
  });
}

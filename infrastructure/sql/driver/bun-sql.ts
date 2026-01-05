import { SQL } from 'bun';
import type { DbConfig } from '../../../config/types';

export function create(config: DbConfig) {
  return new SQL({
    url: `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.name}`,

    host: config.host,
    port: config.port,
    database: config.name,
    username: config.username,
    password: config.password,
    ssl: config.ssl instanceof String ? config.ssl === 'true' : false,

    // Default options:
    idleTimeout: 30,

    onconnect: () => {
      console.log('Connected to PostgreSQL database');
    },
    onclose: () => {
      console.log('Connection closed');
    },
  });
}

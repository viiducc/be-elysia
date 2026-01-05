import path from 'node:path';
import { defineConfig } from 'drizzle-kit';
import { dbConfig } from '@/config/db.config';

console.log(path.relative(__dirname, './infrastructure/sql/drizzle-migrate/migrations'));

export default defineConfig({
  dialect: 'postgresql',
  schema: path.join(__dirname, './schema.ts'),
  out: './infrastructure/sql/drizzle-migrate/migrations',
  dbCredentials: {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.name,
    ssl: dbConfig.ssl,
  },
  migrations: {
    table: 'migrations',
    schema: dbConfig.migrationsSchema,
  },
});

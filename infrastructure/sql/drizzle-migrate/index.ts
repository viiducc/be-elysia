import path from 'node:path';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate as postgresMigrate } from 'drizzle-orm/postgres-js/migrator';
import { dbConfig } from '@/config/db.config';
import { sql as sqlClient } from '@/infrastructure/sql/db';

export async function migrate() {
  const db = drizzle({ client: sqlClient });
  await postgresMigrate(db, {
    migrationsFolder: path.join(__dirname, './migrations'),
    migrationsTable: 'migrations',
    migrationsSchema: dbConfig.migrationsSchema,
  });
}

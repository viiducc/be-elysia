import { dbConfig } from '../../config/db.config';
import type { DbConfig } from '../../config/types';
import { create as createBunSqlClient } from './driver/bun-sql';
import { create as createPostgresClient } from './driver/postgres';

function createSqlClient(config: DbConfig) {
  // if (config.driver === 'bun-sql') {
  //   return createBunSqlClient(config);
  // }

  /**
   * Between Postgres.js and pg (node-postgres), there's not much difference in performance (https://github.com/brianc/node-postgres/issues/3391)
   * So, use Postgres.js here as the default driver over Bun SQL (native) for its simple setup, support features, and usage.
   */
  return createPostgresClient(config);
}

export const sql = createSqlClient(dbConfig);

export const bunSql = createBunSqlClient(dbConfig);

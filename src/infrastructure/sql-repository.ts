import { DEFAULT_QUERY_PAGE, DEFAULT_QUERY_PER_PAGE, MAX_QUERY_PAGE, MAX_QUERY_PER_PAGE } from '@@/shared/constants/query.constant';
import type { StringLike } from 'bun';
import type { DBQueryConfig, InferInsertModel, InferSelectModel, Table } from 'drizzle-orm';
import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq, type SQL } from 'drizzle-orm/sql';
import type { TSchema } from 'elysia';
import { sql as sqlClient } from '@/infrastructure/sql/db';
import { ServerError } from '../shared/errors/error';
import { ErrorCodes } from '../shared/errors/error-codes.enum';

export interface IMapper<T> {
  // Domain to Database
  toPersistence(domain: T): InferInsertModel<Table>;
  // Database to Domain
  toDomain(dbResult: InferSelectModel<Table>): T;
  // For bulk operations
  toDomainList(dbResults: InferSelectModel<Table>[]): T[];
  // For updates (partial updates)
  toUpdatePersistence(domain: T): Partial<InferInsertModel<Table>>;
}

export interface IRepository<T> {
  create(domain: T): Promise<T>;
  update(domain: T): Promise<T>;
  delete(id: string, soft: boolean): Promise<void>;
  findById(id: StringLike): Promise<T | null>;
  findOne(config?: DBQueryConfig): Promise<T | null>;
  findMany(config?: DBQueryConfig): Promise<T[]>;
  findManyByPage(config?: Omit<DBQueryConfig<'many', true, TSchema>, 'limit'>, options?: OffsetPaginationOptions): Promise<PaginationResult<T>>;
  findManyByCursor(config?: Omit<DBQueryConfig<'many', true, TSchema>, 'limit'>, options?: CursorPaginationOptions): Promise<PaginationResult<T>>;
}

export abstract class SqlRepository<T> implements IRepository<T> {
  public readonly name: string;
  public readonly sql: typeof sqlClient;
  public readonly db: PostgresJsDatabase<Record<string, any>>;
  public readonly table: PgTableWithColumns<any>;
  public readonly schema: Record<string, PgTableWithColumns<any>>;
  public readonly mapper: IMapper<T>;

  constructor(schemaName: string, schema: Record<string, PgTableWithColumns<any>> = {}, mapper: IMapper<T>) {
    if (!schema[schemaName]) {
      throw new Error(`Table ${schemaName} not found in schema`);
    }

    this.name = schemaName;
    this.sql = sqlClient;
    this.db = drizzle({ client: sqlClient, schema: schema as any });
    this.table = schema[schemaName];
    this.schema = schema;
    this.mapper = mapper;
  }

  async create(domain: T): Promise<T> {
    try {
      const now = new Date();
      const persistence = this.mapper.toPersistence(domain);
      persistence.createdAt = now;
      persistence.updatedAt = now;
      const result = await this.db.insert(this.table).values(persistence).returning();
      domain = { ...domain, ...result[0] } as T;
      return domain;
    } catch (error: any) {
      throw new ServerError(500, ErrorCodes.DATABASE_ERROR, error.message);
    }
  }

  async update(domain: T): Promise<T> {
    try {
      const persistence = this.mapper.toUpdatePersistence(domain);
      persistence.updatedAt = new Date();
      const result = await this.db.update(this.table).set(persistence).returning();
      domain = { ...domain, ...result[0] } as T;
      return domain;
    } catch (error: any) {
      throw new ServerError(500, ErrorCodes.DATABASE_ERROR, error.message);
    }
  }

  async delete(id: string, soft: boolean = true): Promise<void> {
    try {
      if (soft) {
        await this.db.update(this.table).set({ deletedAt: new Date() }).where(eq(this.table.id, id));
      } else {
        await this.db.delete(this.table).where(eq(this.table.id, id));
      }
    } catch (error: any) {
      throw new ServerError(500, ErrorCodes.DATABASE_ERROR, error.message);
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const result = await this.db.query[this.name]?.findFirst({
        where: eq(this.table.id, id),
      });

      if (result) {
        return this.mapper.toDomain(result as any) as T;
      }

      return null;
    } catch (error: any) {
      throw new ServerError(500, ErrorCodes.DATABASE_ERROR, error.message);
    }
  }

  async findOne(config?: Omit<DBQueryConfig<'many', true, TSchema>, 'limit'>): Promise<T | null> {
    try {
      const result = await this.db.query[this.name]?.findFirst(config);

      if (result) {
        return this.mapper.toDomain(result as any) as T | null;
      }

      return null;
    } catch (error: any) {
      throw new ServerError(500, ErrorCodes.DATABASE_ERROR, error.message);
    }
  }

  async findMany(config?: DBQueryConfig): Promise<T[]> {
    try {
      const result = await this.db.query[this.name]?.findMany(config);
      if (result && result.length > 0) {
        return this.mapper.toDomainList(result) as T[];
      }
      return [];
    } catch (error: any) {
      throw new ServerError(500, ErrorCodes.DATABASE_ERROR, error.message);
    }
  }

  async findManyByCursor(
    config: Omit<DBQueryConfig<'many', true, TSchema>, 'limit'>,
    options: CursorPaginationOptions = new CursorPaginationOptions({}),
  ): Promise<PaginationResult<T>> {
    try {
      //   const limit = options.perPage;
      //   const result = await this.db.query[this.name]?.findMany({
      //     ...config,
      //     limit,
      //     cursor: options.cursor,
      //     orderBy: options.orderBy || [{ column: 'createdAt', order: 'desc' }],
      //   });
      //   if (result && result.length > 0) {
      //     return this.mapper.toDomainList(result as any) as T[];
      //   }
      return new PaginationResult<T>({
        items: [],
      });
    } catch (error: any) {
      throw new ServerError(500, ErrorCodes.DATABASE_ERROR, error.message);
    }
  }

  async findManyByPage(
    config: Omit<DBQueryConfig<'many', true, TSchema>, 'limit'>,
    options: OffsetPaginationOptions = new OffsetPaginationOptions({}),
  ): Promise<PaginationResult<T>> {
    try {
      // let countQuery: any;
      // if (options.count) {
      //   countQuery = options.count;
      // } else if (config.where) {
      //   countQuery = config.where;
      // } else {
      //   countQuery = sql`SELECT COUNT(*) FROM ${this.table}`;
      // }

      // Calculate pagination
      // const totalItems = this.db.$count(this.table, countQuery);
      // const totalItems = (await this.db.select({ count: count(lele?.toSQL()) })) as unknown as {
      //   count: number;
      // }[];
      // const whereClause = config.where?.toSQL();
      // const lele = this.db.$count(this.table, config);
      const offset = (options.page - 1) * options.perPage;
      const limit = options.perPage;
      // const sqlChunks: SQL[] = [query, sql`LIMIT ${options.perPage}`, sql`OFFSET ${start}`];

      // const finalQuery = sql.join(sqlChunks, sql.raw(' '));
      // const result = await this.db.execute(finalQuery);
      const result = await this.db.query[this.name]?.findMany({
        ...config,
        limit,
        offset,
        extras: {
          totalItems: this.db.$count(this.table).as('totalItems'),
        },
      });
      const totalItems = result?.[0]?.totalItems;

      return new PaginationResult({
        page: options.page,
        perPage: options.perPage,
        totalItems: totalItems ?? 0,
        items: this.mapper.toDomainList(result as any as InferSelectModel<Table>[]) as T[] | [],
      });
    } catch (error: any) {
      throw new ServerError(500, ErrorCodes.DATABASE_ERROR, error.message);
    }
  }
  // async findManyByPage(
  //   query: SQL | PaginationOptions = sql`SELECT * FROM ${this.table}`,
  //   options: PaginationOptions = new PaginationOptions({}),
  // ): Promise<PaginationResult<T>> {
  //   try {
  //     if (query instanceof PaginationOptions) {
  //       options = query;
  //       query = sql`SELECT * FROM ${this.table}` as SQL;
  //     }

  //     // Calculate pagination
  //     const totalItems = (await this.db.select({ count: count(query) })) as unknown as {
  //       count: number;
  //     }[];
  //     // const start = (options.page - 1) * options.perPage;
  //     // const end = start + options.perPage;

  //     const sqlChunks: SQL[] = [query, sql`LIMIT ${options.perPage}`, sql`OFFSET ${options.page}`];

  //     const finalQuery = sql.join(sqlChunks, sql.raw(' '));
  //     const result = await this.db.execute(finalQuery);

  //     return new PaginationResult({
  //       page: options.page,
  //       perPage: options.perPage,
  //       totalItems: totalItems[0]?.count ?? 0,
  //       items: this.mapper.toDomainList(result) as T[] | [],
  //     });
  //   } catch (error: any) {
  //     throw new ServerError(500, ErrorCodes.DATABASE_ERROR, error.message);
  //   }
  // }
}

export class CursorPaginationOptions {
  public readonly cursor?: string;
  public readonly limit?: number;

  constructor(
    options: {
      cursor?: string;
      limit?: number;
    } = {},
  ) {
    this.cursor = options.cursor;
    this.limit = options.limit;

    if (options.cursor) {
      this.cursor = options.cursor;
    }

    if (options.limit) {
      if (options.limit < 0) {
        this.limit = DEFAULT_QUERY_PER_PAGE;
      } else if (options.limit > MAX_QUERY_PER_PAGE) {
        this.limit = MAX_QUERY_PER_PAGE;
      }
    }
  }
}

export class OffsetPaginationOptions {
  public readonly page: number = 1;
  public readonly perPage: number = 10;
  public readonly count?: SQL;

  constructor(
    options: {
      count?: SQL;
      page?: number;
      perPage?: number;
    } = {},
  ) {
    this.count = options.count;
    this.page = options.page ?? DEFAULT_QUERY_PAGE;
    this.perPage = options.perPage ?? DEFAULT_QUERY_PER_PAGE;

    if (options.page) {
      if (options.page < 0) {
        this.page = DEFAULT_QUERY_PAGE;
      } else if (options.page > MAX_QUERY_PAGE) {
        this.page = MAX_QUERY_PAGE;
      }
    }

    if (options.perPage) {
      if (options.perPage < 0) {
        this.perPage = DEFAULT_QUERY_PER_PAGE;
      } else if (options.perPage > MAX_QUERY_PER_PAGE) {
        this.perPage = MAX_QUERY_PER_PAGE;
      }
    }
  }
}

export class PaginationResult<T> {
  // Offset-based pagination
  public readonly page?: number;
  public readonly perPage?: number;
  public readonly totalPages?: number;
  public readonly totalItems?: number;

  // Cursor-based pagination
  public readonly nextCursor?: string;
  public readonly prevCursor?: string;
  public readonly limit?: number;

  public readonly items: T[];

  constructor(options: {
    page?: number;
    perPage?: number;
    totalItems?: number;
    hasNextPage?: boolean;
    nextCursor?: string;
    prevCursor?: string;
    limit?: number;
    items: T[];
  }) {
    if (options.totalItems && options.perPage && options.page) {
      this.page = options.page;
      this.perPage = options.perPage;
      this.totalPages = Math.ceil(options.totalItems / options.perPage);
      this.totalItems = options.totalItems;
    } else if (options.nextCursor && options.limit) {
      this.nextCursor = options.nextCursor;
      this.prevCursor = options.prevCursor;
      this.limit = options.limit;
    } else {
      throw new ServerError(500, ErrorCodes.INVALID_INPUT, 'Invalid pagination options');
    }
    this.items = options.items;
  }
}

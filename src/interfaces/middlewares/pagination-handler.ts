import { Elysia } from 'elysia';

/**
 * @description Pagination handler middleware
 * @param query - Support both normal pagination (page, per_page) and cursor-based pagination (cursor, limit). Prefer to use cursor-based pagination.
 * @param set - Response set
 * @returns void
 */
// export const paginationHandler = new Elysia()
//   .onRequest(({ query, set }) => {
//     if (query.page) {
//       query.page = query.limit.toString();
//     } else {
//       query.page =
//     }
//     if (query.per_page) {
//       set.query.offset = query.offset.toString();
//     }
//   });

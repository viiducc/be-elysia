import { Elysia } from 'elysia';

export const errorMiddleware = new Elysia().onError(({ error, code, set }) => {
  set.status = 500;
  return {
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  };
});

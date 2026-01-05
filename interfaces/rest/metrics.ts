import { type Context, Elysia } from 'elysia';
import client from 'prom-client';

export const getMetricsRoute = () => {
  return new Elysia().get('/metrics', (ctx: Context) => {
    ctx.status(200);
    ctx.headers['Content-Type'] = client.register.contentType;
    return client.register.metrics();
  });
};

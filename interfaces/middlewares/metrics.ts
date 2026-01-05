import { Elysia } from 'elysia';
import client from 'prom-client';

// Initialize metrics collection
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Create custom HTTP metrics
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status_code'],
});

const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

// Middleware to track metrics for all requests
export const metricsMiddleware = new Elysia()
  .decorate('start', 0)
  .decorate('path', '')
  .onRequest(({ request, start, path }) => {
    start = Date.now();
    path = new URL(request.url).pathname;
  })
  .onAfterResponse(({ request, set, start, path }) => {
    const statusCode = set.status || 200;
    const duration = (Date.now() - start) / 1000;

    httpRequestsTotal.inc({ method: request.method, path, status_code: statusCode });
    httpRequestDurationSeconds.observe({ method: request.method, path, status_code: statusCode }, duration);
  });

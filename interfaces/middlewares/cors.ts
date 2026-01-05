import { cors } from '@elysiajs/cors';

const corsConfig = {
  origin: true, // Allow any origin but with credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  credentials: true, // Allow cookies to be sent
};

export const corsMiddleware = cors(corsConfig);

import { Elysia } from 'elysia';
import { appConfig } from './config/app.config';
import { loggerConfig } from './config/logger.config';
import type { SharedConfig } from './config/types';
import { migrate } from './infrastructure/sql/drizzle-migrate';
import { sql } from './infrastructure/sql/db';
import { corsMiddleware } from './interfaces/middlewares/cors';
import { errorMiddleware } from './interfaces/middlewares/error';
import { metricsMiddleware } from './interfaces/middlewares/metrics';
import { getMetricsRoute } from './interfaces/rest/metrics';
import { registerRoutes } from './interfaces/rest/routes';
import { getSwaggerRoute } from './interfaces/rest/swagger';
import { version } from './package.json' with { type: 'json' };
import { auth } from './src/config/better-auth';

/**
 * Better Auth macro for protected routes
 */
const betterAuthMacro = new Elysia({ name: 'better-auth-macro' })
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({ headers });
        if (!session) return status(401);
        return { user: session.user, session: session.session };
      },
    },
  });

export async function createApp() {
  const sharedConfig: SharedConfig = {
    app: appConfig,
    logger: loggerConfig,
  };

  // Run migrations
  await migrate();

  // Warm up database connection
  await sql`SELECT 1`;

  const app = new Elysia()
    .use(corsMiddleware)
    .use(metricsMiddleware)
    .use(errorMiddleware)
    .use(betterAuthMacro)
    .use(getSwaggerRoute())
    .use(getMetricsRoute())
    .get('/health', () => {
      return { status: 'ok', version };
    })
    // Better Auth handler - catch all /api/auth/* routes
    .all('/api/auth/*', async ({ request }) => {
      return auth.handler(request);
    })
    .group('/api/v1', (app) => app.use(registerRoutes(sharedConfig)));

  app.listen(sharedConfig.app.port);

  console.log(`Server running at http://localhost:${sharedConfig.app.port}`);

  return app;
}

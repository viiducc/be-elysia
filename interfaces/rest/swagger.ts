import { swagger } from '@elysiajs/swagger';

export const getSwaggerRoute = () =>
  swagger({
    documentation: {
      info: {
        title: 'Agripos API',
        version: '1.0.0',
      },
      tags: [
        { name: 'Better Auth', description: 'Auth endpoints at /api/auth/*' },
        { name: 'Auth', description: 'Auth info' },
        { name: 'Users', description: 'User management' },
        { name: 'Files', description: 'File upload/delete' },
        { name: 'Config', description: 'App configuration' },
      ],
      paths: {
        '/api/auth/sign-up/email': {
          post: {
            tags: ['Better Auth'],
            summary: 'Sign up with email',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      email: { type: 'string', format: 'email' },
                      password: { type: 'string', minLength: 8 },
                      name: { type: 'string' },
                    },
                    required: ['email', 'password', 'name'],
                  },
                },
              },
            },
            responses: {
              '200': { description: 'User created with session cookie' },
            },
          },
        },
        '/api/auth/sign-in/email': {
          post: {
            tags: ['Better Auth'],
            summary: 'Sign in with email',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      email: { type: 'string', format: 'email' },
                      password: { type: 'string' },
                    },
                    required: ['email', 'password'],
                  },
                },
              },
            },
            responses: {
              '200': { description: 'Session created with cookie' },
            },
          },
        },
        '/api/auth/session': {
          get: {
            tags: ['Better Auth'],
            summary: 'Get current session',
            responses: {
              '200': { description: 'Session and user info' },
            },
          },
        },
        '/api/auth/sign-out': {
          post: {
            tags: ['Better Auth'],
            summary: 'Sign out',
            responses: {
              '200': { description: 'Session cleared' },
            },
          },
        },
      },
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'agripos.session_token',
          },
        },
      },
    },
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

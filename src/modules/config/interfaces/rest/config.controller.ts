export class ConfigController {
  constructor() {}

  async getConfig() {
    return {
      success: true,
      data: {
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: {
          driver: process.env.DB_DRIVER || 'postgres',
          host: process.env.DB_HOST || 'localhost',
        },
      },
    };
  }
}

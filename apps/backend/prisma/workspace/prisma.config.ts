import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './models',
  migrations: {
    path: './migrations',
  },
  datasource: {
    url: env('COMPANY_DATABASE_URL'),
  },
});

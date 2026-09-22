import path from 'node:path';
import { existsSync } from 'node:fs';
import { defineConfig } from '@prisma/config';

if (existsSync('.env')) {
  process.loadEnvFile();
}

function migrationsUrl() {
  return process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
}

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: migrationsUrl(),
  },
  migrate: {
    async adapter() {
      const { PrismaPg } = await import('@prisma/adapter-pg');

      return new PrismaPg({ connectionString: migrationsUrl() });
    },
  },
});

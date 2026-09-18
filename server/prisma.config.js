import path from 'node:path';
import { existsSync } from 'node:fs';
import { defineConfig } from '@prisma/config';

if (existsSync('.env')) {
  process.loadEnvFile();
}

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrate: {
    async adapter() {
      const { PrismaPg } = await import('@prisma/adapter-pg');

      return new PrismaPg({ connectionString: process.env.DATABASE_URL });
    },
  },
});

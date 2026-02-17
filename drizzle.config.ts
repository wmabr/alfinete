import { env } from '@/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: './src/database/migrations',
  schema: './src/database/schema/index.ts',
  casing: 'snake_case',
})

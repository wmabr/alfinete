import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .optional()
    .default('development'),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().nonempty(),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),
  RESEND_API_KEY: z.string().nonempty(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  throw new Error('Invalid environment variables.')
}

export const env = _env.data

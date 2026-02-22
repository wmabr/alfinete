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
  CLOUDFLARE_ACCOUNT_ID: z.string().nonempty(),
  AWS_BUCKET_NAME: z.string().nonempty(),
  AWS_ACCESS_KEY_ID: z.string().nonempty(),
  AWS_SECRET_ACCESS_KEY: z.string().nonempty(),
  R2_PUBLIC_URL: z.url(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  throw new Error('Invalid environment variables.')
}

export const env = _env.data

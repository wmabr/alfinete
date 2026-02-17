import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/database'
import { magicLink } from 'better-auth/plugins'
import { resend } from './resend'
import { env } from '@/env'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  basePath: '/api/v1/auth',
  plugins: [
    magicLink({
      disableSignUp: true,
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: 'Alfinete <alfinete@wmapersonalizados.com.br>',
          to: email,
          subject: 'Seu link de acesso',
          html: `<p><a href="${url}">Clique aqui</a> para acessar o Alfinete.</p>`,
        })
      },
    }),
  ],
})

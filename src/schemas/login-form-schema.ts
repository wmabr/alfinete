import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z
    .email({ error: 'E-mail inválido' })
    .endsWith('@wmapersonalizados.com.br', { error: 'E-mail não autorizado' }),
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>

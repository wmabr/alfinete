import { z } from 'zod'

const typeLimits = {
  TOAST: { title: 30, content: 70 },
  MODAL: { title: 80, content: 350 },
  BANNER: { title: 40, content: 140 },
}

export const editNoticeFormSchema = z
  .object({
    title: z.string().min(1, { error: 'O título é obrigatório' }),
    content: z.string(),
    imageId: z.string(),
    type: z.enum(['TOAST', 'MODAL', 'BANNER']),
    status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']),
    dismissible: z.boolean(),
    startDate: z.string().min(1, { error: 'Data de início obrigatória' }),
    endDate: z.string().min(1, { error: 'Data de expiração obrigatória' }),
  })
  .superRefine((data, ctx) => {
    const limits = typeLimits[data.type]

    if (data.title.length > limits.title) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['title'],
        message: `Máximo de ${limits.title} caracteres para avisos do tipo ${data.type}`,
      })
    }

    if (data.content.length > limits.content) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['content'],
        message: `Máximo de ${limits.content} caracteres para avisos do tipo ${data.type}`,
      })
    }
  })

export type EditNoticeFormSchema = z.infer<typeof editNoticeFormSchema>

export { typeLimits }

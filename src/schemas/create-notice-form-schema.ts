import { z } from 'zod'

export const createNoticeFormSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  imageId: z.string(),
  type: z.enum(['TOAST', 'MODAL', 'BANNER']),
  status: z.enum(['DRAFT', 'ACTIVE']),
  dismissible: z.boolean(),
  startDate: z.string().min(1, { error: 'Data de início obrigatória' }),
  endDate: z.string().min(1, { error: 'Data de expiração obrigatória' }),
})

export type CreateNoticeFormSchema = z.infer<typeof createNoticeFormSchema>

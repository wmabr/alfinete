import { z } from 'zod'

export const createNoticeFormSchema = z.object({
  title: z.string().nonempty(),
  content: z.string(),
  imageId: z.string(),
  type: z.enum(['TOAST', 'MODAL', 'BANNER']),
  status: z.enum(['DRAFT', 'ACTIVE']),
  dismissible: z.boolean(),
  startDate: z.date(),
  endDate: z.date(),
})

export type CreateNoticeFormSchema = z.infer<typeof createNoticeFormSchema>

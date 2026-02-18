import { z } from 'zod'

export const noticeListItemSchema = z.object({
  id: z.uuid(),
  authorImageUrl: z.url().optional(),
  title: z.string(),
  type: z.enum(['TOAST', 'MODAL', 'BANNER']),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']),
})

export const noticeListSchema = z.object({
  notices: z.array(noticeListItemSchema),
  currentPage: z.number(),
  totalPages: z.number(),
  totalCount: z.number(),
})

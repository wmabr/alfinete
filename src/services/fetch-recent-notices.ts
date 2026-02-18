'use server'

import { db } from '@/database'
import { notices } from '@/database/schema'
import { user } from '@/database/schema/users'
import { eq, count, desc } from 'drizzle-orm'

interface FetchRecentNoticesParams {
  page?: number
  itemsPerPage?: number
}

export async function fetchRecentNotices({
  page = 1,
  itemsPerPage = 50,
}: FetchRecentNoticesParams) {
  const offset = (page - 1) * itemsPerPage

  const [items, [{ total }]] = await Promise.all([
    db
      .select({
        id: notices.id,
        authorImageUrl: user.image,
        title: notices.title,
        type: notices.type,
        startDate: notices.startDate,
        endDate: notices.endDate,
        status: notices.status,
      })
      .from(notices)
      .leftJoin(user, eq(notices.authorId, user.id))
      .orderBy(desc(notices.createdAt))
      .limit(itemsPerPage)
      .offset(offset),
    db.select({ total: count() }).from(notices),
  ])

  const totalPages = Math.ceil(total / itemsPerPage)

  return {
    notices: items.map((item) => ({
      ...item,
      authorImageUrl: item.authorImageUrl ?? undefined,
    })),
    currentPage: page,
    totalPages,
    totalCount: total,
  }
}

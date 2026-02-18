import { db } from '@/database'
import { images, notices } from '@/database/schema'
import { and, eq, gte, lte } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: implement cache with Redis

  const now = new Date()

  const result = await db
    .select({
      title: notices.title,
      content: notices.content,
      type: notices.type,
      dismissible: notices.dismissible,
      imageUrl: images.url,
    })
    .from(notices)
    .leftJoin(images, eq(notices.imageId, images.id))
    .where(
      and(
        eq(notices.status, 'ACTIVE'),
        lte(notices.startDate, now),
        gte(notices.endDate, now),
      ),
    )

  return Response.json({ notices: result }, { status: 200 })
}

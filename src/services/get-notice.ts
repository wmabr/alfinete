'use server'

import { db } from '@/database'
import { notices } from '@/database/schema'
import { images } from '@/database/schema/images'
import { eq } from 'drizzle-orm'

export async function getNotice(id: string) {
  const [notice] = await db
    .select({
      id: notices.id,
      title: notices.title,
      content: notices.content,
      type: notices.type,
      status: notices.status,
      dismissible: notices.dismissible,
      startDate: notices.startDate,
      endDate: notices.endDate,
      imageId: notices.imageId,
      imageUrl: images.url,
    })
    .from(notices)
    .leftJoin(images, eq(notices.imageId, images.id))
    .where(eq(notices.id, id))

  return notice ?? null
}

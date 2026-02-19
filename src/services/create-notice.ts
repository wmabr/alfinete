'use server'

import { db } from '@/database'
import { notices } from '@/database/schema'
import { auth } from '@/lib/auth'
import { EditNoticeFormSchema } from '@/schemas/edit-notice-form-schema'
import { headers } from 'next/headers'

export async function createNotice(data: EditNoticeFormSchema) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error('Unauthorized')
  }

  const [notice] = await db
    .insert(notices)
    .values({
      authorId: session.user.id,
      title: data.title,
      content: data.content,
      imageId: data.imageId || null,
      type: data.type,
      status: data.status,
      dismissible: data.dismissible,
      startDate: new Date(data.startDate + 'T00:00:00-03:00'),
      endDate: new Date(data.endDate + 'T23:59:59-03:00'),
    })
    .returning({ id: notices.id })

  return notice
}

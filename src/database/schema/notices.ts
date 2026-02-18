import { boolean, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from './users'
import { relations } from 'drizzle-orm'
import { images } from './images'

export const noticeTypeEnum = pgEnum('notice_type_enum', [
  'TOAST',
  'MODAL',
  'BANNER',
])

export const noticeStatusEnum = pgEnum('notices_status_enum', [
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'ARCHIVED',
])

export const notices = pgTable('notices', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  authorId: text('author_id')
    .references(() => user.id)
    .notNull(),
  title: text('title').notNull(),
  content: text('content'),
  imageId: text('image_id').references(() => images.id, {
    onDelete: 'set null',
  }),
  type: noticeTypeEnum('type').notNull(),
  status: noticeStatusEnum('status').notNull().default('DRAFT'),
  dismissible: boolean('dismissible').notNull().default(false),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const noticesRelations = relations(notices, ({ one }) => ({
  users: one(user, {
    fields: [notices.authorId],
    references: [user.id],
  }),
  images: one(images, {
    fields: [notices.imageId],
    references: [images.id],
  }),
}))

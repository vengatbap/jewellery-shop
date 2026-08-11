import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { customerProfiles } from './customer_profiles';

export const customerInteractions = pgTable('customer_interactions', {
    id: uuid('id').defaultRandom().primaryKey(),
    customerId: uuid('customer_id').notNull().references(() => customerProfiles.id, { onDelete: 'cascade' }),
    interactionType: varchar('interaction_type', { length: 50 }).notNull(), // CALL | EMAIL | SMS | IN_STORE
    notes: text('notes').notNull(),
    createdBy: uuid('created_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    customerIdx: index('idx_customer_interactions_customer').on(table.customerId),
}));

import { pgTable, uuid, varchar, text, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations';

export const customerProfiles = pgTable('customer_profiles', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    customerCode: varchar('customer_code', { length: 50 }).notNull(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 50 }),
    cprCivilId: varchar('cpr_civil_id', { length: 50 }),
    vipTier: varchar('vip_tier', { length: 20 }).default('STANDARD').notNull(), // STANDARD | SILVER | GOLD | PLATINUM
    loyaltyPointsBalance: integer('loyalty_points_balance').default(0).notNull(),
    preferredMetalId: uuid('preferred_metal_id'),
    address: text('address'),
    status: varchar('status', { length: 20 }).default('ACTIVE').notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgCodeIdx: index('idx_customer_profiles_org_code').on(table.organizationId, table.customerCode),
    cprIdx: index('idx_customer_profiles_cpr').on(table.organizationId, table.cprCivilId),
    phoneIdx: index('idx_customer_profiles_phone').on(table.organizationId, table.phone),
}));

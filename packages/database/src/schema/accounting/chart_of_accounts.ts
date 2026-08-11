import { pgTable, uuid, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations';

export const chartOfAccounts = pgTable('chart_of_accounts', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    accountCode: varchar('account_code', { length: 50 }).notNull(),
    accountName: varchar('account_name', { length: 255 }).notNull(),
    accountType: varchar('account_type', { length: 30 }).notNull(), // ASSET | LIABILITY | EQUITY | REVENUE | EXPENSE
    parentAccountId: uuid('parent_account_id'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgCodeIdx: index('idx_coa_org_code').on(table.organizationId, table.accountCode),
    orgTypeIdx: index('idx_coa_org_type').on(table.organizationId, table.accountType),
}));

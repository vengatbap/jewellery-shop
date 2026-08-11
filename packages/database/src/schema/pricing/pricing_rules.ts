import { pgTable, uuid, varchar, numeric, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations';

export const pricingRules = pgTable('pricing_rules', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    ruleType: varchar('rule_type', { length: 50 }).notNull(), // MAKING_CHARGE | WASTAGE | DISCOUNT
    valueType: varchar('value_type', { length: 20 }).default('PERCENTAGE').notNull(), // PERCENTAGE | FIXED_PER_GRAM | FIXED_TOTAL
    value: numeric('value', { precision: 12, scale: 2 }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgRuleIdx: index('idx_pricing_rules_org').on(table.organizationId, table.ruleType),
}));

import { pgTable, uuid, varchar, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { onlineStores } from './online_stores.js';
import { customerProfiles } from '../crm/customer_profiles.js';

export const onlineOrders = pgTable('online_orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    storeId: uuid('store_id').notNull().references(() => onlineStores.id),
    customerId: uuid('customer_id').references(() => customerProfiles.id),
    orderNumber: varchar('order_number', { length: 50 }).notNull(),
    subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
    shippingFee: numeric('shipping_fee', { precision: 12, scale: 2 }).default('0.00').notNull(),
    taxAmount: numeric('tax_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    grandTotal: numeric('grand_total', { precision: 12, scale: 2 }).notNull(),
    paymentGateway: varchar('payment_gateway', { length: 50 }).notNull(), // BENEFIT_PAY | TAP | CHECKOUT_COM
    paymentStatus: varchar('payment_status', { length: 20 }).default('PENDING').notNull(), // PENDING | PAID | FAILED
    fulfillmentStatus: varchar('fulfillment_status', { length: 20 }).default('UNFULFILLED').notNull(), // UNFULFILLED | PROCESSING | SHIPPED | DELIVERED
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgOrderNoIdx: index('idx_online_orders_org_no').on(table.organizationId, table.orderNumber),
}));

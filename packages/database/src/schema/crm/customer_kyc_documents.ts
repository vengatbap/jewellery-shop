import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { customerProfiles } from './customer_profiles';

export const customerKycDocuments = pgTable('customer_kyc_documents', {
    id: uuid('id').defaultRandom().primaryKey(),
    customerId: uuid('customer_id').notNull().references(() => customerProfiles.id, { onDelete: 'cascade' }),
    documentType: varchar('document_type', { length: 50 }).notNull(), // CIVIL_ID | PASSPORT | CR_LICENSE
    documentNumber: varchar('document_number', { length: 100 }).notNull(),
    expiryDate: timestamp('expiry_date', { withTimezone: true }),
    verificationStatus: varchar('verification_status', { length: 20 }).default('PENDING').notNull(), // PENDING | VERIFIED | REJECTED
    mediaUrl: text('media_url'),
    verifiedBy: uuid('verified_by'),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    customerIdx: index('idx_customer_kyc_customer').on(table.customerId),
}));

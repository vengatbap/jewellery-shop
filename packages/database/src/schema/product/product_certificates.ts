import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { productVariants } from './product_variants.js';

export const productCertificates = pgTable('product_certificates', {
    id: uuid('id').defaultRandom().primaryKey(),
    variantId: uuid('variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
    certificateNumber: varchar('certificate_number', { length: 100 }).notNull(),
    labName: varchar('lab_name', { length: 100 }), // GIA | IGI | HRD | SGL
    certificateType: varchar('certificate_type', { length: 50 }),
    issueDate: timestamp('issue_date'),
    fileUrl: varchar('file_url', { length: 500 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    variantIdx: index('idx_product_certificates_variant').on(table.variantId),
    certNoIdx: index('idx_product_certificates_number').on(table.certificateNumber),
}));

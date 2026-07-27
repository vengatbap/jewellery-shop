import { pgTable, uuid, index } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, catalogColumns } from '../../shared/index';

export const certificateTypes = pgTable(
    'certificate_types',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_certificate_types_code').on(table.code),
    })
);

export type CertificateType = typeof certificateTypes.$inferSelect;
export type NewCertificateType = typeof certificateTypes.$inferInsert;

import {
    pgTable,
    text,
    varchar,
    jsonb,
    foreignKey,
    index,
} from 'drizzle-orm/pg-core';
import {
    primaryId,
    organizationId,
} from '../shared/common';
import { organizations } from '../platform/organizations';

export const auditLogs = pgTable(
    'audit_logs',
    {
        id: primaryId,
        organizationId: organizationId,
        branchId: varchar('branch_id', { length: 36 }),
        userId: varchar('user_id', { length: 36 }),
        module: varchar('module', { length: 50 }).notNull(),
        action: varchar('action', { length: 50 }).notNull(),
        tableName: varchar('table_name', { length: 100 }).notNull(),
        recordId: varchar('record_id', { length: 36 }).notNull(),
        oldValue: jsonb('old_value'),
        newValue: jsonb('new_value'),
        ipAddress: varchar('ip_address', { length: 45 }),
        userAgent: text('user_agent'),
        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => ({
        fkOrganization: foreignKey({
            columns: [table.organizationId],
            foreignColumns: [organizations.id],
        }).onDelete('restrict'),
        idxOrganization: index('idx_audit_logs_organization_id').on(
            table.organizationId
        ),
        idxBranch: index('idx_audit_logs_branch_id').on(table.branchId),
        idxUser: index('idx_audit_logs_user_id').on(table.userId),
        idxModule: index('idx_audit_logs_module').on(table.module),
        idxAction: index('idx_audit_logs_action').on(table.action),
        idxTable: index('idx_audit_logs_table_name').on(table.tableName),
        idxCreatedAt: index('idx_audit_logs_created_at').on(table.createdAt),
    })
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

import { timestamp } from 'drizzle-orm/pg-core';

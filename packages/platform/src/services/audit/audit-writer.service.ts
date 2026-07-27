import { db } from '@auric-one/database';
import { auditLogs } from '@auric-one/database/schema';

export interface AuditLogData {
    organizationId: string;
    branchId?: string;
    actorId?: string;
    action: string;
    module: string;
    tableName: string;
    recordId: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    userAgent?: string;
}

export class AuditWriter {
    static async write(data: AuditLogData): Promise<void> {
        console.log(`📝 [AuditWriter] Writing audit log for action: ${data.action} on ${data.tableName}/${data.recordId}`);
        await db
            .insert(auditLogs)
            .values({
                organizationId: data.organizationId,
                branchId: data.branchId,
                userId: data.actorId,
                action: data.action,
                module: data.module,
                tableName: data.tableName,
                recordId: data.recordId,
                oldValue: data.oldValue,
                newValue: data.newValue,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
            });
    }
}

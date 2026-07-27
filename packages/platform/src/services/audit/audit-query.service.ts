import { db } from '@auric-one/database';
import { auditLogs } from '@auric-one/database/schema';
import { eq, and, desc } from 'drizzle-orm';

export class AuditQuery {
    static async getEntityHistory(organizationId: string, tableName: string, recordId: string): Promise<any[]> {
        console.log(`📝 [AuditQuery] Fetching change history for ${tableName}/${recordId}`);
        return db
            .select()
            .from(auditLogs)
            .where(
                and(
                    eq(auditLogs.organizationId, organizationId),
                    eq(auditLogs.tableName, tableName),
                    eq(auditLogs.recordId, recordId)
                )
            )
            .orderBy(desc(auditLogs.createdAt));
    }

    static async getActorTimeline(organizationId: string, actorId: string): Promise<any[]> {
        console.log(`📝 [AuditQuery] Fetching timeline for actor: ${actorId}`);
        return db
            .select()
            .from(auditLogs)
            .where(
                and(
                    eq(auditLogs.organizationId, organizationId),
                    eq(auditLogs.userId, actorId)
                )
            )
            .orderBy(desc(auditLogs.createdAt));
    }
}

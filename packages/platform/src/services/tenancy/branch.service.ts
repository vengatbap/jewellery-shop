import { db } from '@auric-one/database';
import { branches, sessions } from '@auric-one/database/schema';
import { eq, and } from 'drizzle-orm';
import { generateBusinessIdentifier } from '../identifier';

export class BranchService {
    static async create(organizationId: string, data: { name: string; code: string; managerName?: string; email?: string; phone?: string }): Promise<any> {
        const businessId = generateBusinessIdentifier('BRANCH', { counter: Date.now() });
        const [branch] = await db
            .insert(branches)
            .values({
                businessId,
                organizationId,
                name: data.name,
                code: data.code,
                managerName: data.managerName,
                email: data.email,
                phone: data.phone,
                status: 'ACTIVE',
            })
            .returning();
        return branch;
    }

    static async switchBranch(sessionId: string, branchId: string): Promise<void> {
        const [branch] = await db
            .select()
            .from(branches)
            .where(
                and(
                    eq(branches.id, branchId),
                    eq(branches.status, 'ACTIVE')
                )
            );

        if (!branch) {
            throw new Error('Branch not found or inactive');
        }

        await db
            .update(sessions)
            .set({ currentBranchId: branchId })
            .where(eq(sessions.id, sessionId));
    }

    static async getById(branchId: string): Promise<any> {
        const [branch] = await db
            .select()
            .from(branches)
            .where(eq(branches.id, branchId));
        return branch || null;
    }
}

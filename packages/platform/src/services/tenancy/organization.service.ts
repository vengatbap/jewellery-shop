import { db } from '@auric-one/database';
import { organizations } from '@auric-one/database/schema';
import { eq } from 'drizzle-orm';
import { generateBusinessIdentifier } from '../identifier';

export class OrganizationService {
    static async create(data: { name: string; legalName: string; currency: string; timezone: string; country: string }): Promise<any> {
        const businessId = generateBusinessIdentifier('ORGANIZATION', { counter: Date.now() });
        const [org] = await db
            .insert(organizations)
            .values({
                businessId,
                name: data.name,
                legalName: data.legalName,
                currency: data.currency,
                timezone: data.timezone,
                country: data.country,
                status: 'ACTIVE',
            })
            .returning();
        return org;
    }

    static async getById(orgId: string): Promise<any> {
        const [org] = await db
            .select()
            .from(organizations)
            .where(eq(organizations.id, orgId));
        return org || null;
    }

    static async updateStatus(orgId: string, status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED'): Promise<void> {
        await db
            .update(organizations)
            .set({ status })
            .where(eq(organizations.id, orgId));
    }
}

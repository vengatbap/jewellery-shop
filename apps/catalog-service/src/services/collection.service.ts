import { CollectionRepository } from '../repositories/collection.repository';
import { cacheManager } from '@auric-one/cache';
import { EventPublisher } from '../events/event.publisher';
import { CatalogQueryParams } from '../repositories/query.helper';
import { collections } from '@auric-one/database';

export class CollectionService {
    private repo = new CollectionRepository();

    private getCacheKey(orgId: string, suffix: string) {
        return `catalog:tenant:${orgId}:v1:collections:${suffix}`;
    }

    private async invalidateCache(orgId: string) {
        await cacheManager.delByPrefix(`catalog:tenant:${orgId}:v1:collections`);
    }

    async getById(id: string, orgId: string) {
        const cacheKey = this.getCacheKey(orgId, `id:${id}`);
        const cached = await cacheManager.get<any>(cacheKey);
        if (cached) return cached;

        const collection = await this.repo.findById(id, orgId);
        if (collection) {
            await cacheManager.set(cacheKey, collection, 300);
        }
        return collection;
    }

    async getMany(params: CatalogQueryParams, orgId: string) {
        const cacheKey = this.getCacheKey(orgId, `list:${JSON.stringify(params)}`);
        const cached = await cacheManager.get<{ data: any[]; total: number }>(cacheKey);
        if (cached) return cached;

        const data = await this.repo.findMany(params, orgId);
        const total = await this.repo.count(params, orgId);
        const result = { data, total };

        await cacheManager.set(cacheKey, result, 300);
        return result;
    }

    async create(data: typeof collections.$inferInsert, userId?: string) {
        const collection = await this.repo.create(data);
        await this.invalidateCache(data.organizationId);
        await EventPublisher.publishCatalogChanged({
            entity: 'collections',
            action: 'CREATE',
            organizationId: data.organizationId,
            payload: collection,
            userId
        });
        return collection;
    }

    async update(id: string, orgId: string, data: Partial<typeof collections.$inferInsert>, version: number, userId?: string) {
        const collection = await this.repo.update(id, orgId, data, version);
        if (!collection) return null;

        await this.invalidateCache(orgId);
        await EventPublisher.publishCatalogChanged({
            entity: 'collections',
            action: 'UPDATE',
            organizationId: orgId,
            payload: collection,
            userId
        });
        return collection;
    }

    async delete(id: string, orgId: string, userId?: string) {
        const collection = await this.repo.delete(id, orgId);
        if (!collection) return null;

        await this.invalidateCache(orgId);
        await EventPublisher.publishCatalogChanged({
            entity: 'collections',
            action: 'DELETE',
            organizationId: orgId,
            payload: collection,
            userId
        });
        return collection;
    }
}

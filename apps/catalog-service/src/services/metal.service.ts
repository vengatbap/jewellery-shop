import { MetalRepository } from '../repositories/metal.repository';
import { cacheManager } from '@auric-one/cache';
import { EventPublisher } from '../events/event.publisher';
import { CatalogQueryParams } from '../repositories/query.helper';
import { metals } from '@auric-one/database';

export class MetalService {
    private repo = new MetalRepository();

    private getCacheKey(suffix: string) {
        return `catalog:industry:v1:metals:${suffix}`;
    }

    private async invalidateCache() {
        await cacheManager.delByPrefix(`catalog:industry:v1:metals`);
    }

    async getById(id: string) {
        const cacheKey = this.getCacheKey(`id:${id}`);
        const cached = await cacheManager.get<any>(cacheKey);
        if (cached) return cached;

        const metal = await this.repo.findById(id);
        if (metal) {
            await cacheManager.set(cacheKey, metal, 300);
        }
        return metal;
    }

    async getMany(params: CatalogQueryParams) {
        const cacheKey = this.getCacheKey(`list:${JSON.stringify(params)}`);
        const cached = await cacheManager.get<{ data: any[]; total: number }>(cacheKey);
        if (cached) return cached;

        const data = await this.repo.findMany(params);
        const total = await this.repo.count(params);
        const result = { data, total };

        await cacheManager.set(cacheKey, result, 300);
        return result;
    }

    async create(data: typeof metals.$inferInsert, userId?: string) {
        const metal = await this.repo.create(data);
        await this.invalidateCache();
        await EventPublisher.publishCatalogChanged({
            entity: 'metals',
            action: 'CREATE',
            payload: metal,
            userId
        });
        return metal;
    }

    async update(id: string, data: Partial<typeof metals.$inferInsert>, version: number, userId?: string) {
        const metal = await this.repo.update(id, data, version);
        if (!metal) return null;

        await this.invalidateCache();
        await EventPublisher.publishCatalogChanged({
            entity: 'metals',
            action: 'UPDATE',
            payload: metal,
            userId
        });
        return metal;
    }

    async delete(id: string, userId?: string) {
        const metal = await this.repo.delete(id);
        if (!metal) return null;

        await this.invalidateCache();
        await EventPublisher.publishCatalogChanged({
            entity: 'metals',
            action: 'DELETE',
            payload: metal,
            userId
        });
        return metal;
    }
}

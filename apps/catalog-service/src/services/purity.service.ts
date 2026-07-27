import { PurityRepository } from '../repositories/purity.repository';
import { cacheManager } from '@auric-one/cache';
import { EventPublisher } from '../events/event.publisher';
import { CatalogQueryParams } from '../repositories/query.helper';
import { purities } from '@auric-one/database';

export class PurityService {
    private repo = new PurityRepository();

    private getCacheKey(suffix: string) {
        return `catalog:industry:v1:purities:${suffix}`;
    }

    private async invalidateCache() {
        await cacheManager.delByPrefix(`catalog:industry:v1:purities`);
    }

    async getById(id: string) {
        const cacheKey = this.getCacheKey(`id:${id}`);
        const cached = await cacheManager.get<any>(cacheKey);
        if (cached) return cached;

        const purity = await this.repo.findById(id);
        if (purity) {
            await cacheManager.set(cacheKey, purity, 300);
        }
        return purity;
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

    async create(data: typeof purities.$inferInsert, userId?: string) {
        const purity = await this.repo.create(data);
        await this.invalidateCache();
        await EventPublisher.publishCatalogChanged({
            entity: 'purities',
            action: 'CREATE',
            payload: purity,
            userId
        });
        return purity;
    }

    async update(id: string, data: Partial<typeof purities.$inferInsert>, version: number, userId?: string) {
        const purity = await this.repo.update(id, data, version);
        if (!purity) return null;

        await this.invalidateCache();
        await EventPublisher.publishCatalogChanged({
            entity: 'purities',
            action: 'UPDATE',
            payload: purity,
            userId
        });
        return purity;
    }

    async delete(id: string, userId?: string) {
        const purity = await this.repo.delete(id);
        if (!purity) return null;

        await this.invalidateCache();
        await EventPublisher.publishCatalogChanged({
            entity: 'purities',
            action: 'DELETE',
            payload: purity,
            userId
        });
        return purity;
    }
}

import { BrandRepository } from '../repositories/brand.repository';
import { cacheManager } from '@auric-one/cache';
import { EventPublisher } from '../events/event.publisher';
import { CatalogQueryParams } from '../repositories/query.helper';
import { brands } from '@auric-one/database';

export class BrandService {
    private repo = new BrandRepository();

    private getCacheKey(orgId: string, suffix: string) {
        return `catalog:tenant:${orgId}:v1:brands:${suffix}`;
    }

    private async invalidateCache(orgId: string) {
        await cacheManager.delByPrefix(`catalog:tenant:${orgId}:v1:brands`);
    }

    async getById(id: string, orgId: string) {
        const cacheKey = this.getCacheKey(orgId, `id:${id}`);
        const cached = await cacheManager.get<any>(cacheKey);
        if (cached) return cached;

        const brand = await this.repo.findById(id, orgId);
        if (brand) {
            await cacheManager.set(cacheKey, brand, 300);
        }
        return brand;
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

    async create(data: typeof brands.$inferInsert, userId?: string) {
        const brand = await this.repo.create(data);
        await this.invalidateCache(data.organizationId);
        await EventPublisher.publishCatalogChanged({
            entity: 'brands',
            action: 'CREATE',
            organizationId: data.organizationId,
            payload: brand,
            userId
        });
        return brand;
    }

    async update(id: string, orgId: string, data: Partial<typeof brands.$inferInsert>, version: number, userId?: string) {
        const brand = await this.repo.update(id, orgId, data, version);
        if (!brand) return null;

        await this.invalidateCache(orgId);
        await EventPublisher.publishCatalogChanged({
            entity: 'brands',
            action: 'UPDATE',
            organizationId: orgId,
            payload: brand,
            userId
        });
        return brand;
    }

    async delete(id: string, orgId: string, userId?: string) {
        const brand = await this.repo.delete(id, orgId);
        if (!brand) return null;

        await this.invalidateCache(orgId);
        await EventPublisher.publishCatalogChanged({
            entity: 'brands',
            action: 'DELETE',
            organizationId: orgId,
            payload: brand,
            userId
        });
        return brand;
    }
}

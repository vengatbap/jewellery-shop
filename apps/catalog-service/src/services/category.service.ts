import { CategoryRepository } from '../repositories/category.repository';
import { cacheManager } from '@auric-one/cache';
import { EventPublisher } from '../events/event.publisher';
import { CatalogQueryParams } from '../repositories/query.helper';
import { productCategories } from '@auric-one/database';

export class CategoryService {
    private repo = new CategoryRepository();

    private getCacheKey(orgId: string, suffix: string) {
        return `catalog:tenant:${orgId}:v1:categories:${suffix}`;
    }

    private async invalidateCache(orgId: string) {
        await cacheManager.delByPrefix(`catalog:tenant:${orgId}:v1:categories`);
    }

    private taxonomyLevels = ['CATEGORY', 'SUBCATEGORY', 'FAMILY', 'TYPE', 'TEMPLATE'];

    private validateHierarchy(level: string, parentLevel?: string) {
        if (level === 'CATEGORY') {
            if (parentLevel) {
                throw new Error('A top-level CATEGORY cannot have a parent category.');
            }
            return;
        }

        if (!parentLevel) {
            throw new Error(`A ${level} must have a parent category.`);
        }

        const currentIdx = this.taxonomyLevels.indexOf(level);
        const parentIdx = this.taxonomyLevels.indexOf(parentLevel);

        if (currentIdx === -1 || parentIdx === -1) {
            throw new Error('Invalid taxonomy level.');
        }

        if (parentIdx !== currentIdx - 1) {
            throw new Error(`Parent category level must be "${this.taxonomyLevels[currentIdx - 1]}" for current level "${level}". Got "${parentLevel}".`);
        }
    }

    async getById(id: string, orgId: string) {
        const cacheKey = this.getCacheKey(orgId, `id:${id}`);
        const cached = await cacheManager.get<any>(cacheKey);
        if (cached) return cached;

        const category = await this.repo.findById(id, orgId);
        if (category) {
            await cacheManager.set(cacheKey, category, 300);
        }
        return category;
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

    async create(data: typeof productCategories.$inferInsert, userId?: string) {
        const level = data.taxonomyLevel || 'CATEGORY';
        if (data.parentId) {
            const parent = await this.repo.findById(data.parentId, data.organizationId);
            if (!parent) {
                throw new Error('Parent category not found.');
            }
            this.validateHierarchy(level, parent.taxonomyLevel);
        } else {
            this.validateHierarchy(level);
        }

        const category = await this.repo.create(data);
        await this.invalidateCache(data.organizationId);
        await EventPublisher.publishCatalogChanged({
            entity: 'categories',
            action: 'CREATE',
            organizationId: data.organizationId,
            payload: category,
            userId
        });
        return category;
    }

    async update(id: string, orgId: string, data: Partial<typeof productCategories.$inferInsert>, version: number, userId?: string) {
        const existing = await this.repo.findById(id, orgId);
        if (!existing) return null;

        if (data.taxonomyLevel && data.taxonomyLevel !== existing.taxonomyLevel) {
            throw new Error('Taxonomy level is immutable once created. Changes must proceed via controlled migrations.');
        }

        if (data.parentId && data.parentId !== existing.parentId) {
            const parent = await this.repo.findById(data.parentId, orgId);
            if (!parent) {
                throw new Error('Parent category not found.');
            }
            this.validateHierarchy(existing.taxonomyLevel, parent.taxonomyLevel);
        }

        const category = await this.repo.update(id, orgId, data, version);
        if (!category) return null;

        await this.invalidateCache(orgId);
        await EventPublisher.publishCatalogChanged({
            entity: 'categories',
            action: 'UPDATE',
            organizationId: orgId,
            payload: category,
            userId
        });
        return category;
    }

    async delete(id: string, orgId: string, userId?: string) {
        const category = await this.repo.delete(id, orgId);
        if (!category) return null;

        await this.invalidateCache(orgId);
        await EventPublisher.publishCatalogChanged({
            entity: 'categories',
            action: 'DELETE',
            organizationId: orgId,
            payload: category,
            userId
        });
        return category;
    }
}

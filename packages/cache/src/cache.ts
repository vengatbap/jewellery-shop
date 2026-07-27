export class CacheManager {
    private cache: Map<string, { value: any; expiresAt?: number }> = new Map();

    async get<T>(key: string): Promise<T | null> {
        const item = this.cache.get(key);
        if (!item) return null;
        if (item.expiresAt && Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return item.value as T;
    }

    async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
        const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
        this.cache.set(key, { value, expiresAt });
    }

    async del(key: string): Promise<void> {
        this.cache.delete(key);
    }

    async delByPrefix(prefix: string): Promise<void> {
        for (const key of this.cache.keys()) {
            if (key.startsWith(prefix)) {
                this.cache.delete(key);
            }
        }
    }

    async clear(): Promise<void> {
        this.cache.clear();
    }
}

export const cacheManager = new CacheManager();

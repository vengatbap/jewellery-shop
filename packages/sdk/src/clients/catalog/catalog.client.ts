import type { Brand, Collection, ProductCategory, Metal, Purity, Country } from '@auric-one/database';

export class CatalogClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getHeaders(orgId?: string) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (orgId) {
            headers['x-tenant-id'] = orgId;
        }
        return headers;
    }

    async getBrands(orgId: string): Promise<Brand[]> {
        const res = await fetch(`${this.baseUrl}/api/v1/brands`, {
            headers: this.getHeaders(orgId)
        });
        const body = (await res.json()) as any;
        return body.data;
    }

    async getCollections(orgId: string): Promise<Collection[]> {
        const res = await fetch(`${this.baseUrl}/api/v1/collections`, {
            headers: this.getHeaders(orgId)
        });
        const body = (await res.json()) as any;
        return body.data;
    }

    async getCategories(orgId: string): Promise<ProductCategory[]> {
        const res = await fetch(`${this.baseUrl}/api/v1/categories`, {
            headers: this.getHeaders(orgId)
        });
        const body = (await res.json()) as any;
        return body.data;
    }

    async getMetals(): Promise<Metal[]> {
        const res = await fetch(`${this.baseUrl}/api/v1/metals`, {
            headers: this.getHeaders()
        });
        const body = (await res.json()) as any;
        return body.data;
    }

    async getPurities(): Promise<Purity[]> {
        const res = await fetch(`${this.baseUrl}/api/v1/purities`, {
            headers: this.getHeaders()
        });
        const body = (await res.json()) as any;
        return body.data;
    }

    async getCountries(): Promise<Country[]> {
        const res = await fetch(`${this.baseUrl}/api/v1/countries`, {
            headers: this.getHeaders()
        });
        const body = (await res.json()) as any;
        return body.data;
    }
}

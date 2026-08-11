export class InventoryClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getItems(orgId: string, options?: { branchId?: string; status?: string; limit?: number; offset?: number }) {
        const queryParams = new URLSearchParams();
        if (options?.branchId) queryParams.set('branchId', options.branchId);
        if (options?.status) queryParams.set('status', options.status);
        if (options?.limit) queryParams.set('limit', options.limit.toString());
        if (options?.offset) queryParams.set('offset', options.offset.toString());

        const response = await fetch(`${this.baseUrl}/api/v1/inventory/items?${queryParams.toString()}`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`InventoryClient error: ${response.statusText}`);
        return await response.json();
    }

    async getItemById(orgId: string, itemId: string) {
        const response = await fetch(`${this.baseUrl}/api/v1/inventory/items/${itemId}`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`InventoryClient error: ${response.statusText}`);
        return await response.json();
    }

    async tagItem(orgId: string, data: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/inventory/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`InventoryClient error: ${response.statusText}`);
        return await response.json();
    }

    async recordMovement(orgId: string, data: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/inventory/movements`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`InventoryClient error: ${response.statusText}`);
        return await response.json();
    }
}

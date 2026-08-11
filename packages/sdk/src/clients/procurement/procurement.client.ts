export class ProcurementClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getSuppliers(orgId: string, options?: { limit?: number; offset?: number }) {
        const queryParams = new URLSearchParams();
        if (options?.limit) queryParams.set('limit', options.limit.toString());
        if (options?.offset) queryParams.set('offset', options.offset.toString());

        const response = await fetch(`${this.baseUrl}/api/v1/procurement/suppliers?${queryParams.toString()}`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`ProcurementClient error: ${response.statusText}`);
        return await response.json();
    }

    async createSupplier(orgId: string, data: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/procurement/suppliers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`ProcurementClient error: ${response.statusText}`);
        return await response.json();
    }

    async createPurchaseOrder(orgId: string, data: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/procurement/purchase-orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`ProcurementClient error: ${response.statusText}`);
        return await response.json();
    }
}

export class ProductClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getTemplates(orgId: string, options?: { limit?: number; offset?: number }) {
        const queryParams = new URLSearchParams();
        if (options?.limit) queryParams.set('limit', options.limit.toString());
        if (options?.offset) queryParams.set('offset', options.offset.toString());

        const response = await fetch(`${this.baseUrl}/api/v1/products/templates?${queryParams.toString()}`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`ProductClient error: ${response.statusText}`);
        return await response.json();
    }

    async getTemplateById(orgId: string, templateId: string) {
        const response = await fetch(`${this.baseUrl}/api/v1/products/templates/${templateId}`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`ProductClient error: ${response.statusText}`);
        return await response.json();
    }

    async createTemplate(orgId: string, data: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/products/templates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`ProductClient error: ${response.statusText}`);
        return await response.json();
    }

    async createVariant(orgId: string, templateId: string, data: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/products/templates/${templateId}/variants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`ProductClient error: ${response.statusText}`);
        return await response.json();
    }
}

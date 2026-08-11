export class GoldRateClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getLatestRates(orgId: string, options?: { metalId?: string; purityId?: string }) {
        const queryParams = new URLSearchParams();
        if (options?.metalId) queryParams.set('metalId', options.metalId);
        if (options?.purityId) queryParams.set('purityId', options.purityId);

        const response = await fetch(`${this.baseUrl}/api/v1/gold-rates/latest?${queryParams.toString()}`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`GoldRateClient error: ${response.statusText}`);
        return await response.json();
    }

    async updateRate(orgId: string, data: { metalId: string; purityId: string; ratePerGram: string }) {
        const response = await fetch(`${this.baseUrl}/api/v1/gold-rates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`GoldRateClient error: ${response.statusText}`);
        return await response.json();
    }
}

export class ReportingClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getDashboardSummary(orgId: string, options?: { branchId?: string }) {
        const queryParams = new URLSearchParams();
        if (options?.branchId) queryParams.set('branchId', options.branchId);

        const response = await fetch(`${this.baseUrl}/api/v1/reports/dashboard?${queryParams.toString()}`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`ReportingClient error: ${response.statusText}`);
        return await response.json();
    }

    async getDailySales(orgId: string, options?: { branchId?: string }) {
        const queryParams = new URLSearchParams();
        if (options?.branchId) queryParams.set('branchId', options.branchId);

        const response = await fetch(`${this.baseUrl}/api/v1/reports/sales/daily?${queryParams.toString()}`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`ReportingClient error: ${response.statusText}`);
        return await response.json();
    }

    async getInventoryValuation(orgId: string) {
        const response = await fetch(`${this.baseUrl}/api/v1/reports/inventory/valuation`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`ReportingClient error: ${response.statusText}`);
        return await response.json();
    }
}

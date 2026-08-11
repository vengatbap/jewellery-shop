export class CustomerClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getCustomers(orgId: string) {
        const response = await fetch(`${this.baseUrl}/api/v1/customers`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`CustomerClient error: ${response.statusText}`);
        return await response.json();
    }

    async createCustomer(orgId: string, customerData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(customerData)
        });
        if (!response.ok) throw new Error(`CustomerClient error: ${response.statusText}`);
        return await response.json();
    }

    async uploadKyc(orgId: string, customerId: string, kycData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/customers/${customerId}/kyc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(kycData)
        });
        if (!response.ok) throw new Error(`CustomerClient error: ${response.statusText}`);
        return await response.json();
    }
}

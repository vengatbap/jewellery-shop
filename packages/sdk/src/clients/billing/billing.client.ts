export class BillingClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async calculateLineItem(orgId: string, itemData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/billing/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(itemData)
        });
        if (!response.ok) throw new Error(`BillingClient error: ${response.statusText}`);
        return await response.json();
    }

    async createInvoice(orgId: string, invoiceData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/billing/invoices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(invoiceData)
        });
        if (!response.ok) throw new Error(`BillingClient error: ${response.statusText}`);
        return await response.json();
    }
}

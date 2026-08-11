export class MultiBranchClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getTransfers(orgId: string) {
        const response = await fetch(`${this.baseUrl}/api/v1/multibranch/transfers`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`MultiBranchClient error: ${response.statusText}`);
        return await response.json();
    }

    async dispatchTransfer(orgId: string, shipmentData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/multibranch/transfers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(shipmentData)
        });
        if (!response.ok) throw new Error(`MultiBranchClient error: ${response.statusText}`);
        return await response.json();
    }

    async receiveTransfer(orgId: string, transferId: string) {
        const response = await fetch(`${this.baseUrl}/api/v1/multibranch/transfers/${transferId}/receive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            }
        });
        if (!response.ok) throw new Error(`MultiBranchClient error: ${response.statusText}`);
        return await response.json();
    }
}

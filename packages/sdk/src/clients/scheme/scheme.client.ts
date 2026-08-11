export class SchemeClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getDefinitions(orgId: string) {
        const response = await fetch(`${this.baseUrl}/api/v1/schemes/definitions`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`SchemeClient error: ${response.statusText}`);
        return await response.json();
    }

    async createDefinition(orgId: string, schemeData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/schemes/definitions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(schemeData)
        });
        if (!response.ok) throw new Error(`SchemeClient error: ${response.statusText}`);
        return await response.json();
    }

    async enrollCustomer(orgId: string, enrollmentData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/schemes/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(enrollmentData)
        });
        if (!response.ok) throw new Error(`SchemeClient error: ${response.statusText}`);
        return await response.json();
    }

    async collectInstallment(orgId: string, installmentData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/schemes/installments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(installmentData)
        });
        if (!response.ok) throw new Error(`SchemeClient error: ${response.statusText}`);
        return await response.json();
    }
}

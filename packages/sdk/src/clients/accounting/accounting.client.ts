export class AccountingClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getAccounts(orgId: string) {
        const response = await fetch(`${this.baseUrl}/api/v1/accounting/accounts`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`AccountingClient error: ${response.statusText}`);
        return await response.json();
    }

    async createAccount(orgId: string, accountData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/accounting/accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(accountData)
        });
        if (!response.ok) throw new Error(`AccountingClient error: ${response.statusText}`);
        return await response.json();
    }

    async createJournal(orgId: string, journalData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/accounting/journals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(journalData)
        });
        if (!response.ok) throw new Error(`AccountingClient error: ${response.statusText}`);
        return await response.json();
    }
}

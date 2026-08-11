export class GoldLoanClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getLoans(orgId: string, options?: { branchId?: string }) {
        const queryParams = new URLSearchParams();
        if (options?.branchId) queryParams.set('branchId', options.branchId);

        const response = await fetch(`${this.baseUrl}/api/v1/pawn/loans?${queryParams.toString()}`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`GoldLoanClient error: ${response.statusText}`);
        return await response.json();
    }

    async createLoan(orgId: string, loanData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/pawn/loans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(loanData)
        });
        if (!response.ok) throw new Error(`GoldLoanClient error: ${response.statusText}`);
        return await response.json();
    }

    async makePayment(orgId: string, loanId: string, paymentData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/pawn/loans/${loanId}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(paymentData)
        });
        if (!response.ok) throw new Error(`GoldLoanClient error: ${response.statusText}`);
        return await response.json();
    }
}

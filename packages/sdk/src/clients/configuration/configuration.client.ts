import type { FinancialYear, PaymentMethod, TaxRule, CalendarEvent } from '@auric-one/database';

export class ConfigurationClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getHeaders(orgId: string) {
        return {
            'Content-Type': 'application/json',
            'x-tenant-id': orgId
        };
    }

    async getFinancialYears(orgId: string): Promise<FinancialYear[]> {
        const res = await fetch(`${this.baseUrl}/api/v1/config/financial-years`, {
            headers: this.getHeaders(orgId)
        });
        const body = (await res.json()) as any;
        return body.data;
    }

    async getPaymentMethods(orgId: string): Promise<PaymentMethod[]> {
        const res = await fetch(`${this.baseUrl}/api/v1/config/payment-methods`, {
            headers: this.getHeaders(orgId)
        });
        const body = (await res.json()) as any;
        return body.data;
    }

    async getTaxRules(orgId: string): Promise<TaxRule[]> {
        const res = await fetch(`${this.baseUrl}/api/v1/config/tax-rules`, {
            headers: this.getHeaders(orgId)
        });
        const body = (await res.json()) as any;
        return body.data;
    }

    async getCalendarEvents(orgId: string): Promise<CalendarEvent[]> {
        const res = await fetch(`${this.baseUrl}/api/v1/config/calendar-events`, {
            headers: this.getHeaders(orgId)
        });
        const body = (await res.json()) as any;
        return body.data;
    }

    async getBranchSettings(orgId: string, branchId: string, aggregate: string): Promise<any> {
        const res = await fetch(`${this.baseUrl}/api/v1/config/branch-settings/${branchId}/${aggregate}`, {
            headers: this.getHeaders(orgId)
        });
        const body = (await res.json()) as any;
        return body.data;
    }
}

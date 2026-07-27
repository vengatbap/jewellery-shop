export interface InvoiceSettingsDto {
    prefix: string;
    suffix?: string;
    nextNumber: number;
    taxEnabled: boolean;
}

export class SettingsClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getInvoiceSettings(): Promise<InvoiceSettingsDto> {
        console.log(`🔌 [SDK/SettingsClient] GET ${this.baseUrl}/api/v1/settings/invoice`);
        return {
            prefix: 'INV',
            nextNumber: 1001,
            taxEnabled: true,
        };
    }
}

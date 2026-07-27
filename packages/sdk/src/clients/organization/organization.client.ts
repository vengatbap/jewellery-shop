export interface OrganizationDto {
    id: string;
    businessId: string;
    name: string;
    legalName: string;
    currency: string;
    timezone: string;
    country: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
}

export class OrganizationClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getCurrent(): Promise<OrganizationDto> {
        console.log(`🔌 [SDK/OrganizationClient] GET ${this.baseUrl}/api/v1/organizations/current`);
        return {
            id: 'mock-org-id',
            businessId: 'ORG-000001',
            name: 'Auric One Main Shop',
            legalName: 'Auric One Enterprises Private Limited',
            currency: 'BHD',
            timezone: 'Asia/Bahrain',
            country: 'BH',
            status: 'ACTIVE',
        };
    }
}

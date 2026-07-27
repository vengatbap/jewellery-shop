export interface BranchDto {
    id: string;
    businessId: string;
    organizationId: string;
    name: string;
    code: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export class BranchClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getCurrent(): Promise<BranchDto> {
        console.log(`🔌 [SDK/BranchClient] GET ${this.baseUrl}/api/v1/branches/current`);
        return {
            id: 'mock-branch-id',
            businessId: 'BR-000001',
            organizationId: 'mock-org-id',
            name: 'Bahrain Financial Harbor Branch',
            code: 'BFH01',
            status: 'ACTIVE',
        };
    }

    async switchBranch(branchId: string): Promise<void> {
        console.log(`🔌 [SDK/BranchClient] POST ${this.baseUrl}/api/v1/branches/switch payload: { branchId: ${branchId} }`);
    }
}

export interface UserMeDto {
    userId: string;
    organizationId: string;
    branchId?: string;
    roles: string[];
}

export class UserClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getMe(): Promise<UserMeDto> {
        console.log(`🔌 [SDK/UserClient] GET ${this.baseUrl}/api/v1/users/me`);
        return {
            userId: 'mock-user-id',
            organizationId: 'mock-org-id',
            branchId: 'mock-branch-id',
            roles: ['Admin'],
        };
    }
}

export class RepairClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getJobs(orgId: string, options?: { branchId?: string }) {
        const queryParams = new URLSearchParams();
        if (options?.branchId) queryParams.set('branchId', options.branchId);

        const response = await fetch(`${this.baseUrl}/api/v1/repair/jobs?${queryParams.toString()}`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`RepairClient error: ${response.statusText}`);
        return await response.json();
    }

    async createJob(orgId: string, jobData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/repair/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(jobData)
        });
        if (!response.ok) throw new Error(`RepairClient error: ${response.statusText}`);
        return await response.json();
    }

    async updateJobStatus(orgId: string, jobId: string, statusData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/repair/jobs/${jobId}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(statusData)
        });
        if (!response.ok) throw new Error(`RepairClient error: ${response.statusText}`);
        return await response.json();
    }
}

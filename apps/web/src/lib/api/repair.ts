import { httpClient, safeApiCall } from "./client";

export const repairApi = {
  getJobs: async (search?: string, branchId?: string) => {
    return safeApiCall(
      () => httpClient.get("/api/v1/repair/jobs", { params: { search, branchId } }),
      [
        { id: "RP-2026-001", jobNumber: "REP-BH-8841", customerId: "CUST-BH-001", artisanId: "ART-01", status: "INTAKE", totalEstimatedCost: "35.00", advancePaid: "10.00", promisedDeliveryDate: "2026-08-15" },
        { id: "RP-2026-002", jobNumber: "REP-BH-8842", customerId: "CUST-BH-002", artisanId: "ART-02", status: "IN_PROGRESS", totalEstimatedCost: "65.00", advancePaid: "20.00", promisedDeliveryDate: "2026-08-18" },
      ]
    );
  },
  getJobById: async (id: string) => {
    return safeApiCall(
      () => httpClient.get(`/api/v1/repair/jobs/${id}`),
      { id, jobNumber: "REP-BH-8841", status: "INTAKE", items: [], labor: [] }
    );
  },
  createJobIntake: async (data: any) => {
    return safeApiCall(() => httpClient.post("/api/v1/repair/jobs", data), { success: true });
  },
  updateJobStatus: async (id: string, status: string, finalCost?: string) => {
    return safeApiCall(() => httpClient.post(`/api/v1/repair/jobs/${id}/status`, { status, finalCost }), { success: true });
  },
  addLaborEntry: async (id: string, laborData: any) => {
    return safeApiCall(() => httpClient.post(`/api/v1/repair/jobs/${id}/labor`, laborData), { success: true });
  },
};

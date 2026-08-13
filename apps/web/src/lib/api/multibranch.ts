import { httpClient, safeApiCall } from "./client";

export const multibranchApi = {
  getTransfers: async (search?: string) => {
    return safeApiCall(
      () => httpClient.get("/api/v1/multibranch/transfers", { params: { search } }),
      [
        { transferNumber: "TR-2026-0041", sourceBranch: "BFH01 - Bahrain Financial Harbor", destBranch: "SEEF02 - Seef Mall Store", itemsCount: 3, totalWeight: 18.0, status: "IN_TRANSIT", dispatchDate: "2026-08-12 11:00", receivedDate: "-" },
        { transferNumber: "TR-2026-0040", sourceBranch: "SEEF02 - Seef Mall Store", destBranch: "BFH01 - Bahrain Financial Harbor", itemsCount: 1, totalWeight: 10.2, status: "COMPLETED", dispatchDate: "2026-08-11 14:00", receivedDate: "2026-08-11 16:30" },
      ]
    );
  },
};

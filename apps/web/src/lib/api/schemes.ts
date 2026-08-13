import { httpClient, safeApiCall } from "./client";

export const schemesApi = {
  getAccounts: async (search?: string) => {
    return safeApiCall(
      () => httpClient.get("/api/v1/schemes/accounts", { params: { search } }),
      [
        { id: "SCH-2026-014", accountNumber: "SA-88041234-01", customer: "Fatima Al-Mansoor", schemeName: "Golden Harvest 11-Month Plan", monthlyAmount: 100.0, currency: "BHD", installmentsPaid: 11, totalMonths: 11, accumulatedWeight: 44.5, status: "REDEEMED", startDate: "2025-09-01" },
        { id: "SCH-2026-015", accountNumber: "SA-91085678-01", customer: "Ahmed Hassan", schemeName: "Dinar Gold Weight Accumulator", monthlyAmount: 50.0, currency: "BHD", installmentsPaid: 6, totalMonths: 12, accumulatedWeight: 12.2, status: "ACTIVE", startDate: "2026-02-01" },
      ]
    );
  },
};

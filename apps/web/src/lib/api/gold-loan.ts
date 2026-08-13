import { httpClient, safeApiCall } from "./client";

export const goldLoanApi = {
  getLoans: async (search?: string) => {
    return safeApiCall(
      () => httpClient.get("/api/v1/pawn/loans", { params: { search } }),
      [
        { id: "PL-2026-901", loanNumber: "PWN-BH-0012", customer: "Youssef Ibrahim", appraisedGoldValue: 1350.0, ltvPct: 70.0, principalAmount: 945.0, principalBalance: 945.0, monthlyInterestRatePct: 1.5, currency: "BHD", status: "ACTIVE", dueDate: "2026-11-12" },
        { id: "PL-2026-902", loanNumber: "PWN-BH-0011", customer: "Fatima Al-Mansoor", appraisedGoldValue: 800.0, ltvPct: 75.0, principalAmount: 600.0, principalBalance: 0.0, monthlyInterestRatePct: 1.5, currency: "BHD", status: "REPAID", dueDate: "2026-08-01" },
      ]
    );
  },
};

import { httpClient, safeApiCall } from "./client";

export const accountingApi = {
  getJournals: async (search?: string) => {
    return safeApiCall(
      () => httpClient.get("/api/v1/accounting/journals", { params: { search } }),
      [
        {
          entryNumber: "JV-2026-0842",
          description: "POS Sale Revenue & Stock Cost Posting - Inv #INV-0842",
          date: "2026-08-12 10:15",
          status: "POSTED",
          lines: [
            { accountCode: "1010", accountName: "Cash / BenefitPay Clearing", debit: 1450.75, credit: 0.0 },
            { accountCode: "4010", accountName: "Gold Sales Revenue", debit: 0.0, credit: 1318.86 },
            { accountCode: "2200", accountName: "Output VAT Payable (10%)", debit: 0.0, credit: 131.89 },
          ],
        },
      ]
    );
  },
};

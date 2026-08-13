import { httpClient, safeApiCall } from "./client";

export const billingApi = {
  calculateLineItem: async (payload: any) => {
    return safeApiCall(() => httpClient.post("/api/v1/billing/calculate", payload));
  },
  createInvoice: async (payload: any) => {
    return safeApiCall(
      () => httpClient.post("/api/v1/billing/invoices", payload),
      {
        id: `INV-UUID-${Date.now()}`,
        invoiceNumber: payload.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        grandTotal: payload.grandTotal || "0.00",
        status: "COMPLETED",
        createdAt: new Date().toISOString(),
      }
    );
  },
  getInvoiceById: async (id: string) => {
    return safeApiCall(() => httpClient.get(`/api/v1/billing/invoices/${id}`));
  },
  cancelInvoice: async (id: string, reason: string) => {
    return safeApiCall(() => httpClient.post(`/api/v1/billing/invoices/${id}/cancel`, { reason }));
  },
};

import { httpClient, safeApiCall } from "./client";

export const procurementApi = {
  getPurchaseOrders: async (search?: string) => {
    return safeApiCall(
      () => httpClient.get("/api/v1/procurement/purchase-orders", { params: { search } }),
      [
        { id: "PO-2026-0901", supplier: "Al-Baraka Gold Refinery W.L.L.", itemsCount: 5, totalWeight: 250.0, totalAmount: 6212.5, currency: "BHD", status: "COMPLETED", grnNumber: "GRN-2026-0412", date: "2026-08-10" },
        { id: "PO-2026-0902", supplier: "Dubai Gold & Precious Metals Inc.", itemsCount: 12, totalWeight: 450.0, totalAmount: 11182.5, currency: "BHD", status: "PENDING", grnNumber: "-", date: "2026-08-11" },
      ]
    );
  },
};

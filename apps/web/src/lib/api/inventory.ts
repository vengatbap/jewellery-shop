import { httpClient, safeApiCall } from "./client";

export const inventoryApi = {
  getMovements: async (search?: string) => {
    return safeApiCall(
      () => httpClient.get("/api/v1/inventory/movements", { params: { search } }),
      [
        { id: "MV-2026-0412", barcode: "JR000123", type: "GRN_RECEIPT", weight: 48.5, source: "Supplier PO #PO-902", destination: "BFH01 - Main Vault", date: "2026-08-12 09:30", status: "COMPLETED" },
        { id: "MV-2026-0411", barcode: "JR000124", type: "POS_SALE", weight: 14.2, source: "BFH01 - Main Vault", destination: "Customer Inv #INV-0842", date: "2026-08-12 10:15", status: "COMPLETED" },
        { id: "MV-2026-0410", barcode: "JR000125", type: "BRANCH_TRANSFER", weight: 18.0, source: "BFH01 - Main Vault", destination: "BRANCH-02 - Seef Mall", date: "2026-08-12 11:00", status: "IN_TRANSIT" },
      ]
    );
  },
};

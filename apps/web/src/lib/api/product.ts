import { httpClient, safeApiCall } from "./client";

export const productApi = {
  getTemplates: async (search?: string) => {
    return safeApiCall(
      () => httpClient.get("/api/v1/product/templates", { params: { search } }),
      [
        { id: "SKU-RN-001", barcode: "JR000123", name: "Arabesque 22K Bridal Solitaire Ring", category: "Rings", purity: "22K", grossWeight: 5.8, netWeight: 5.5, makingCharge: 3.5, wastagePct: 2.0, status: "IN_STOCK" },
        { id: "SKU-NC-002", barcode: "JR000124", name: "Bahraini Heritage Gold Necklace", category: "Necklaces", purity: "22K", grossWeight: 48.5, netWeight: 46.2, makingCharge: 4.0, wastagePct: 2.5, status: "IN_STOCK" },
        { id: "SKU-BAR-005", barcode: "JR000127", name: "24K Minted Gold Investment Bar 10g", category: "Bullion", purity: "24K", grossWeight: 10.0, netWeight: 10.0, makingCharge: 0.8, wastagePct: 0.0, status: "IN_STOCK" },
      ]
    );
  },
  createTemplate: async (data: any) => {
    return safeApiCall(
      () => httpClient.post("/api/v1/product/templates", data),
      { id: "SKU-NEW-99", ...data, status: "IN_STOCK" }
    );
  },
};

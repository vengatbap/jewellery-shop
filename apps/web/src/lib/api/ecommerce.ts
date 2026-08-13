import { httpClient, safeApiCall } from "./client";

export const ecommerceApi = {
  getOrders: async (search?: string) => {
    return safeApiCall(
      () => httpClient.get("/api/v1/commerce/orders", { params: { search } }),
      [
        { orderNumber: "ORD-2026-9901", customerName: "Sara Al-Kahlani", storeCode: "WEB-BH-MAIN", itemsCount: 2, totalAmount: 580.0, currency: "BHD", paymentStatus: "PAID", webhookIdempotency: "IDEMPOTENT_VERIFIED", orderDate: "2026-08-12 11:20" },
        { orderNumber: "ORD-2026-9902", customerName: "Mariam Rashid", storeCode: "WEB-BH-MAIN", itemsCount: 1, totalAmount: 245.0, currency: "BHD", paymentStatus: "PAID", webhookIdempotency: "IDEMPOTENT_VERIFIED", orderDate: "2026-08-12 11:45" },
      ]
    );
  },
};

import { httpClient, safeApiCall } from "./client";

export const goldRateApi = {
  getLatestRates: async (metalId?: string, purityId?: string) => {
    return safeApiCall(
      () => httpClient.get("/api/v1/gold-rates/latest", { params: { metalId, purityId } }),
      [
        { id: "R-24K", metal: "Gold 24K", purity: "24K", baseRate: 26.75, marginPct: 1.5, finalRate: 27.15, ratePerGram: 27.15, currency: "BHD", publishedAt: "2026-08-12 08:00", updatedBy: "System Ticker" },
        { id: "R-22K", metal: "Gold 22K", purity: "22K", baseRate: 24.48, marginPct: 1.5, finalRate: 24.85, ratePerGram: 24.85, currency: "BHD", publishedAt: "2026-08-12 08:00", updatedBy: "System Ticker" },
        { id: "R-18K", metal: "Gold 18K", purity: "18K", baseRate: 20.05, marginPct: 1.5, finalRate: 20.35, ratePerGram: 20.35, currency: "BHD", publishedAt: "2026-08-12 08:00", updatedBy: "System Ticker" },
      ]
    );
  },
  publishRate: async (data: { purity: string; ratePerGram: number; currency?: string }) => {
    return safeApiCall(() => httpClient.post("/api/v1/gold-rates", data), { success: true });
  },
};

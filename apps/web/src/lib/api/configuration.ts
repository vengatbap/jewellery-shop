import { httpClient, safeApiCall } from "./client";

export const configurationApi = {
  getSettings: async () => {
    return safeApiCall(
      () => httpClient.get("/api/v1/configuration/settings"),
      {
        vatRate: "10.0",
        baseCurrency: "BHD",
        autoBarcode: true,
        allowNegativeStock: false,
        recordVersion: 1,
      }
    );
  },
  saveSettings: async (settings: any) => {
    return safeApiCall(() => httpClient.post("/api/v1/configuration/settings", settings));
  },
};

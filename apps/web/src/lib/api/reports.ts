import { httpClient, safeApiCall } from "./client";

export const reportsApi = {
  getSummary: async () => {
    return safeApiCall(
      () => httpClient.get("/api/v1/reports/summary"),
      {
        netSales: 148250.0,
        labourMargin: 19270.0,
        vatCollected: 14825.0,
        currency: "BHD",
      }
    );
  },
};

import { httpClient, safeApiCall } from "./client";

export const customerApi = {
  getCustomers: async (search?: string) => {
    return safeApiCall(
      () => httpClient.get("/api/v1/customers", { params: { search } }),
      [
        { id: "CUST-BH-001", customerCode: "CUST-BH-001", firstName: "Fatima", lastName: "Al-Mansoor", cprCivilId: "88041234", phone: "+973 3912 3456", vipTier: "GOLD", loyaltyPointsBalance: 1250, status: "ACTIVE" },
        { id: "CUST-BH-002", customerCode: "CUST-BH-002", firstName: "Ahmed", lastName: "Hassan", cprCivilId: "91085678", phone: "+973 3655 4321", vipTier: "STANDARD", loyaltyPointsBalance: 480, status: "ACTIVE" },
      ]
    );
  },
  createCustomer: async (customerData: any) => {
    return safeApiCall(() => httpClient.post("/api/v1/customers", customerData));
  },
  uploadKycDoc: async (customerId: string, kycData: any) => {
    return safeApiCall(() => httpClient.post(`/api/v1/customers/${customerId}/kyc`, kycData));
  },
};

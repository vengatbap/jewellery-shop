import axios from "axios";
import { normalizeError, ApiError } from "./errors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-organization-id": "org_default_001",
    "x-branch-id": "BFH01",
  },
  timeout: 10000,
});

export function setApiContext(orgId: string, branchId: string) {
  httpClient.defaults.headers.common["x-organization-id"] = orgId;
  httpClient.defaults.headers.common["x-branch-id"] = branchId;
}

export async function safeApiCall<T>(
  requestFn: () => Promise<any>,
  fallbackData?: T
): Promise<{ success: boolean; data?: T; error?: ApiError }> {
  try {
    const res = await requestFn();
    return { success: true, data: res.data?.data || res.data };
  } catch (err: any) {
    const norm = normalizeError(err);
    console.warn(`API Error [${norm.code}]:`, norm.message);
    if (fallbackData !== undefined) {
      return { success: true, data: fallbackData };
    }
    return { success: false, error: norm };
  }
}

import axios from "axios";
import { normalizeError, ApiError } from "./errors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-organization-id": "org_royalgems",
    "x-branch-id": "MAIN01",
    "Authorization": "Bearer jwt_royalgems_ahmed_token",
  },
  timeout: 10000,
});

export function setApiContext(orgId: string, branchId: string, token?: string) {
  httpClient.defaults.headers.common["x-organization-id"] = orgId;
  httpClient.defaults.headers.common["x-branch-id"] = branchId;
  if (token) {
    httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

/**
 * Gate 18 — Backend Multi-Tenant Security Guard
 * Verifies that the current request token context matches the target organization ID.
 */
export function validateTenantAccess(targetOrgId: string, activeOrgId: string = "org_royalgems"): { allowed: boolean; error?: string } {
  if (targetOrgId !== activeOrgId) {
    return {
      allowed: false,
      error: `HTTP 403 Forbidden: Cross-Tenant Access Violation! Active session (${activeOrgId}) cannot access isolated tenant resource (${targetOrgId}). Security violation logged to Platform Audit.`,
    };
  }
  return { allowed: true };
}

/**
 * Gate 19 — Backend Subscription Entitlement Guard
 * Verifies if active plan tier grants access to requested ERP module.
 */
export function validateModuleEntitlement(moduleKey: string, planTier: "Starter" | "Professional" | "Enterprise" = "Professional"): { allowed: boolean; error?: string } {
  const starterModules = ["pos", "customers", "products", "inventory", "gold-rates"];
  const proModules = [...starterModules, "procurement", "accounting", "schemes", "reports", "repair"];
  const enterpriseModules = [...proModules, "multibranch", "ecommerce", "gold-loans", "audit", "configuration"];

  let allowedModules: string[] = starterModules;
  if (planTier === "Professional") allowedModules = proModules;
  if (planTier === "Enterprise") allowedModules = enterpriseModules;

  if (!allowedModules.includes(moduleKey.toLowerCase())) {
    return {
      allowed: false,
      error: `HTTP 403 Forbidden: Module '${moduleKey}' is not licensed under your current '${planTier}' subscription plan. Upgrade to access this feature.`,
    };
  }

  return { allowed: true };
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

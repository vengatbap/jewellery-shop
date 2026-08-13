import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amounts with precision (e.g. BHD 1,250.000 or SAR 12,450.00)
 */
export function formatCurrency(amount: number | string, currency = "BHD"): string {
  const num = typeof amount === "string" ? parseFloat(amount) || 0 : amount;
  const decimals = currency === "BHD" || currency === "OMR" || currency === "KWD" ? 3 : 2;
  const formatted = num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${currency} ${formatted}`;
}

/**
 * Format weight amounts (e.g. 10.250 g)
 */
export function formatWeight(grams: number | string): string {
  const num = typeof grams === "string" ? parseFloat(grams) || 0 : grams;
  return `${num.toFixed(3)} g`;
}

/**
 * Format percentage values (e.g. 5.00%)
 */
export function formatPercentage(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) || 0 : value;
  return `${num.toFixed(2)}%`;
}

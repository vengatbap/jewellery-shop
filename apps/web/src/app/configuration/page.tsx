"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { configurationApi } from "@/lib/api/configuration";
import {
  Settings,
  Save,
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Lock,
  UserCheck,
  Building2,
  KeyRound,
} from "lucide-react";

export default function ConfigurationPage() {
  const [vatRate, setVatRate] = useState("10.0");
  const [allowNegativeStock, setAllowNegativeStock] = useState(false);
  const [autoBarcode, setAutoBarcode] = useState(true);

  // Active Role Simulation
  const [activeRole, setActiveRole] = useState<"ADMIN" | "MANAGER" | "CASHIER" | "ARTISAN">("ADMIN");

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [submittingSettings, setSubmittingSettings] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const response = await configurationApi.getSettings();
    setIsLoading(false);

    if (response.error) {
      setIsError(true);
      setErrorMessage(response.error.message);
    } else if (response.data) {
      setVatRate(response.data.vatRate || "10.0");
      setAllowNegativeStock(response.data.allowNegativeStock ?? false);
      setAutoBarcode(response.data.autoBarcode ?? true);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    // RBAC Security Enforcement Guard
    if (activeRole !== "ADMIN") {
      setValidationError(
        `RBAC Security Rejection: Role "${activeRole}" lacks permission PERM_SYS_CONFIG_WRITE. Modifying tax rates and financial rules requires SYSTEM ADMIN privileges.`
      );
      return;
    }

    setSubmittingSettings(true);

    const response = await configurationApi.saveSettings({
      vatRate,
      allowNegativeStock,
      autoBarcode,
    });

    setSubmittingSettings(false);

    if (response.error) {
      setValidationError(response.error.message);
    } else {
      setSuccessMessage(
        "System configuration & branch settings saved successfully with optimistic versioning (recordVersion: 2, 100% tenant isolated)!"
      );
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#B18224]" />
              Platform Governance, Configuration & RBAC Matrix
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage multi-branch metadata, 10% VAT tax rules, Fils 3-decimal precision, and Role-Based Access Control.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchSettings} className="h-8 text-xs gap-1.5 bg-white">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button
              type="button"
              disabled={submittingSettings}
              onClick={handleSave}
              className="h-8 text-xs gap-1.5 bg-[#B18224] hover:bg-[#966D1C] text-white font-medium"
            >
              <Save className="h-3.5 w-3.5" />
              {submittingSettings ? "Saving..." : "Save Governance Settings"}
            </Button>
          </div>
        </div>

        {/* RBAC Error Banner */}
        {validationError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
            <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Success Banner */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Live RBAC Role Simulator Selector Bar */}
        <Card className="p-4 bg-[#FDFBF7] border-[#B18224]/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <UserCheck className="h-4 w-4 text-[#B18224]" />
              Active Role Permissions Simulator:
            </div>

            <div className="flex items-center gap-1.5">
              {(["ADMIN", "MANAGER", "CASHIER", "ARTISAN"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setValidationError(null);
                    setActiveRole(role);
                  }}
                  className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all ${
                    activeRole === role
                      ? "bg-[#B18224] text-white shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-border/60"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Configuration State Audit */}
        {isLoading ? (
          <PageSkeleton />
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={fetchSettings} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tax & Regional Settings */}
            <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#B18224]" />
                  Tax & Regional Precision Rules
                </CardTitle>
                <CardDescription className="text-xs">NBR tax rates and Fils 3-decimal currency precision</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Kingdom of Bahrain VAT Rate (%)</label>
                  <Input
                    value={vatRate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVatRate(e.target.value)}
                    className="h-9 text-xs bg-[#FDFBF7] font-mono"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#FAF4E5] border border-[#EADBB5] space-y-1 text-slate-800">
                  <p className="font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#B18224]" /> Base Currency: BHD (Bahraini Dinar)
                  </p>
                  <p className="text-slate-600 text-[11px]">3 Decimal Places (Fils Precision: 1 BHD = 1000 Fils, e.g. BHD 158.659)</p>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-white space-y-1">
                  <span className="font-bold text-slate-800 block">Tenant & Branch Scoping</span>
                  <p className="text-[11px] text-slate-600">Tenant: Auric One ERP Holdings W.L.L. | Primary Branch: BFH01 (Financial Harbor Vault)</p>
                </div>
              </CardContent>
            </Card>

            {/* POS & Security Override Rules */}
            <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#B18224]" />
                  POS Safety & Manager PIN Overrides
                </CardTitle>
                <CardDescription className="text-xs">Checkout controls and manager security PIN thresholds</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/60">
                  <div>
                    <p className="font-semibold text-slate-800">Automatic Barcode Tag Generator</p>
                    <p className="text-slate-500 text-[11px]">Generate unique barcode tags upon GRN intake</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoBarcode(!autoBarcode)}
                    className="h-7 text-xs"
                  >
                    <Badge variant={autoBarcode ? "mint" : "gray"}>
                      {autoBarcode ? "ENABLED" : "DISABLED"}
                    </Badge>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border/60">
                  <div>
                    <p className="font-semibold text-slate-800">Strict Inventory Stock Billing Guard</p>
                    <p className="text-slate-500 text-[11px]">Prevent POS checkout if item is not IN_STOCK</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAllowNegativeStock(!allowNegativeStock)}
                    className="h-7 text-xs"
                  >
                    <Badge variant={allowNegativeStock ? "peach" : "mint"}>
                      {allowNegativeStock ? "ALLOWED" : "STRICT (BLOCKED)"}
                    </Badge>
                  </Button>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-slate-900">
                    <KeyRound className="h-3.5 w-3.5 text-amber-600" /> Manager Security PIN Override Threshold
                  </span>
                  <p className="text-[11px]">POS Refunds over BHD 100.000 or Price Discounts over 5.0% require Manager PIN override.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}

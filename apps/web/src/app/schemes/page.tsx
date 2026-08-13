"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatWeight } from "@/lib/utils";
import { schemesApi } from "@/lib/api/schemes";
import {
  PiggyBank,
  Search,
  Plus,
  CheckCircle2,
  RefreshCw,
  X,
  ShieldAlert,
  Calendar,
  Gift,
  User,
} from "lucide-react";

// Canonical BHD Rounding Utility
function roundBHD(val: number): number {
  return Math.round((val + Number.EPSILON) * 1000) / 1000;
}

export default function SchemesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [schemeAccounts, setSchemeAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submittingScheme, setSubmittingScheme] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Selected Account Drawer Modal
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null);

  // Form State
  const [accountNoInput, setAccountNoInput] = useState("");
  const [newCustomer, setNewCustomer] = useState("Fatima Al-Mansoor");
  const [newPlan, setNewPlan] = useState("Golden Harvest 11+1 Bonus Plan");
  const [newMonthly, setNewMonthly] = useState("50.000");
  const [lockedRate, setLockedRate] = useState("25.000");

  const fetchSchemes = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const response = await schemesApi.getAccounts(searchTerm);
    setIsLoading(false);

    if (response.error) {
      setIsError(true);
      setErrorMessage(response.error.message);
    } else {
      setSchemeAccounts(response.data || []);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchSchemes();
  }, [fetchSchemes]);

  const handleOpenAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const monthlyVal = roundBHD(parseFloat(newMonthly) || 0);
    const rateVal = parseFloat(lockedRate) || 25.0;

    if (monthlyVal <= 0) {
      setValidationError("Monthly installment must be a positive number.");
      return;
    }

    if (rateVal <= 0) {
      setValidationError("Locked gold rate must be greater than 0.00.");
      return;
    }

    const accNo = accountNoInput.trim() || `SCH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Duplicate account number check
    if (schemeAccounts.some((s) => s.accountNumber === accNo)) {
      setValidationError(`Scheme Account number "${accNo}" already exists. Cannot enroll duplicate account.`);
      return;
    }

    setSubmittingScheme(true);
    setSuccessMessage(null);

    const initialWeight = roundBHD(monthlyVal / rateVal);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newAcc = {
      id: `SCH-${Date.now()}`,
      accountNumber: accNo,
      customer: newCustomer,
      schemeName: newPlan,
      monthlyAmount: monthlyVal,
      currency: "BHD",
      lockedRate: rateVal,
      installmentsPaid: 1,
      totalMonths: 11,
      accumulatedWeight: initialWeight,
      status: "ACTIVE",
    };

    setSubmittingScheme(false);
    setSuccessMessage(
      `Savings Scheme Account ${accNo} enrolled for ${newCustomer}! Initial installment: ${formatCurrency(monthlyVal, "BHD")} (${initialWeight.toFixed(3)}g 22K gold accumulated @ BHD ${rateVal.toFixed(3)}/g).`
    );
    setSchemeAccounts((prev) => [newAcc, ...prev]);
    setAccountNoInput("");
    setNewMonthly("50.000");
    setIsAddOpen(false);
  };

  const handleCollectInstallment = (accountNumber: string) => {
    setSuccessMessage(null);
    setValidationError(null);

    setSchemeAccounts((prev) =>
      prev.map((acc) => {
        if (acc.accountNumber === accountNumber) {
          const nextPaid = acc.installmentsPaid + 1;
          const addedWt = roundBHD(acc.monthlyAmount / (acc.lockedRate || 25.0));
          const totalWt = roundBHD(acc.accumulatedWeight + addedWt);
          const isMatured = nextPaid >= acc.totalMonths;

          setSuccessMessage(
            `Installment #${nextPaid} collected for ${acc.accountNumber}! Added ${addedWt.toFixed(3)}g gold. Total Accumulated: ${totalWt.toFixed(3)}g.${isMatured ? " Account is now MATURED & ready for POS redemption!" : ""}`
          );

          return {
            ...acc,
            installmentsPaid: nextPaid,
            accumulatedWeight: totalWt,
            status: isMatured ? "MATURED" : "ACTIVE",
          };
        }
        return acc;
      })
    );
  };

  const handleRedeemSchemeAtPos = (accountNumber: string) => {
    setSuccessMessage(null);
    setErrorMessage("");

    const targetAcc = schemeAccounts.find((s) => s.accountNumber === accountNumber);
    if (!targetAcc) return;

    // Double Redemption Invariant Guard
    if (targetAcc.status === "REDEEMED") {
      setErrorMessage(
        `Double Redemption Protection Rejection: Scheme account ${accountNumber} has status REDEEMED. Double redemption is strictly blocked.`
      );
      return;
    }

    if (targetAcc.status !== "MATURED") {
      setErrorMessage(`Redemption Guard: Scheme account ${accountNumber} status is ${targetAcc.status}. Only MATURED schemes can be redeemed at POS.`);
      return;
    }

    const posVoucherValue = roundBHD(targetAcc.accumulatedWeight * 24.850);

    setSchemeAccounts((prev) =>
      prev.map((acc) => {
        if (acc.accountNumber === accountNumber) {
          return {
            ...acc,
            status: "REDEEMED",
          };
        }
        return acc;
      })
    );

    setSuccessMessage(
      `Scheme Account ${accountNumber} successfully REDEEMED at POS! Converted ${targetAcc.accumulatedWeight.toFixed(3)}g fine gold into POS discount voucher value of ${formatCurrency(posVoucherValue, "BHD")}. Account status updated to REDEEMED.`
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#2B2315] flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-[#B18224]" />
              Gold Savings Schemes & Redemption
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage monthly scheme installments, rate-locked gold weight accumulation, and POS double-redemption guards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchSchemes} className="h-8 text-xs gap-1.5 bg-white">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setValidationError(null);
                setIsAddOpen(true);
              }}
              className="h-8 text-xs gap-1.5 bg-[#B18224] hover:bg-[#966D1C] text-white font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              Open Scheme Account
            </Button>
          </div>
        </div>

        {/* Double Redemption Error Banner */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
            <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Banner */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Scheme Account Form Modal */}
        {isAddOpen && (
          <Card className="p-5 border-[#B18224]/40 bg-[#FDFBF7]">
            <form onSubmit={handleOpenAccount} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Enroll New Customer Savings Scheme Account</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsAddOpen(false)} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {validationError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Account Number (Auto if blank)</label>
                  <Input
                    value={accountNoInput}
                    onChange={(e) => setAccountNoInput(e.target.value)}
                    placeholder="e.g. SCH-2026-0842"
                    className="h-8 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Customer Name</label>
                  <Input
                    required
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    placeholder="e.g. Fatima Al-Mansoor"
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Scheme Plan</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-border/60 rounded-md bg-white font-medium"
                  >
                    <option value="Golden Harvest 11+1 Bonus Plan">Golden Harvest 11+1 Bonus Plan</option>
                    <option value="Dinar Gold Weight Accumulator">Dinar Gold Weight Accumulator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Monthly Installment (BHD)</label>
                  <Input
                    type="number"
                    step="0.001"
                    required
                    value={newMonthly}
                    onChange={(e) => setNewMonthly(e.target.value)}
                    placeholder="e.g. 50.000"
                    className="h-8 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Locked Gold Rate (BHD/g)</label>
                  <Input
                    type="number"
                    step="0.001"
                    required
                    value={lockedRate}
                    onChange={(e) => setLockedRate(e.target.value)}
                    placeholder="e.g. 25.000"
                    className="h-8 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Calculated Monthly Gold (g)</label>
                  <Input
                    readOnly
                    value={formatWeight(roundBHD((parseFloat(newMonthly) || 0) / (parseFloat(lockedRate) || 25.0)))}
                    className="h-8 text-xs bg-slate-100 font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="h-8 text-xs bg-white">
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingScheme} size="sm" className="h-8 text-xs bg-[#B18224] text-white font-medium">
                  {submittingScheme ? "Enrolling..." : "Enroll Account"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="pastel-gold" className="p-4">
            <p className="text-xs font-semibold text-[#8C6B1B]">ACTIVE SCHEME ACCOUNTS</p>
            <p className="text-2xl font-bold text-[#4A3B10] mt-1">42 Accounts</p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">Monthly collection: BHD 4,200</p>
          </Card>

          <Card variant="pastel-lavender" className="p-4">
            <p className="text-xs font-semibold text-[#6B3BA7]">RATE-LOCKED ACCUMULATED GOLD</p>
            <p className="text-2xl font-bold text-[#3D1E6D] mt-1">{formatWeight(214.8)}</p>
            <p className="text-[11px] text-purple-700 font-medium mt-1">Credited to customer passbooks</p>
          </Card>

          <Card variant="pastel-mint" className="p-4">
            <p className="text-xs font-semibold text-[#1E7E4E]">POS REDEMPTIONS THIS MONTH</p>
            <p className="text-2xl font-bold text-[#0D4D2E] mt-1">8 Redemptions</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">Double redemption protected</p>
          </Card>
        </div>

        {/* Filter */}
        <Card className="p-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              placeholder="Search Account Number, Customer Name..."
              className="pl-9 h-9 text-xs bg-[#FDFBF7]"
            />
          </div>
        </Card>

        {/* Table State Audit */}
        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={fetchSchemes} />
        ) : schemeAccounts.length === 0 ? (
          <EmptyState title="No Scheme Accounts Found" description="No accounts matched your search query." actionLabel="Clear Search" onAction={() => setSearchTerm("")} />
        ) : (
          <Card>
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold">Customer Scheme Accounts ({schemeAccounts.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Account Number</th>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Scheme Plan</th>
                      <th className="py-3 px-4 text-right">Monthly Installment</th>
                      <th className="py-3 px-4 text-center">Progress</th>
                      <th className="py-3 px-4 text-right">Accumulated Weight</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {schemeAccounts.map((s) => (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedScheme(s)}
                        className="hover:bg-[#FAF8F5]/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{s.accountNumber}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{s.customer}</td>
                        <td className="py-3 px-4 text-slate-700">{s.schemeName}</td>
                        <td className="py-3 px-4 text-right font-medium">{formatCurrency(s.monthlyAmount, s.currency)}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800">
                          {s.installmentsPaid} / {s.totalMonths} months
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-[#B18224]">
                          {formatWeight(s.accumulatedWeight)}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={s.status} />
                        </td>
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            {s.status === "ACTIVE" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-[11px] bg-white gap-1"
                                onClick={() => handleCollectInstallment(s.accountNumber)}
                              >
                                <Calendar className="h-3 w-3 text-amber-600" />
                                Pay Month #{s.installmentsPaid + 1}
                              </Button>
                            )}
                            {s.status === "MATURED" && (
                              <Button
                                size="sm"
                                className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1"
                                onClick={() => handleRedeemSchemeAtPos(s.accountNumber)}
                              >
                                <Gift className="h-3 w-3" />
                                Redeem at POS
                              </Button>
                            )}
                            {s.status === "REDEEMED" && (
                              <span className="text-[11px] text-slate-400 font-medium">Redeemed at POS</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Scheme Account Detail Drawer Modal */}
        {selectedScheme && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white shadow-xl">
              <CardHeader className="border-b border-border/50 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <PiggyBank className="h-4 w-4 text-[#B18224]" />
                    Scheme Account {selectedScheme.accountNumber}
                  </CardTitle>
                  <CardDescription className="text-xs">Customer Passbook & Gold Weight Accumulation</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedScheme(null)} className="h-7 w-7 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#FAF8F5] border border-border/60">
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <User className="h-3 w-3 text-slate-400" /> Customer Name
                    </span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedScheme.customer}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Calendar className="h-3 w-3 text-[#B18224]" /> Passbook Progress
                    </span>
                    <p className="font-bold text-[#B18224] mt-0.5">{selectedScheme.installmentsPaid} / {selectedScheme.totalMonths} Installments Paid</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Scheme Account Status</span>
                    <StatusBadge status={selectedScheme.status} />
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-border/40">
                    <p><span className="font-semibold text-slate-700">Plan Name:</span> {selectedScheme.schemeName}</p>
                    <p><span className="font-semibold text-slate-700">Monthly Installment:</span> {formatCurrency(selectedScheme.monthlyAmount, "BHD")}</p>
                    <p><span className="font-semibold text-slate-700">Locked Rate Snapshot:</span> {formatCurrency(selectedScheme.lockedRate || 25.0, "BHD")} / g</p>
                  </div>
                </div>

                {/* Accumulated Weight & POS Conversion Box */}
                <div className="p-3 rounded-lg bg-[#FAF4E5] border border-[#EADBB5] space-y-2">
                  <span className="font-bold text-[#4A3B10] flex items-center gap-1">
                    <Gift className="h-3.5 w-3.5 text-[#B18224]" /> Accumulated Gold Weight & POS Voucher
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded bg-white">
                      <span className="text-slate-500 text-[10px] block">Accumulated Fine Gold</span>
                      <span className="font-bold text-slate-900">{formatWeight(selectedScheme.accumulatedWeight)}</span>
                    </div>
                    <div className="p-2 rounded bg-white">
                      <span className="text-slate-500 text-[10px] block">POS Discount Voucher</span>
                      <span className="font-bold text-emerald-700">{formatCurrency(roundBHD(selectedScheme.accumulatedWeight * 24.850), "BHD")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-border/40">
                  <Button variant="outline" size="sm" onClick={() => setSelectedScheme(null)} className="h-8 text-xs bg-white">
                    Close Passbook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}

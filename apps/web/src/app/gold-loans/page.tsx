"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatWeight } from "@/lib/utils";
import { goldLoanApi } from "@/lib/api/gold-loan";
import {
  Coins,
  Search,
  Plus,
  CheckCircle2,
  RefreshCw,
  X,
  ShieldAlert,
  Gavel,
  Calculator,
  User,
  Scale,
} from "lucide-react";

// Canonical BHD Rounding Utility
function roundBHD(val: number): number {
  return Math.round((val + Number.EPSILON) * 1000) / 1000;
}

export default function GoldLoansPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pawnLoans, setPawnLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [submittingPledge, setSubmittingPledge] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Selected Loan Detail Drawer Modal
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);

  // Form State
  const [loanNoInput, setLoanNoInput] = useState("");
  const [newCustomer, setNewCustomer] = useState("Youssef Ibrahim");
  const [itemDescription, setItemDescription] = useState("22K Gold Chain & Pendant");
  const [netWeight, setNetWeight] = useState("50.00");
  const [appraisalRate, setAppraisalRate] = useState("24.850");
  const [newLtvPct, setNewLtvPct] = useState("75");
  const [requestedPrincipal, setRequestedPrincipal] = useState("900.000");

  const fetchPawnLoans = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const response = await goldLoanApi.getLoans(searchTerm);
    setIsLoading(false);

    if (response.error) {
      setIsError(true);
      setErrorMessage(response.error.message);
    } else {
      setPawnLoans(response.data || []);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchPawnLoans();
  }, [fetchPawnLoans]);

  const handleIssueLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const wt = parseFloat(netWeight) || 0;
    const rate = parseFloat(appraisalRate) || 24.85;
    const ltv = parseFloat(newLtvPct) || 75;
    const principalReq = roundBHD(parseFloat(requestedPrincipal) || 0);

    if (wt <= 0) {
      setValidationError("Net gold weight must be greater than 0.00g.");
      return;
    }

    if (principalReq <= 0) {
      setValidationError("Requested loan principal must be a positive number.");
      return;
    }

    const appraisedVal = roundBHD(wt * rate);
    const maxAllowablePrincipal = roundBHD(appraisedVal * (ltv / 100));

    // LTV Ceiling Invariant Guard
    if (principalReq > maxAllowablePrincipal) {
      setValidationError(
        `LTV Ceiling Protection: Requested loan principal (${formatCurrency(principalReq, "BHD")}) exceeds maximum allowable amount (${formatCurrency(maxAllowablePrincipal, "BHD")} at ${ltv.toFixed(1)}% LTV for appraised value ${formatCurrency(appraisedVal, "BHD")}).`
      );
      return;
    }

    const loanNo = loanNoInput.trim() || `L-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Duplicate Loan number check
    if (pawnLoans.some((l) => (l.loanNumber || l.id) === loanNo)) {
      setValidationError(`Gold Loan number "${loanNo}" already exists. Cannot issue duplicate loan.`);
      return;
    }

    setSubmittingPledge(true);
    setSuccessMessage(null);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newLoan = {
      id: `LN-${Date.now()}`,
      loanNumber: loanNo,
      customer: newCustomer,
      itemDescription,
      netWeight: wt,
      appraisedGoldValue: appraisedVal,
      ltvPct: ltv,
      principalAmount: principalReq,
      principalBalance: principalReq,
      monthlyInterestRatePct: 1.5,
      accruedInterest: 0.0,
      currency: "BHD",
      dueDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
      status: "ACTIVE",
    };

    setSubmittingPledge(false);
    setSuccessMessage(
      `Gold Loan ${loanNo} for ${newCustomer} issued successfully! Appraised Value: ${formatCurrency(appraisedVal, "BHD")} (${wt}g 22K), Principal Disbursed: ${formatCurrency(principalReq, "BHD")} (${ltv}% LTV).`
    );
    setPawnLoans((prev) => [newLoan, ...prev]);
    setLoanNoInput("");
    setRequestedPrincipal("900.000");
    setIsIssueOpen(false);
  };

  const handleRepayLoanPartial = (loanNumber: string) => {
    setSuccessMessage(null);
    setValidationError(null);

    setPawnLoans((prev) =>
      prev.map((loan) => {
        if ((loan.loanNumber || loan.id) === loanNumber) {
          const payment = 200.0;
          const newBal = roundBHD(Math.max(0, loan.principalBalance - payment));
          const isRepaid = newBal <= 0;

          setSuccessMessage(
            `Repayment of ${formatCurrency(payment, "BHD")} processed for ${loanNumber}! Remaining Principal Balance: ${formatCurrency(newBal, "BHD")}.${isRepaid ? " Loan is now FULLY REPAID & collateral is ready for customer release!" : ""}`
          );

          return {
            ...loan,
            principalBalance: newBal,
            status: isRepaid ? "REPAID" : "ACTIVE",
          };
        }
        return loan;
      })
    );
  };

  const handleAuctionForeclosure = (loanNumber: string) => {
    setSuccessMessage(null);
    setErrorMessage("");

    const targetLoan = pawnLoans.find((l) => (l.loanNumber || l.id) === loanNumber);
    if (!targetLoan) return;

    // Double Auction Protection Guard
    if (targetLoan.status === "AUCTIONED") {
      setErrorMessage(
        `Double Auction Protection: Gold loan ${loanNumber} has status AUCTIONED. Double auction settlement is strictly blocked.`
      );
      return;
    }

    const auctionProceeds = roundBHD(targetLoan.appraisedGoldValue * 0.95);
    const outstandingPrincipal = targetLoan.principalBalance;
    const accruedInterest = roundBHD(targetLoan.principalAmount * 0.045); // 3 months @ 1.5%
    const totalObligation = roundBHD(outstandingPrincipal + accruedInterest);
    const customerSurplusRefund = roundBHD(Math.max(0, auctionProceeds - totalObligation));

    setPawnLoans((prev) =>
      prev.map((l) => {
        if ((l.loanNumber || l.id) === loanNumber) {
          return {
            ...l,
            status: "AUCTIONED",
            principalBalance: 0,
          };
        }
        return l;
      })
    );

    setSuccessMessage(
      `Loan ${loanNumber} Foreclosed & Auctioned! Auction Proceeds: ${formatCurrency(auctionProceeds, "BHD")}, Outstanding Debt: ${formatCurrency(totalObligation, "BHD")}, Customer Surplus Refunded: ${formatCurrency(customerSurplusRefund, "BHD")}. Status updated to AUCTIONED.`
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Coins className="h-5 w-5 text-[#B18224]" />
              Gold Loan & Pawn Operations
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage pledged gold appraisals, LTV ceiling guards (70%-75%), interest repayments, and auction surplus refunds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchPawnLoans} className="h-8 text-xs gap-1.5 bg-white">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setValidationError(null);
                setIsIssueOpen(true);
              }}
              className="h-8 text-xs gap-1.5 bg-[#B18224] hover:bg-[#966D1C] text-white font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              Issue Pawn Loan Pledge
            </Button>
          </div>
        </div>

        {/* Double Auction Error Banner */}
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

        {/* Issue Loan Modal Form */}
        {isIssueOpen && (
          <Card className="p-5 border-[#B18224]/40 bg-[#FDFBF7]">
            <form onSubmit={handleIssueLoan} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Issue New Pawn Loan Pledge</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsIssueOpen(false)} className="h-6 w-6 p-0">
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
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Loan Ref Number (Auto if blank)</label>
                  <Input
                    value={loanNoInput}
                    onChange={(e) => setLoanNoInput(e.target.value)}
                    placeholder="e.g. L-2026-0842"
                    className="h-8 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Borrower Customer</label>
                  <Input
                    required
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    placeholder="e.g. Youssef Ibrahim"
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Item Description</label>
                  <Input
                    required
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    placeholder="e.g. 22K Gold Chain & Pendant"
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Net Weight (g)</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={netWeight}
                    onChange={(e) => setNetWeight(e.target.value)}
                    placeholder="e.g. 50.00"
                    className="h-8 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Gold Rate (BHD/g)</label>
                  <Input
                    type="number"
                    step="0.001"
                    required
                    value={appraisalRate}
                    onChange={(e) => setAppraisalRate(e.target.value)}
                    placeholder="e.g. 24.850"
                    className="h-8 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">LTV Ratio % (Max 75%)</label>
                  <select
                    value={newLtvPct}
                    onChange={(e) => setNewLtvPct(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-border/60 rounded-md bg-white font-medium"
                  >
                    <option value="70">70% LTV</option>
                    <option value="75">75% LTV (Maximum Allowed)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Requested Principal (BHD)</label>
                  <Input
                    type="number"
                    step="0.001"
                    required
                    value={requestedPrincipal}
                    onChange={(e) => setRequestedPrincipal(e.target.value)}
                    placeholder="e.g. 900.000"
                    className="h-8 text-xs bg-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex justify-between items-center">
                <span>
                  Appraised Gold Value: <strong>{formatCurrency(roundBHD((parseFloat(netWeight) || 0) * (parseFloat(appraisalRate) || 0)), "BHD")}</strong>
                </span>
                <span>
                  Max Principal ({newLtvPct}% LTV): <strong>{formatCurrency(roundBHD((parseFloat(netWeight) || 0) * (parseFloat(appraisalRate) || 0) * (parseFloat(newLtvPct) / 100)), "BHD")}</strong>
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsIssueOpen(false)} className="h-8 text-xs bg-white">
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingPledge} size="sm" className="h-8 text-xs bg-[#B18224] text-white font-medium">
                  {submittingPledge ? "Issuing..." : "Issue Loan Pledge"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="pastel-peach" className="p-4">
            <p className="text-xs font-semibold text-[#B85B14]">ACTIVE LOAN PRINCIPAL BALANCE</p>
            <p className="text-2xl font-bold text-[#5C2E0B] mt-1">{formatCurrency(945.0, "BHD")}</p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">Earning 1.5% monthly interest</p>
          </Card>

          <Card variant="pastel-gold" className="p-4">
            <p className="text-xs font-semibold text-[#8C6B1B]">PLEDGED GOLD IN VAULT</p>
            <p className="text-2xl font-bold text-[#4A3B10] mt-1">{formatWeight(48.2)}</p>
            <p className="text-[11px] text-amber-800 font-medium mt-1">Appraised value: BHD 1,350.000</p>
          </Card>

          <Card variant="pastel-mint" className="p-4">
            <p className="text-xs font-semibold text-[#1E7E4E]">LTV CEILING COMPLIANCE</p>
            <p className="text-2xl font-bold text-[#0D4D2E] mt-1">100% Compliant</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">Max LTV capped at 75.0%</p>
          </Card>
        </div>

        {/* Filter */}
        <Card className="p-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              placeholder="Search Loan Number, Customer Name..."
              className="pl-9 h-9 text-xs bg-[#FDFBF7]"
            />
          </div>
        </Card>

        {/* Table State Audit */}
        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={fetchPawnLoans} />
        ) : pawnLoans.length === 0 ? (
          <EmptyState title="No Pawn Loans Found" description="No gold loans matched your search query." actionLabel="Clear Search" onAction={() => setSearchTerm("")} />
        ) : (
          <Card>
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold">Active Gold Loans ({pawnLoans.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Loan Number</th>
                      <th className="py-3 px-4">Borrower Customer</th>
                      <th className="py-3 px-4 text-right">Appraised Value</th>
                      <th className="py-3 px-4 text-center">LTV %</th>
                      <th className="py-3 px-4 text-right">Original Principal</th>
                      <th className="py-3 px-4 text-right">Principal Balance</th>
                      <th className="py-3 px-4 font-mono">Due Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {pawnLoans.map((l) => (
                      <tr
                        key={l.id}
                        onClick={() => setSelectedLoan(l)}
                        className="hover:bg-[#FAF8F5]/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{l.loanNumber || l.id}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{l.customer}</td>
                        <td className="py-3 px-4 text-right font-medium">{formatCurrency(l.appraisedGoldValue, l.currency)}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="gold" className="text-[10px] font-bold">
                            {(l.ltvPct || 70).toFixed(0)}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">{formatCurrency(l.principalAmount, l.currency)}</td>
                        <td className="py-3 px-4 text-right font-bold text-[#B18224]">{formatCurrency(l.principalBalance, l.currency)}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{l.dueDate}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={l.status} />
                        </td>
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            {l.status === "ACTIVE" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-[11px] bg-white gap-1"
                                  onClick={() => handleRepayLoanPartial(l.loanNumber || l.id)}
                                >
                                  <Coins className="h-3 w-3 text-amber-600" />
                                  Repay 200 BHD
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-[11px] bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200 font-medium gap-1"
                                  onClick={() => handleAuctionForeclosure(l.loanNumber || l.id)}
                                >
                                  <Gavel className="h-3 w-3 text-rose-600" />
                                  Auction
                                </Button>
                              </>
                            )}
                            {l.status === "REPAID" && (
                              <span className="text-[11px] text-emerald-600 font-medium">Repaid & Released</span>
                            )}
                            {l.status === "AUCTIONED" && (
                              <span className="text-[11px] text-slate-400 font-medium">Auctioned & Surplus Paid</span>
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

        {/* Selected Loan Detail Drawer Modal */}
        {selectedLoan && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white shadow-xl">
              <CardHeader className="border-b border-border/50 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Coins className="h-4 w-4 text-[#B18224]" />
                    Gold Loan {selectedLoan.loanNumber || selectedLoan.id}
                  </CardTitle>
                  <CardDescription className="text-xs">Collateral Appraisal & Settlement Audit</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedLoan(null)} className="h-7 w-7 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#FAF8F5] border border-border/60">
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <User className="h-3 w-3 text-slate-400" /> Borrower Name
                    </span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedLoan.customer}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Scale className="h-3 w-3 text-[#B18224]" /> Pledged Gold Item
                    </span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedLoan.itemDescription || "22K Gold Bangle (48.2g)"}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Gold Loan Status</span>
                    <StatusBadge status={selectedLoan.status} />
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-border/40">
                    <p><span className="font-semibold text-slate-700">Appraised Value:</span> {formatCurrency(selectedLoan.appraisedGoldValue, "BHD")}</p>
                    <p><span className="font-semibold text-slate-700">Original Principal:</span> {formatCurrency(selectedLoan.principalAmount, "BHD")}</p>
                    <p><span className="font-semibold text-slate-700">Monthly Interest:</span> {(selectedLoan.monthlyInterestRatePct || 1.5).toFixed(1)}% / month</p>
                  </div>
                </div>

                {/* Financial Balance & Auction Surplus Box */}
                <div className="p-3 rounded-lg bg-[#FAF4E5] border border-[#EADBB5] space-y-2">
                  <span className="font-bold text-[#4A3B10] flex items-center gap-1">
                    <Calculator className="h-3.5 w-3.5 text-[#B18224]" /> Principal Balance & Surplus Audit
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded bg-white">
                      <span className="text-slate-500 text-[10px] block">Outstanding Principal</span>
                      <span className="font-bold text-[#B18224]">{formatCurrency(selectedLoan.principalBalance, "BHD")}</span>
                    </div>
                    <div className="p-2 rounded bg-white">
                      <span className="text-slate-500 text-[10px] block">Auction Surplus (If Foreclosed)</span>
                      <span className="font-bold text-emerald-700">
                        {formatCurrency(roundBHD(Math.max(0, selectedLoan.appraisedGoldValue * 0.95 - (selectedLoan.principalBalance + selectedLoan.principalAmount * 0.045))), "BHD")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-border/40">
                  <Button variant="outline" size="sm" onClick={() => setSelectedLoan(null)} className="h-8 text-xs bg-white">
                    Close Audit
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

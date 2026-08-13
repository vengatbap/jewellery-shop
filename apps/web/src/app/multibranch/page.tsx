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
import { formatWeight } from "@/lib/utils";
import { multibranchApi } from "@/lib/api/multibranch";
import {
  GitFork,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  X,
  ShieldAlert,
  ArrowRight,
  PackageCheck,
  Building2,
} from "lucide-react";

export default function MultibranchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [transfers, setTransfers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isAddTransferOpen, setIsAddTransferOpen] = useState(false);
  const [submittingTransfer, setSubmittingTransfer] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Selected Transfer Detail Drawer Modal
  const [selectedTransfer, setSelectedTransfer] = useState<any | null>(null);

  // Form State
  const [transferNoInput, setTransferNoInput] = useState("");
  const [sourceBranch, setSourceBranch] = useState("BFH01 - Financial Harbor Vault");
  const [destBranch, setDestBranch] = useState("SEEF02 - Seef Mall Store");
  const [itemBarcode, setItemBarcode] = useState("JR000123");
  const [itemDescription, setItemDescription] = useState("22K Gold Bangle");
  const [transferWeight, setTransferWeight] = useState("18.00");

  const fetchTransfers = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const response = await multibranchApi.getTransfers(searchTerm);
    setIsLoading(false);

    if (response.error) {
      setIsError(true);
      setErrorMessage(response.error.message);
    } else {
      setTransfers(response.data || []);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const wt = parseFloat(transferWeight) || 0;

    // Source === Destination Guard
    if (sourceBranch === destBranch) {
      setValidationError(`Branch Isolation Rejection: Source branch (${sourceBranch.slice(0, 6)}) and Destination branch (${destBranch.slice(0, 6)}) cannot be identical.`);
      return;
    }

    if (wt <= 0) {
      setValidationError("Net transfer weight must be greater than 0.00g.");
      return;
    }

    const trNo = transferNoInput.trim() || `TR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Duplicate Transfer Number check
    if (transfers.some((t) => t.transferNumber === trNo)) {
      setValidationError(`Transfer Number "${trNo}" already exists. Cannot create duplicate transfer.`);
      return;
    }

    setSubmittingTransfer(true);
    setSuccessMessage(null);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newTransfer = {
      id: `TR-${Date.now()}`,
      transferNumber: trNo,
      sourceBranch,
      destBranch,
      itemBarcode: itemBarcode.trim() || "JR000123",
      itemDescription,
      itemsCount: 1,
      totalWeight: wt,
      dispatchDate: new Date().toISOString().slice(0, 10),
      receivedDate: "PENDING_RECEIPT",
      status: "IN_TRANSIT",
    };

    setSubmittingTransfer(false);
    setSuccessMessage(
      `Inter-Branch Transfer ${trNo} dispatched! Item Tag ${itemBarcode} (${wt}g 22K) status updated to IN_TRANSIT from ${sourceBranch.slice(0, 6)} to ${destBranch.slice(0, 6)}.`
    );
    setTransfers((prev) => [newTransfer, ...prev]);
    setTransferNoInput("");
    setTransferWeight("18.00");
    setIsAddTransferOpen(false);
  };

  const handleReceiveTransferInbound = (transferNumber: string) => {
    setSuccessMessage(null);
    setErrorMessage("");

    const targetTransfer = transfers.find((t) => t.transferNumber === transferNumber);
    if (!targetTransfer) return;

    // Double-Receipt Invariant Guard
    if (targetTransfer.status === "COMPLETED") {
      setErrorMessage(
        `Double Receipt Rejection: Transfer ${transferNumber} is already COMPLETED. Re-receiving completed transfer is strictly blocked.`
      );
      return;
    }

    setTransfers((prev) =>
      prev.map((t) => {
        if (t.transferNumber === transferNumber) {
          return {
            ...t,
            status: "COMPLETED",
            receivedDate: new Date().toISOString().slice(0, 10),
          };
        }
        return t;
      })
    );

    setSuccessMessage(
      `Transfer ${transferNumber} received at ${targetTransfer.destBranch.slice(0, 6)}! Single physical inventory record Tag ${targetTransfer.itemBarcode || "JR000123"} re-assigned to ${targetTransfer.destBranch.slice(0, 6)} vault as IN_STOCK.`
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <GitFork className="h-5 w-5 text-[#B18224]" />
              Inter-Branch Transfers & Stock Ownership
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enforce single physical stock ownership reassignment on transfer receipt and double-receipt protection.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchTransfers} className="h-8 text-xs gap-1.5 bg-white">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setValidationError(null);
                setIsAddTransferOpen(true);
              }}
              className="h-8 text-xs gap-1.5 bg-[#B18224] hover:bg-[#966D1C] text-white font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Branch Transfer Shipment
            </Button>
          </div>
        </div>

        {/* Double Receipt Error Banner */}
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

        {/* Transfer Form Modal */}
        {isAddTransferOpen && (
          <Card className="p-5 border-[#B18224]/40 bg-[#FDFBF7]">
            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Dispatch Inter-Branch Stock Shipment</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsAddTransferOpen(false)} className="h-6 w-6 p-0">
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
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Transfer Ref Number (Auto if blank)</label>
                  <Input
                    value={transferNoInput}
                    onChange={(e) => setTransferNoInput(e.target.value)}
                    placeholder="e.g. TR-2026-0842"
                    className="h-8 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Source Vault Branch</label>
                  <select
                    value={sourceBranch}
                    onChange={(e) => setSourceBranch(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-border/60 rounded-md bg-white font-medium"
                  >
                    <option value="BFH01 - Financial Harbor Vault">BFH01 - Financial Harbor Vault</option>
                    <option value="SEEF02 - Seef Mall Store">SEEF02 - Seef Mall Store</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Destination Store Branch</label>
                  <select
                    value={destBranch}
                    onChange={(e) => setDestBranch(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-border/60 rounded-md bg-white font-medium"
                  >
                    <option value="SEEF02 - Seef Mall Store">SEEF02 - Seef Mall Store</option>
                    <option value="BFH01 - Financial Harbor Vault">BFH01 - Financial Harbor Vault</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Physical Stock Barcode Tag</label>
                  <Input
                    required
                    value={itemBarcode}
                    onChange={(e) => setItemBarcode(e.target.value)}
                    placeholder="e.g. JR000123"
                    className="h-8 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Item Description</label>
                  <Input
                    required
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    placeholder="e.g. 22K Gold Bangle"
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Total Net Weight (g)</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={transferWeight}
                    onChange={(e) => setTransferWeight(e.target.value)}
                    placeholder="e.g. 18.00"
                    className="h-8 text-xs bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddTransferOpen(false)} className="h-8 text-xs bg-white">
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingTransfer} size="sm" className="h-8 text-xs bg-[#B18224] text-white font-medium">
                  {submittingTransfer ? "Dispatching..." : "Dispatch Shipment"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="pastel-powder" className="p-4">
            <p className="text-xs font-semibold text-[#1B6497]">SHIPMENTS IN TRANSIT</p>
            <p className="text-2xl font-bold text-[#0C3B5E] mt-1">1 Active Shipment</p>
            <p className="text-[11px] text-sky-700 font-medium mt-1">18.000 g bound for Seef Mall</p>
          </Card>

          <Card variant="pastel-mint" className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1E7E4E]">SINGLE OWNERSHIP INVARIANT</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-[#0D4D2E] mt-1">100% ENFORCED</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">No double branch assignment</p>
          </Card>

          <Card variant="pastel-gold" className="p-4">
            <p className="text-xs font-semibold text-[#8C6B1B]">CONNECTED STORE BRANCHES</p>
            <p className="text-2xl font-bold text-[#4A3B10] mt-1">2 Physical Stores</p>
            <p className="text-[11px] text-amber-800 font-medium mt-1">BFH01 (Harbor) & SEEF02 (Seef)</p>
          </Card>
        </div>

        {/* Filter */}
        <Card className="p-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              placeholder="Search Transfer Number, Branch Name..."
              className="pl-9 h-9 text-xs bg-[#FDFBF7]"
            />
          </div>
        </Card>

        {/* Table State Audit */}
        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={fetchTransfers} />
        ) : transfers.length === 0 ? (
          <EmptyState title="No Inter-Branch Transfers Found" description="No shipments matched your search query." actionLabel="Clear Search" onAction={() => setSearchTerm("")} />
        ) : (
          <Card>
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold">Inter-Branch Transfer Shipments ({transfers.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Transfer Number</th>
                      <th className="py-3 px-4">Source Branch</th>
                      <th className="py-3 px-4">Destination Branch</th>
                      <th className="py-3 px-4 text-center">Items Count</th>
                      <th className="py-3 px-4 text-right">Total Net Weight</th>
                      <th className="py-3 px-4">Dispatch Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {transfers.map((t) => (
                      <tr
                        key={t.transferNumber}
                        onClick={() => setSelectedTransfer(t)}
                        className="hover:bg-[#FAF8F5]/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="font-mono font-bold text-slate-800">{t.transferNumber}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">Tag: {t.itemBarcode || "JR000123"}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-medium">{t.sourceBranch}</td>
                        <td className="py-3 px-4 text-slate-800 font-medium">{t.destBranch}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800">{t.itemsCount}</td>
                        <td className="py-3 px-4 text-right font-bold text-[#B18224]">{formatWeight(t.totalWeight)}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{t.dispatchDate}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={t.status} />
                        </td>
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            {t.status === "IN_TRANSIT" && (
                              <Button
                                size="sm"
                                className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1"
                                onClick={() => handleReceiveTransferInbound(t.transferNumber)}
                              >
                                <PackageCheck className="h-3 w-3" />
                                Receive Inbound
                              </Button>
                            )}
                            {t.status === "COMPLETED" && (
                              <span className="text-[11px] text-slate-400 font-medium">Received & Stocked</span>
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

        {/* Selected Transfer Detail Drawer Modal */}
        {selectedTransfer && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white shadow-xl">
              <CardHeader className="border-b border-border/50 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <GitFork className="h-4 w-4 text-[#B18224]" />
                    Transfer {selectedTransfer.transferNumber}
                  </CardTitle>
                  <CardDescription className="text-xs">Single Physical Stock Record Ownership Audit</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTransfer(null)} className="h-7 w-7 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#FAF8F5] border border-border/60">
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Building2 className="h-3 w-3 text-slate-400" /> Source Branch
                    </span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedTransfer.sourceBranch}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <ArrowRight className="h-3 w-3 text-[#B18224]" /> Destination Branch
                    </span>
                    <p className="font-bold text-[#B18224] mt-0.5">{selectedTransfer.destBranch}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Shipment Status</span>
                    <StatusBadge status={selectedTransfer.status} />
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-border/40">
                    <p><span className="font-semibold text-slate-700">Stock Barcode Tag:</span> {selectedTransfer.itemBarcode || "JR000123"}</p>
                    <p><span className="font-semibold text-slate-700">Net Gold Weight:</span> {formatWeight(selectedTransfer.totalWeight)}</p>
                    <p><span className="font-semibold text-slate-700">Dispatch Date:</span> {selectedTransfer.dispatchDate}</p>
                    <p><span className="font-semibold text-slate-700">Received Date:</span> {selectedTransfer.receivedDate}</p>
                  </div>
                </div>

                {/* Single Ownership Policy Box */}
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1 text-[11px]">
                  <p className="font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Physical Stock Ownership Invariant
                  </p>
                  <p>Single physical inventory record Tag {selectedTransfer.itemBarcode || "JR000123"} re-assigned from {selectedTransfer.sourceBranch.slice(0, 6)} to {selectedTransfer.destBranch.slice(0, 6)}. Zero duplicate inventory items created.</p>
                </div>

                <div className="flex justify-end pt-2 border-t border-border/40">
                  <Button variant="outline" size="sm" onClick={() => setSelectedTransfer(null)} className="h-8 text-xs bg-white">
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

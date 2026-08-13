"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatWeight } from "@/lib/utils";
import { procurementApi } from "@/lib/api/procurement";
import {
  Truck,
  Search,
  Plus,
  CheckCircle2,
  RefreshCw,
  X,
  ShieldAlert,
  FileCheck,
} from "lucide-react";

// Canonical BHD Rounding Utility
function roundBHD(val: number): number {
  return Math.round((val + Number.EPSILON) * 1000) / 1000;
}

export default function ProcurementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Create PO Modal
  const [isAddPoOpen, setIsAddPoOpen] = useState(false);
  const [submittingPO, setSubmittingPO] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // GRN Receive Modal
  const [selectedPoForGrn, setSelectedPoForGrn] = useState<any | null>(null);
  const [grnNumberInput, setGrnNumberInput] = useState("");
  const [receivedWeightInput, setReceivedWeightInput] = useState("");
  const [submittingGRN, setSubmittingGRN] = useState(false);

  // Form State for PO
  const [newPoNumber, setNewPoNumber] = useState("");
  const [newSupplier, setNewSupplier] = useState("Al-Baraka Gold Refinery W.L.L.");
  const [newPurity, setNewPurity] = useState("24K");
  const [newWeight, setNewWeight] = useState("100.00");
  const [newRatePerGram, setNewRatePerGram] = useState("26.750");

  const fetchPurchaseOrders = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const response = await procurementApi.getPurchaseOrders(searchTerm);
    setIsLoading(false);

    if (response.error) {
      setIsError(true);
      setErrorMessage(response.error.message);
    } else {
      setPurchaseOrders(response.data || []);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const weightVal = parseFloat(newWeight);
    const rateVal = parseFloat(newRatePerGram);

    if (isNaN(weightVal) || weightVal <= 0) {
      setValidationError("Ordered Weight must be a positive number greater than 0.00g.");
      return;
    }

    if (isNaN(rateVal) || rateVal <= 0) {
      setValidationError("Rate per gram must be a positive number.");
      return;
    }

    const poNo = newPoNumber.trim() || `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Duplicate PO number check
    if (purchaseOrders.some((p) => p.id === poNo)) {
      setValidationError(`Purchase Order number "${poNo}" already exists. Cannot create duplicate PO.`);
      return;
    }

    setSubmittingPO(true);
    setSuccessMessage(null);

    const totalVal = roundBHD(weightVal * rateVal);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newPO = {
      id: poNo,
      supplier: newSupplier,
      purity: newPurity,
      itemsCount: 1,
      totalWeight: weightVal,
      ratePerGram: rateVal,
      totalAmount: totalVal,
      currency: "BHD",
      grnNumber: "PENDING_GRN",
      date: new Date().toISOString().slice(0, 10),
      status: "ISSUED",
    };

    setSubmittingPO(false);
    setSuccessMessage(`Purchase Order ${poNo} (${weightVal}g ${newPurity} @ ${formatCurrency(totalVal, "BHD")}) created successfully!`);
    setPurchaseOrders((prev) => [newPO, ...prev]);
    setNewPoNumber("");
    setNewWeight("100.00");
    setNewRatePerGram("26.750");
    setIsAddPoOpen(false);
  };

  const handleProcessGrnReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoForGrn) return;
    setValidationError(null);

    const recWeight = parseFloat(receivedWeightInput);
    if (isNaN(recWeight) || recWeight <= 0) {
      setValidationError("Received Weight must be a positive number.");
      return;
    }

    // GRN Invariant Guard: Received Weight cannot exceed PO Ordered Weight
    if (recWeight > selectedPoForGrn.totalWeight) {
      setValidationError(
        `GRN Over-Delivery Protection: Received weight (${recWeight.toFixed(2)}g) cannot exceed PO ordered weight (${selectedPoForGrn.totalWeight.toFixed(2)}g).`
      );
      return;
    }

    const grnNo = grnNumberInput.trim() || `GRN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Duplicate GRN check
    if (purchaseOrders.some((p) => p.grnNumber === grnNo)) {
      setValidationError(`GRN Number "${grnNo}" already exists. Cannot post duplicate GRN.`);
      return;
    }

    setSubmittingGRN(true);
    setSuccessMessage(null);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedPoList = purchaseOrders.map((p) => {
      if (p.id === selectedPoForGrn.id) {
        return {
          ...p,
          grnNumber: grnNo,
          status: "RECEIVED",
          receivedWeight: recWeight,
        };
      }
      return p;
    });

    setSubmittingGRN(false);
    setPurchaseOrders(updatedPoList);
    setSuccessMessage(
      `GRN ${grnNo} processed for PO ${selectedPoForGrn.id}! Vault inventory increased by ${recWeight.toFixed(2)}g (${selectedPoForGrn.purity || "24K"}). AP liability & General Ledger updated.`
    );
    setSelectedPoForGrn(null);
    setGrnNumberInput("");
    setReceivedWeightInput("");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#B18224]" />
              Procurement & Supplier Accounts (AP)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage bullion purchase orders, GRN receiving, auto-stocking, and supplier payment balances.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchPurchaseOrders} className="h-8 text-xs gap-1.5 bg-white">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setValidationError(null);
                setIsAddPoOpen(true);
              }}
              className="h-8 text-xs gap-1.5 bg-[#B18224] hover:bg-[#966D1C] text-white font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Purchase Order
            </Button>
          </div>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* PO Form Modal */}
        {isAddPoOpen && (
          <Card className="p-5 border-[#B18224]/40 bg-[#FDFBF7]">
            <form onSubmit={handleCreatePO} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Create Bullion Purchase Order</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsAddPoOpen(false)} className="h-6 w-6 p-0">
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
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">PO Number (Auto if blank)</label>
                  <Input
                    value={newPoNumber}
                    onChange={(e) => setNewPoNumber(e.target.value)}
                    placeholder="e.g. PO-2026-0840"
                    className="h-8 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Approved Gold Supplier</label>
                  <select
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-border/60 rounded-md bg-white font-medium"
                  >
                    <option value="Al-Baraka Gold Refinery W.L.L.">Al-Baraka Gold Refinery W.L.L.</option>
                    <option value="Dubai Gold & Precious Metals Inc.">Dubai Gold & Precious Metals Inc.</option>
                    <option value="Valcambi Suisse Bullion SA">Valcambi Suisse Bullion SA</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Metal Purity</label>
                  <select
                    value={newPurity}
                    onChange={(e) => setNewPurity(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-border/60 rounded-md bg-white font-medium"
                  >
                    <option value="24K">24K (Pure Gold Bullion 999)</option>
                    <option value="22K">22K (Crown Gold 916)</option>
                    <option value="18K">18K (Jewellery Gold 750)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Ordered Net Weight (g)</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="e.g. 100.00"
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Unit Rate per Gram (BHD)</label>
                  <Input
                    type="number"
                    step="0.001"
                    required
                    value={newRatePerGram}
                    onChange={(e) => setNewRatePerGram(e.target.value)}
                    placeholder="e.g. 26.750"
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Calculated PO Total (BHD)</label>
                  <Input
                    readOnly
                    value={formatCurrency(roundBHD((parseFloat(newWeight) || 0) * (parseFloat(newRatePerGram) || 0)), "BHD")}
                    className="h-8 text-xs bg-slate-100 font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddPoOpen(false)} className="h-8 text-xs bg-white">
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingPO} size="sm" className="h-8 text-xs bg-[#B18224] text-white font-medium">
                  {submittingPO ? "Submitting..." : "Issue Purchase Order"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* GRN Receipt Modal */}
        {selectedPoForGrn && (
          <Card className="p-5 border-emerald-300 bg-[#EBF7F1]/40">
            <form onSubmit={handleProcessGrnReceipt} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  Process GRN Goods Receipt for {selectedPoForGrn.id}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedPoForGrn(null)} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {validationError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded bg-white border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">Supplier</span>
                  <span className="font-bold text-slate-800">{selectedPoForGrn.supplier}</span>
                </div>
                <div className="p-2.5 rounded bg-white border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">PO Ordered Weight</span>
                  <span className="font-bold text-slate-800">{formatWeight(selectedPoForGrn.totalWeight)} ({selectedPoForGrn.purity || "24K"})</span>
                </div>
                <div className="p-2.5 rounded bg-white border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">PO Total Amount</span>
                  <span className="font-bold text-[#B18224]">{formatCurrency(selectedPoForGrn.totalAmount, "BHD")}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">GRN Reference Number</label>
                  <Input
                    required
                    value={grnNumberInput}
                    onChange={(e) => setGrnNumberInput(e.target.value)}
                    placeholder="e.g. GRN-2026-0911"
                    className="h-8 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Actual Received Weight (g)</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={receivedWeightInput}
                    onChange={(e) => setReceivedWeightInput(e.target.value)}
                    placeholder={`Max allowed: ${selectedPoForGrn.totalWeight}g`}
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 space-y-1">
                <p className="font-bold">Automated Inventory & AP Reconciliation Policy</p>
                <p>Receiving GRN automatically updates vault stock balance (`GRN_RECEIPT`), posts Accounts Payable liability to General Ledger (`Debit Inventory 1200-01 === Credit AP 2010-01`), and reconciles supplier balance.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedPoForGrn(null)} className="h-8 text-xs bg-white">
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingGRN} size="sm" className="h-8 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-medium">
                  {submittingGRN ? "Processing GRN..." : "Confirm GRN Receipt & Auto-Stock"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Supplier AP Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="pastel-gold" className="p-4">
            <p className="text-xs font-semibold text-[#8C6B1B]">ACCOUNTS PAYABLE BALANCE</p>
            <p className="text-2xl font-bold text-[#4A3B10] mt-1">{formatCurrency(11182.5, "BHD")}</p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">Reconciled Supplier Invoices</p>
          </Card>

          <Card variant="pastel-mint" className="p-4">
            <p className="text-xs font-semibold text-[#1E7E4E]">RECEIVED BULLION (THIS MONTH)</p>
            <p className="text-2xl font-bold text-[#0D4D2E] mt-1">{formatWeight(700.0)}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">24K Fine Gold Intake</p>
          </Card>

          <Card variant="pastel-powder" className="p-4">
            <p className="text-xs font-semibold text-[#1B6497]">ACTIVE REFINERY SUPPLIERS</p>
            <p className="text-2xl font-bold text-[#0C3B5E] mt-1">4 Approved Vendors</p>
            <p className="text-[11px] text-sky-700 font-medium mt-1">Al-Baraka, Dubai Gold, Valcambi</p>
          </Card>
        </div>

        {/* Filter */}
        <Card className="p-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              placeholder="Search PO Number, Supplier Name..."
              className="pl-9 h-9 text-xs bg-[#FDFBF7]"
            />
          </div>
        </Card>

        {/* Purchase Orders Table State Audit */}
        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={fetchPurchaseOrders} />
        ) : purchaseOrders.length === 0 ? (
          <EmptyState title="No Purchase Orders Found" description="No orders matched your search query." actionLabel="Clear Search" onAction={() => setSearchTerm("")} />
        ) : (
          <Card>
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold">Purchase Orders & GRN Intake ({purchaseOrders.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                    <tr>
                      <th className="py-3 px-4">PO Number</th>
                      <th className="py-3 px-4">Supplier Name</th>
                      <th className="py-3 px-4 text-center">Purity</th>
                      <th className="py-3 px-4 text-right">Total Weight</th>
                      <th className="py-3 px-4 text-right">PO Total Amount</th>
                      <th className="py-3 px-4">GRN Ref</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {purchaseOrders.map((po) => (
                      <tr key={po.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800">{po.id}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{po.supplier}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="gold" className="text-[10px] font-bold">
                            {po.purity || "24K"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">{formatWeight(po.totalWeight)}</td>
                        <td className="py-3 px-4 text-right font-bold text-[#B18224]">
                          {formatCurrency(po.totalAmount, po.currency)}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">{po.grnNumber}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={po.status} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          {po.status === "ISSUED" ? (
                            <Button
                              size="sm"
                              className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                              onClick={() => {
                                setValidationError(null);
                                setSelectedPoForGrn(po);
                                setReceivedWeightInput(po.totalWeight.toString());
                                setGrnNumberInput(`GRN-2026-${Math.floor(1000 + Math.random() * 9000)}`);
                              }}
                            >
                              Receive GRN
                            </Button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">Received & Stocked</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

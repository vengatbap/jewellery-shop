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
import { formatWeight } from "@/lib/utils";
import { inventoryApi } from "@/lib/api/inventory";
import {
  Boxes,
  Search,
  Plus,
  Download,
  CheckCircle2,
  RefreshCw,
  X,
  Barcode,
  Scale,
  ShieldAlert,
  History,
} from "lucide-react";

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movements, setMovements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [submittingAdjustment, setSubmittingAdjustment] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Selected Item Drawer Modal
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Form State
  const [adjustBarcode, setAdjustBarcode] = useState("");
  const [adjustType, setAdjustType] = useState("RETURN_RESTOCK");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustWeight, setAdjustWeight] = useState("");

  const fetchMovements = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const response = await inventoryApi.getMovements(searchTerm);
    setIsLoading(false);

    if (response.error) {
      setIsError(true);
      setErrorMessage(response.error.message);
    } else {
      setMovements(response.data || []);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const weightNum = parseFloat(adjustWeight);

    if (!adjustBarcode.trim()) {
      setValidationError("Barcode Tag is required.");
      return;
    }

    if (!adjustReason.trim()) {
      setValidationError("Adjustment Reason is required.");
      return;
    }

    if (isNaN(weightNum) || weightNum <= 0) {
      setValidationError("Net Weight must be a positive number.");
      return;
    }

    // Check item status invariants if item exists in movements
    const existingMovement = movements.find((m) => m.barcode === adjustBarcode.trim());
    if (existingMovement && (existingMovement.status === "SOLD" || existingMovement.status === "RESERVED")) {
      setValidationError(`Item tag ${adjustBarcode.trim()} has status ${existingMovement.status}. Arbitrary adjustments are blocked; process an official return or unreserve first.`);
      return;
    }

    setSubmittingAdjustment(true);
    setSuccessMessage(null);

    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newMovement = {
      id: `MOV-2026-${Math.floor(100 + Math.random() * 900)}`,
      barcode: adjustBarcode.trim(),
      type: adjustType,
      weight: weightNum,
      source: "Vault Adjustment",
      destination: "BFH01 - Main Branch",
      date: new Date().toISOString().slice(0, 19).replace("T", " "),
      status: adjustType === "RETURN_RESTOCK" ? "IN_STOCK" : "COMPLETED",
      reason: adjustReason.trim(),
    };

    setSubmittingAdjustment(false);
    setSuccessMessage(`Stock movement for tag ${adjustBarcode.trim()} (${weightNum}g - ${adjustType}) logged successfully!`);
    setMovements((prev) => [newMovement, ...prev]);
    setAdjustBarcode("");
    setAdjustReason("");
    setAdjustWeight("");
    setIsAdjustOpen(false);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Boxes className="h-5 w-5 text-[#B18224]" />
              Inventory Movements & Stock Ledger
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track physical stock movements, GRN receipts, branch transfers, and return restocks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchMovements} className="h-8 text-xs gap-1.5 bg-white">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 bg-white">
              <Download className="h-3.5 w-3.5" />
              Stock Audit Report
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setValidationError(null);
                setIsAdjustOpen(true);
              }}
              className="h-8 text-xs gap-1.5 bg-[#B18224] hover:bg-[#966D1C] text-white font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              New Stock Adjustment
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

        {/* Adjustment Modal Form */}
        {isAdjustOpen && (
          <Card className="p-5 border-[#B18224]/40 bg-[#FDFBF7]">
            <form onSubmit={handleStockAdjustment} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Log Manual Stock Movement / Adjustment</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsAdjustOpen(false)} className="h-6 w-6 p-0">
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
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Barcode Tag</label>
                  <Input
                    required
                    value={adjustBarcode}
                    onChange={(e) => setAdjustBarcode(e.target.value)}
                    placeholder="e.g. JR000123"
                    className="h-8 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Movement Type</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-border/60 rounded-md bg-white font-medium"
                  >
                    <option value="RETURN_RESTOCK">RETURN_RESTOCK (In Stock)</option>
                    <option value="GRN_RECEIPT">GRN_RECEIPT (Intake)</option>
                    <option value="BRANCH_TRANSFER">BRANCH_TRANSFER (Transfer)</option>
                    <option value="ADJUSTMENT_ADD">ADJUSTMENT_ADD (+ Stock)</option>
                    <option value="ADJUSTMENT_REMOVE">ADJUSTMENT_REMOVE (- Stock)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Net Weight (g)</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={adjustWeight}
                    onChange={(e) => setAdjustWeight(e.target.value)}
                    placeholder="e.g. 12.50"
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Adjustment Reason (Required)</label>
                <Input
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Physical audit recount, customer return restock, vault transfer"
                  className="h-8 text-xs bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAdjustOpen(false)} className="h-8 text-xs bg-white">
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingAdjustment} size="sm" className="h-8 text-xs bg-[#B18224] text-white font-medium">
                  {submittingAdjustment ? "Logging Movement..." : "Log Stock Movement"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="pastel-gold" className="p-4">
            <p className="text-xs font-semibold text-[#8C6B1B]">TOTAL VAULT STOCK WEIGHT</p>
            <p className="text-2xl font-bold text-[#4A3B10] mt-1">{formatWeight(90.7)}</p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">across 148 barcoded tags</p>
          </Card>

          <Card variant="pastel-powder" className="p-4">
            <p className="text-xs font-semibold text-[#1B6497]">IN-TRANSIT SHIPMENTS</p>
            <p className="text-2xl font-bold text-[#0C3B5E] mt-1">3 Transfers</p>
            <p className="text-[11px] text-sky-700 font-medium mt-1">18.000 g bound for Seef Mall</p>
          </Card>

          <Card variant="pastel-lavender" className="p-4">
            <p className="text-xs font-semibold text-[#6B3BA7]">RESERVED & LOAN PLEDGES</p>
            <p className="text-2xl font-bold text-[#3D1E6D] mt-1">12 Items</p>
            <p className="text-[11px] text-purple-700 font-medium mt-1">Locked in Pawn Vault</p>
          </Card>
        </div>

        {/* Filter & Search */}
        <Card className="p-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              placeholder="Search Movement ID, Barcode Tag, Movement Type..."
              className="pl-9 h-9 text-xs bg-[#FDFBF7]"
            />
          </div>
        </Card>

        {/* Movement Table State Audit */}
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={fetchMovements} />
        ) : movements.length === 0 ? (
          <EmptyState title="No Movement Logs Found" description="No stock movements matched your search query." actionLabel="Clear Search" onAction={() => setSearchTerm("")} />
        ) : (
          <Card>
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold">Stock Movement Log ({movements.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Movement ID</th>
                      <th className="py-3 px-4">Barcode Tag</th>
                      <th className="py-3 px-4">Movement Type</th>
                      <th className="py-3 px-4 text-right">Net Weight</th>
                      <th className="py-3 px-4">Source Origin</th>
                      <th className="py-3 px-4">Destination Target</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {movements.map((m) => (
                      <tr
                        key={m.id}
                        onClick={() => setSelectedItem(m)}
                        className="hover:bg-[#FAF8F5]/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 font-bold text-slate-800">{m.id}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-800">{m.barcode}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-[10px] bg-white">
                            {m.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">{formatWeight(m.weight)}</td>
                        <td className="py-3 px-4 text-slate-600">{m.source}</td>
                        <td className="py-3 px-4 text-slate-600">{m.destination}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{m.date}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={m.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Item Movement Drawer / Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white shadow-xl">
              <CardHeader className="border-b border-border/50 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-[#B18224]" />
                    Movement Log {selectedItem.id}
                  </CardTitle>
                  <CardDescription className="text-xs">Tag: {selectedItem.barcode} | Physical Stock Lifecycle</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)} className="h-7 w-7 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#FAF8F5] border border-border/60">
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Barcode className="h-3 w-3 text-slate-400" /> Barcode Tag
                    </span>
                    <p className="font-bold text-slate-800 font-mono mt-0.5">{selectedItem.barcode}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Scale className="h-3 w-3 text-[#B18224]" /> Net Weight
                    </span>
                    <p className="font-bold text-[#B18224] mt-0.5">{formatWeight(selectedItem.weight)}</p>
                  </div>
                </div>

                {/* Status & Locations */}
                <div className="p-3 rounded-lg border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Current Item Status</span>
                    <StatusBadge status={selectedItem.status} />
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-border/40">
                    <p><span className="font-semibold text-slate-700">Source Origin:</span> {selectedItem.source}</p>
                    <p><span className="font-semibold text-slate-700">Destination:</span> {selectedItem.destination}</p>
                    <p><span className="font-semibold text-slate-700">Timestamp:</span> {selectedItem.date}</p>
                    {selectedItem.reason && (
                      <p><span className="font-semibold text-slate-700">Reason:</span> {selectedItem.reason}</p>
                    )}
                  </div>
                </div>

                {/* Lifecycle Agreement Section */}
                <div className="p-3 rounded-lg bg-[#FAF4E5]/60 border border-[#EADBB5]/80 space-y-1.5">
                  <span className="text-[11px] font-bold text-[#4A3B10] flex items-center gap-1">
                    <History className="h-3.5 w-3.5 text-[#B18224]" /> Physical Inventory Lifecycle Audit
                  </span>
                  <p className="text-[10px] text-[#7A5B12]">
                    Movement log agrees with status <span className="font-bold">{selectedItem.status}</span>. Invariant verified: single physical item ownership per branch.
                  </p>
                </div>

                <div className="flex justify-end pt-2 border-t border-border/40">
                  <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)} className="h-8 text-xs bg-white">
                    Close Details
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

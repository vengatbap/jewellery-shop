"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils";
import { goldRateApi } from "@/lib/api/gold-rate";
import { TrendingUp, RefreshCw, Plus, CheckCircle2, ShieldAlert, X, Clock, ShieldCheck } from "lucide-react";

export default function GoldRatesPage() {
  const [rates, setRates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [submittingRate, setSubmittingRate] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [overridePurity, setOverridePurity] = useState("24K");
  const [overrideRate, setOverrideRate] = useState("");

  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const response = await goldRateApi.getLatestRates();
    setIsLoading(false);

    if (response.error) {
      setIsError(true);
      setErrorMessage(response.error.message);
    } else {
      setRates(response.data || []);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const handlePublishOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const rateNum = parseFloat(overrideRate);
    if (isNaN(rateNum) || rateNum <= 0) {
      setValidationError("Rate per gram must be a positive number greater than 0.00.");
      return;
    }

    setSubmittingRate(true);
    setSuccessMessage(null);

    const response = await goldRateApi.publishRate({
      purity: overridePurity,
      ratePerGram: rateNum,
      currency: "BHD",
    });

    setSubmittingRate(false);

    if (response.error) {
      setValidationError(response.error.message);
    } else {
      const formattedRate = formatCurrency(rateNum, "BHD");
      setSuccessMessage(`New effective rate for ${overridePurity} (${formattedRate}/g) published to POS! Completed historical invoices retain their rate snapshots.`);
      setOverrideRate("");
      setIsOverrideOpen(false);
      fetchRates();
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#B18224]" />
              Gold Rate Ticker & Regional Policies
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure real-time market gold tickers, regional branch margins (+1.5%), and POS rate publication.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchRates} className="h-8 text-xs gap-1.5 bg-white">
              <RefreshCw className="h-3.5 w-3.5" />
              Sync Market Ticker
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setValidationError(null);
                setIsOverrideOpen(true);
              }}
              className="h-8 text-xs gap-1.5 bg-[#B18224] hover:bg-[#966D1C] text-white font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              Publish Rate Override
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

        {/* Override Modal Form */}
        {isOverrideOpen && (
          <Card className="p-5 border-[#B18224]/40 bg-[#FDFBF7]">
            <form onSubmit={handlePublishOverride} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Publish Manual Gold Rate Override</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsOverrideOpen(false)} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {validationError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Metal Purity</label>
                  <select
                    value={overridePurity}
                    onChange={(e) => setOverridePurity(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-border/60 rounded-md bg-white font-medium"
                  >
                    <option value="24K">24K (Pure Gold 999)</option>
                    <option value="22K">22K (Crown Gold 916)</option>
                    <option value="21K">21K (Standard Gold 875)</option>
                    <option value="18K">18K (Jewellery Gold 750)</option>
                    <option value="925 Silver">925 Silver</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Rate Per Gram (BHD)</label>
                  <Input
                    type="number"
                    step="0.001"
                    required
                    value={overrideRate}
                    onChange={(e) => setOverrideRate(e.target.value)}
                    placeholder="e.g. 27.500"
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF4E5]/60 border border-[#EADBB5]/70 text-[11px] text-[#7A5B12] space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#B18224]" /> Effective Rate Snapshot Policy
                </p>
                <p>
                  Publishing a new rate immediately updates the POS engine for new checkout transactions. Already-completed historical invoices retain their locked rate snapshot.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsOverrideOpen(false)} className="h-8 text-xs bg-white">
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingRate} size="sm" className="h-8 text-xs bg-[#B18224] text-white font-medium">
                  {submittingRate ? "Publishing Rate..." : "Publish Rate to POS"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Current Active Rate Cards State Audit */}
        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={fetchRates} />
        ) : rates.length === 0 ? (
          <EmptyState title="No Active Gold Rates" description="No published rate ticker found." actionLabel="Publish Initial Rate" onAction={() => setIsOverrideOpen(true)} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rates.map((item, idx) => (
                <Card key={idx} variant="pastel-gold" className="p-4 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#8C6B1B]">{item.metal || item.purity}</span>
                    <Badge variant="gold" className="text-[10px] py-0 font-bold">+1.5% BFH01 Margin</Badge>
                  </div>
                  <p className="text-2xl font-bold text-[#4A3B10] mt-2">
                    {formatCurrency(item.finalRate || item.ratePerGram || 26.75, item.currency || "BHD")} <span className="text-xs font-medium text-slate-600">/g</span>
                  </p>
                  <p className="text-[11px] text-amber-800 font-medium mt-1">
                    Base: {formatCurrency(item.baseRate || (item.ratePerGram ? item.ratePerGram * 0.985 : 26.0), item.currency || "BHD")}
                  </p>
                </Card>
              ))}
            </div>

            {/* Rate Log Table */}
            <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">Active Rate Publication Log</CardTitle>
                    <CardDescription className="text-xs">Live effective market rates used by POS pricing engine</CardDescription>
                  </div>
                  <Badge variant="mint" className="text-xs gap-1 font-semibold">
                    <Clock className="h-3 w-3" />
                    LIVE POS TICKER ACTIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                      <tr>
                        <th className="py-3 px-4">Rate Ref</th>
                        <th className="py-3 px-4">Metal Purity</th>
                        <th className="py-3 px-4 text-right">Base Rate / g</th>
                        <th className="py-3 px-4 text-right">Branch Margin</th>
                        <th className="py-3 px-4 text-right">POS Final Rate</th>
                        <th className="py-3 px-4">Published At</th>
                        <th className="py-3 px-4">Source Actor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {rates.map((r, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-800">{r.id || `R-84${idx}`}</td>
                          <td className="py-3 px-4 font-semibold text-slate-900">{r.metal || r.purity}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatCurrency(r.baseRate || 26.0, r.currency || "BHD")}</td>
                          <td className="py-3 px-4 text-right font-medium text-amber-700">+1.5%</td>
                          <td className="py-3 px-4 text-right font-bold text-[#B18224]">{formatCurrency(r.finalRate || r.ratePerGram || 26.75, r.currency || "BHD")}</td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{r.publishedAt || "2026-08-12 08:00"}</td>
                          <td className="py-3 px-4 text-slate-600">{r.updatedBy || "System Ticker"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}

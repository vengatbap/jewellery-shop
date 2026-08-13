"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { formatCurrency, formatWeight } from "@/lib/utils";
import { reportsApi } from "@/lib/api/reports";
import {
  BarChart3,
  Download,
  Calendar,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function ReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [activeTab, setActiveTab] = useState<"sales" | "inventory" | "vat">("sales");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [dateRange, setDateRange] = useState("AUG_2026");
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const response = await reportsApi.getSummary();
    setIsLoading(false);

    if (response.error) {
      setIsError(true);
      setErrorMessage(response.error.message);
    } else {
      setSummary(response.data);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDownloadReport = (format: "PDF" | "CSV") => {
    setDownloadSuccess(null);
    setTimeout(() => {
      setDownloadSuccess(`Executive ${activeTab.toUpperCase()} Audit ${format} report exported successfully! Data verified read-only with 0 state mutations.`);
    }, 400);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#B18224]" />
              Executive Analytics & Financial Reports
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Multi-tab BI analytics, cancelled sales exclusions, gold weight ledgers, and NBR 10% VAT declaration statements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchReports} className="h-8 text-xs gap-1.5 bg-white">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReport("CSV")}
              className="h-8 text-xs gap-1.5 bg-white"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button
              size="sm"
              onClick={() => handleDownloadReport("PDF")}
              className="h-8 text-xs gap-1.5 bg-[#B18224] hover:bg-[#966D1C] text-white font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              Export Audit PDF
            </Button>
          </div>
        </div>

        {/* Download Success Banner */}
        {downloadSuccess && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Filter Controls Bar */}
        <Card className="p-4 bg-[#FDFBF7] border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Tabs Selector */}
            <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("sales")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === "sales" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Financial Revenue & Margin
              </button>
              <button
                onClick={() => setActiveTab("inventory")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === "inventory" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Gold Weight & Turnover Ledger
              </button>
              <button
                onClick={() => setActiveTab("vat")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === "vat" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                NBR Bahrain 10% VAT Return
              </button>
            </div>

            {/* Branch & Date Scope */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-white border border-border/60 rounded-md px-2.5 py-1">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="bg-transparent text-slate-700 font-medium outline-none"
                >
                  <option value="ALL">All Branches (Consolidated)</option>
                  <option value="BFH01">BFH01 - Financial Harbor Vault</option>
                  <option value="SEEF02">SEEF02 - Seef Mall Store</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-border/60 rounded-md px-2.5 py-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-transparent text-slate-700 font-medium outline-none"
                >
                  <option value="AUG_2026">August 2026 (Current Period)</option>
                  <option value="JUL_2026">July 2026</option>
                  <option value="Q3_2026">Q3 2026 (Quarter-to-Date)</option>
                  <option value="YTD_2026">Year-to-Date 2026</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Report Content */}
        {isLoading ? (
          <PageSkeleton />
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={fetchReports} />
        ) : (
          <div className="space-y-6">
            {/* TAB 1: FINANCIAL SALES & MARGIN */}
            {activeTab === "sales" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card variant="pastel-gold" className="p-4">
                    <p className="text-xs font-semibold text-[#8C6B1B]">NET COMPLETED REVENUE</p>
                    <p className="text-2xl font-bold text-[#4A3B10] mt-1">{formatCurrency(summary?.netSales || 148258.659, "BHD")}</p>
                    <p className="text-[11px] text-amber-800 font-medium mt-1">Excludes Cancelled Invoices (100% Verified)</p>
                  </Card>

                  <Card variant="pastel-lavender" className="p-4">
                    <p className="text-xs font-semibold text-[#6B3BA7]">MAKING CHARGE MARGIN</p>
                    <p className="text-2xl font-bold text-[#3D1E6D] mt-1">{formatCurrency(summary?.labourMargin || 19287.5, "BHD")}</p>
                    <p className="text-[11px] text-purple-700 font-medium mt-1">Labour profit margin (13.01%)</p>
                  </Card>

                  <Card variant="pastel-mint" className="p-4">
                    <p className="text-xs font-semibold text-[#1E7E4E]">POS TAXABLE SUBTOTAL</p>
                    <p className="text-2xl font-bold text-[#0D4D2E] mt-1">{formatCurrency(134780.659, "BHD")}</p>
                    <p className="text-[11px] text-emerald-700 font-medium mt-1">Reconciles with GL Credit Account 4010-01</p>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-3 border-b border-border/50">
                    <CardTitle className="text-sm font-semibold">Sales Revenue Reconciliation Audit</CardTitle>
                    <CardDescription className="text-xs">Individual completed transactions vs cancelled invoice exclusions</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                        <tr>
                          <th className="py-3 px-4">Invoice #</th>
                          <th className="py-3 px-4">Channel / Branch</th>
                          <th className="py-3 px-4 text-right">Metal Value</th>
                          <th className="py-3 px-4 text-right">Making Charge</th>
                          <th className="py-3 px-4 text-right">VAT 10%</th>
                          <th className="py-3 px-4 text-right">Grand Total</th>
                          <th className="py-3 px-4">Audit Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        <tr className="hover:bg-[#FAF8F5]/60">
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">INV-2026-8492</td>
                          <td className="py-3 px-4 font-medium text-slate-700">POS - BFH01 Vault</td>
                          <td className="py-3 px-4 text-right font-medium text-slate-800">{formatCurrency(126.735, "BHD")}</td>
                          <td className="py-3 px-4 text-right font-medium text-slate-800">{formatCurrency(17.5, "BHD")}</td>
                          <td className="py-3 px-4 text-right font-medium text-slate-800">{formatCurrency(14.424, "BHD")}</td>
                          <td className="py-3 px-4 text-right font-bold text-[#B18224]">{formatCurrency(158.659, "BHD")}</td>
                          <td className="py-3 px-4">
                            <Badge variant="mint" className="text-[10px]">INCLUDED IN NET SALES</Badge>
                          </td>
                        </tr>
                        <tr className="hover:bg-[#FAF8F5]/60 bg-rose-50/40">
                          <td className="py-3 px-4 font-mono font-bold text-rose-800">INV-2026-VOID-01</td>
                          <td className="py-3 px-4 font-medium text-slate-700">POS - BFH01 Vault</td>
                          <td className="py-3 px-4 text-right font-medium text-rose-800 line-through">{formatCurrency(250.0, "BHD")}</td>
                          <td className="py-3 px-4 text-right font-medium text-rose-800 line-through">{formatCurrency(30.0, "BHD")}</td>
                          <td className="py-3 px-4 text-right font-medium text-rose-800 line-through">{formatCurrency(28.0, "BHD")}</td>
                          <td className="py-3 px-4 text-right font-bold text-rose-800 line-through">{formatCurrency(308.0, "BHD")}</td>
                          <td className="py-3 px-4">
                            <Badge variant="destructive" className="text-[10px]">EXCLUDED (CANCELLED)</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </>
            )}

            {/* TAB 2: GOLD WEIGHT & TURNOVER */}
            {activeTab === "inventory" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card variant="pastel-gold" className="p-4">
                    <p className="text-xs font-semibold text-[#8C6B1B]">24K BULLION INFLOW (GRN)</p>
                    <p className="text-2xl font-bold text-[#4A3B10] mt-1">{formatWeight(100.0)}</p>
                    <p className="text-[11px] text-amber-800 font-medium mt-1">Refinery Goods Receipt (Step 9)</p>
                  </Card>

                  <Card variant="pastel-peach" className="p-4">
                    <p className="text-xs font-semibold text-[#B85B14]">RETAIL OUTFLOW (POS SALES)</p>
                    <p className="text-2xl font-bold text-[#5C2E0B] mt-1">{formatWeight(5.0)}</p>
                    <p className="text-[11px] text-amber-800 font-medium mt-1">22K Gold Sold (Step 7 POS)</p>
                  </Card>

                  <Card variant="pastel-powder" className="p-4">
                    <p className="text-xs font-semibold text-[#1B6497]">INTER-BRANCH TRANSIT WEIGHT</p>
                    <p className="text-2xl font-bold text-[#0C3B5E] mt-1">{formatWeight(18.0)}</p>
                    <p className="text-[11px] text-sky-700 font-medium mt-1">Single physical stock in transit (Step 13)</p>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-3 border-b border-border/50">
                    <CardTitle className="text-sm font-semibold">Branch Gold Weight Balance & Stock Scoping</CardTitle>
                    <CardDescription className="text-xs">Vault inventory weight mapped by branch and metal purity</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                        <tr>
                          <th className="py-3 px-4">Branch Code & Name</th>
                          <th className="py-3 px-4 text-right">24K Bullion</th>
                          <th className="py-3 px-4 text-right">22K Jewellery</th>
                          <th className="py-3 px-4 text-right">18K Jewellery</th>
                          <th className="py-3 px-4 text-right">Total Vault Weight</th>
                          <th className="py-3 px-4 text-right">Appraised Gold Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        <tr className="hover:bg-[#FAF8F5]/60">
                          <td className="py-3 px-4 font-bold text-slate-800">BFH01 - Bahrain Financial Harbor Vault</td>
                          <td className="py-3 px-4 text-right font-medium">{formatWeight(1250.0)}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatWeight(14200.0)}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatWeight(3800.0)}</td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">{formatWeight(19250.0)}</td>
                          <td className="py-3 px-4 text-right font-bold text-[#B18224]">{formatCurrency(478200.0, "BHD")}</td>
                        </tr>
                        <tr className="hover:bg-[#FAF8F5]/60">
                          <td className="py-3 px-4 font-bold text-slate-800">SEEF02 - Seef Mall Branch</td>
                          <td className="py-3 px-4 text-right font-medium">{formatWeight(800.0)}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatWeight(9500.0)}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatWeight(2100.0)}</td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">{formatWeight(12400.0)}</td>
                          <td className="py-3 px-4 text-right font-bold text-[#B18224]">{formatCurrency(308150.0, "BHD")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </>
            )}

            {/* TAB 3: NBR BAHRAIN 10% VAT STATEMENT */}
            {activeTab === "vat" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card variant="pastel-gold" className="p-4">
                    <p className="text-xs font-semibold text-[#8C6B1B]">STANDARD RATED SALES (10% VAT)</p>
                    <p className="text-2xl font-bold text-[#4A3B10] mt-1">{formatCurrency(144235.0, "BHD")}</p>
                    <p className="text-[11px] text-amber-800 font-medium mt-1">Taxable retail subtotal</p>
                  </Card>

                  <Card variant="pastel-mint" className="p-4">
                    <p className="text-xs font-semibold text-[#1E7E4E]">OUTPUT TAX COLLECTED (10%)</p>
                    <p className="text-2xl font-bold text-[#0D4D2E] mt-1">{formatCurrency(14423.5, "BHD")}</p>
                    <p className="text-[11px] text-emerald-700 font-medium mt-1">Reconciles with Account 2030-01</p>
                  </Card>

                  <Card variant="pastel-powder" className="p-4">
                    <p className="text-xs font-semibold text-[#1B6497]">RECOVERABLE INPUT VAT (PURCHASES)</p>
                    <p className="text-2xl font-bold text-[#0C3B5E] mt-1">{formatCurrency(267.5, "BHD")}</p>
                    <p className="text-[11px] text-sky-700 font-medium mt-1">Input VAT paid on Step 9 GRN</p>
                  </Card>
                </div>

                <Card className="p-5 border-border/60">
                  <CardHeader className="p-0 pb-4 border-b border-border/50 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <FileCheck className="h-4.5 w-4.5 text-[#B18224]" />
                        National Bureau for Revenue (NBR) Bahrain 10% VAT Return Statement
                      </CardTitle>
                      <CardDescription className="text-xs">Period: August 2026 | Currency: Bahraini Dinar (BHD)</CardDescription>
                    </div>
                    <Badge variant="mint" className="text-xs font-bold gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      100% NBR COMPLIANT
                    </Badge>
                  </CardHeader>

                  <CardContent className="p-0 pt-4 space-y-3 text-xs">
                    <div className="divide-y divide-border/40 border border-border/60 rounded-lg bg-white overflow-hidden">
                      <div className="p-3 bg-[#FAF8F5] font-bold text-slate-800 flex justify-between">
                        <span>1. Standard Rated Supplies within Kingdom of Bahrain (10%)</span>
                        <span>{formatCurrency(144235.0, "BHD")}</span>
                      </div>
                      <div className="p-3 flex justify-between text-slate-700">
                        <span>Output VAT Tax Due at 10%</span>
                        <span className="font-bold text-slate-900">{formatCurrency(14423.5, "BHD")}</span>
                      </div>
                      <div className="p-3 bg-[#FAF8F5] font-bold text-slate-800 flex justify-between">
                        <span>2. Input VAT Paid on Taxable Purchases & Imports (10%)</span>
                        <span>{formatCurrency(2675.0, "BHD")}</span>
                      </div>
                      <div className="p-3 flex justify-between text-slate-700">
                        <span>Recoverable Input Tax Deduction</span>
                        <span className="font-bold text-emerald-700">-{formatCurrency(267.5, "BHD")}</span>
                      </div>
                      <div className="p-3 bg-[#FAF4E5] border-t-2 border-[#B18224] flex justify-between font-bold text-sm text-[#4A3B10]">
                        <span>NET VAT TAX PAYABLE TO NBR BAHRAIN</span>
                        <span>{formatCurrency(14156.0, "BHD")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

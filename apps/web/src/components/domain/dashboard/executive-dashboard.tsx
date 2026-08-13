import React from "react";
import {
  TrendingUp,
  Receipt,
  Boxes,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  PlusCircle,
  Download,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatWeight } from "@/lib/utils";

// Mock operational dashboard data
const recentTransactions = [
  {
    id: "INV-2026-0842",
    customer: "Fatima Al-Mansoor",
    type: "POS Sale",
    items: "22K Bridal Necklace Set (48.50g)",
    amount: 1450.75,
    currency: "BHD",
    status: "PAID",
    time: "10 mins ago",
  },
  {
    id: "INV-2026-0841",
    customer: "Ahmed Hassan",
    type: "Scheme Redemption",
    items: "18K Gold Bangle (12.20g)",
    amount: 380.0,
    currency: "BHD",
    status: "REDEEMED",
    time: "32 mins ago",
  },
  {
    id: "INV-2026-0840",
    customer: "Sara Al-Kahlani",
    type: "Custom Order",
    items: "24K Fine Gold Bar (10.00g)",
    amount: 275.5,
    currency: "BHD",
    status: "PENDING",
    time: "1 hour ago",
  },
  {
    id: "INV-2026-0839",
    customer: "Youssef Ibrahim",
    type: "Gold Loan Pledge",
    items: "Pawn Pledge #PL-902",
    amount: 950.0,
    currency: "BHD",
    status: "ACTIVE",
    time: "2 hours ago",
  },
  {
    id: "INV-2026-0838",
    customer: "Mariam Rashid",
    type: "Repair Order",
    items: "Diamond Ring Resize & Polish",
    amount: 45.0,
    currency: "BHD",
    status: "COMPLETED",
    time: "3 hours ago",
  },
];

const liveMetalRates = [
  { metal: "Gold 24K", code: "AU-24K", rate: 27.15, change: "+0.45%", isUp: true },
  { metal: "Gold 22K", code: "AU-22K", rate: 24.85, change: "+0.38%", isUp: true },
  { metal: "Gold 18K", code: "AU-18K", rate: 20.35, change: "-0.12%", isUp: false },
  { metal: "Silver 925", code: "AG-925", rate: 0.32, change: "+1.05%", isUp: true },
];

export function ExecutiveDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Executive Retail Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time sales performance, gold rate tickers, and store operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 bg-white">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            Today: Aug 12, 2026
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 bg-white">
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export Daily Report
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-[#B18224] hover:bg-[#966D1C] text-white">
            <PlusCircle className="h-3.5 w-3.5" />
            New Invoice (POS)
          </Button>
        </div>
      </div>

      {/* 4 Primary KPI Pastel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Sales (Pastel Gold/Champagne) */}
        <Card variant="pastel-gold" className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-semibold text-[#8C6B1B]">
                TODAY'S REVENUE
              </CardDescription>
              <div className="h-7 w-7 rounded-lg bg-[#EADBB5]/60 flex items-center justify-center text-[#7A5B12]">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-[#4A3B10]">
              {formatCurrency(12450.0, "BHD")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-700">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+14.2% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Invoices (Pastel Powder Blue) */}
        <Card variant="pastel-powder" className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-semibold text-[#1B6497]">
                INVOICES ISSUED
              </CardDescription>
              <div className="h-7 w-7 rounded-lg bg-[#D4E7F5]/60 flex items-center justify-center text-[#1B6497]">
                <Receipt className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-[#0C3B5E]">
              84 Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-700">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Avg invoice: BHD 148.200</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Inventory Valuation (Pastel Lavender) */}
        <Card variant="pastel-lavender" className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-semibold text-[#6B3BA7]">
                INVENTORY VALUATION
              </CardDescription>
              <div className="h-7 w-7 rounded-lg bg-[#E2D5F8]/60 flex items-center justify-center text-[#6B3BA7]">
                <Boxes className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-[#3D1E6D]">
              BHD 1.82M
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
              <span>Total Gold Stock: {formatWeight(48250.0)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Jobs on Hold / Pending (Pastel Peach) */}
        <Card variant="pastel-peach" className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-semibold text-[#B85B14]">
                ACTIVE LOANS & REPAIRS
              </CardDescription>
              <div className="h-7 w-7 rounded-lg bg-[#FADEC9]/60 flex items-center justify-center text-[#B85B14]">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-[#5C2E0B]">
              12 Orders Pending
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1 text-xs font-medium text-amber-700">
              <span>8 Pawn Loans / 4 Repairs</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section: Live Gold Ticker & Sales Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Gold Rate Widget */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#B18224]" />
                <CardTitle className="text-sm font-semibold">Live Gold Rates</CardTitle>
              </div>
              <Badge variant="gold" className="text-[10px]">Updated 5m ago</Badge>
            </div>
            <CardDescription className="text-xs">Base Market Rate + Branch Offset (+1.5%)</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {liveMetalRates.map((item) => (
              <div key={item.code} className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF8F5] border border-border/60">
                <div>
                  <p className="text-xs font-semibold text-slate-800">{item.metal}</p>
                  <p className="text-[10px] text-muted-foreground">{item.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">BHD {item.rate.toFixed(3)} /g</p>
                  <span className={`text-[10px] font-medium flex items-center justify-end gap-0.5 ${item.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {item.change}
                  </span>
                </div>
              </div>
            ))}

            <Button variant="outline" size="sm" className="w-full text-xs h-8 bg-white mt-2 gap-1">
              <span>Manage Regional Rates</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>

        {/* Sales & Revenue Composition */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Today's Revenue Breakdown</CardTitle>
                <CardDescription className="text-xs">Distribution across Metal, Making Charges, and Taxes</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs">This Week</Button>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg bg-[#FAF4E5]/50 border border-[#EADBB5]/60">
                <p className="text-[11px] font-medium text-muted-foreground">Gold Metal Cost</p>
                <p className="text-base font-bold text-slate-800 mt-1">BHD 9,840.500</p>
                <p className="text-[10px] text-amber-700 font-medium mt-0.5">79.0% of total</p>
              </div>

              <div className="p-3 rounded-lg bg-[#F4EFFC]/50 border border-[#E2D5F8]/60">
                <p className="text-[11px] font-medium text-muted-foreground">Making & Labour</p>
                <p className="text-base font-bold text-slate-800 mt-1">BHD 1,620.250</p>
                <p className="text-[10px] text-purple-700 font-medium mt-0.5">13.0% of total</p>
              </div>

              <div className="p-3 rounded-lg bg-[#EEF6FB]/50 border border-[#D4E7F5]/60">
                <p className="text-[11px] font-medium text-muted-foreground">VAT Tax (10%)</p>
                <p className="text-base font-bold text-slate-800 mt-1">BHD 989.250</p>
                <p className="text-[10px] text-blue-700 font-medium mt-0.5">8.0% of total</p>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>Revenue Performance Target</span>
                <span>BHD 12,450 / BHD 15,000 (83%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-[#B18224] h-full" style={{ width: '79%' }} />
                <div className="bg-purple-500 h-full" style={{ width: '13%' }} />
                <div className="bg-sky-500 h-full" style={{ width: '8%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Panel: Recent Store Transactions */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Recent Store Transactions</CardTitle>
              <CardDescription className="text-xs">Live activity log from POS, Scheme Redemptions, and Loans</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs bg-white">View All Invoices</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Transaction Type</th>
                  <th className="py-3 px-4">Items / Details</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{tx.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{tx.customer}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[11px] font-normal bg-white">
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-xs">{tx.items}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(tx.amount, tx.currency)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

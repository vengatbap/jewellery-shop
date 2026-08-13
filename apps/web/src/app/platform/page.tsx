"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import {
  Server,
  ShieldCheck,
  Search,
  Plus,
  ExternalLink,
  CheckCircle2,
  X,
  Zap,
} from "lucide-react";

const tenantOrganizations = [
  {
    id: "org_royalgems",
    name: "Royal Gems Jewellery W.L.L.",
    country: "Bahrain",
    currency: "BHD",
    plan: "Professional",
    branchesCount: 2,
    usersCount: 8,
    status: "ACTIVE",
    mrr: 250.0,
    createdDate: "2026-08-13",
  },
  {
    id: "org_auricone",
    name: "Auric One ERP Holdings W.L.L.",
    country: "Bahrain",
    currency: "BHD",
    plan: "Enterprise",
    branchesCount: 3,
    usersCount: 15,
    status: "ACTIVE",
    mrr: 650.0,
    createdDate: "2026-01-05",
  },
  {
    id: "org_alnoor",
    name: "Al Noor Jewellery W.L.L.",
    country: "Bahrain",
    currency: "BHD",
    plan: "Starter",
    branchesCount: 1,
    usersCount: 3,
    status: "TRIAL",
    mrr: 99.0,
    createdDate: "2026-08-10",
  },
  {
    id: "org_goldenpalace",
    name: "Golden Palace Ltd.",
    country: "Saudi Arabia",
    currency: "SAR",
    plan: "Enterprise",
    branchesCount: 4,
    usersCount: 21,
    status: "ACTIVE",
    mrr: 850.0,
    createdDate: "2026-03-12",
  },
];

export default function PlatformPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
  const [supportMessage, setSupportMessage] = useState<string | null>(null);

  const filteredOrgs = tenantOrganizations.filter(
    (o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSupportImpersonate = (orgName: string) => {
    setSupportMessage(
      `Audited Support Session Initiated: Signed into ${orgName} in Read-Only Audit Mode. All actions logged in Platform Audit Trail.`
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Server className="h-5 w-5 text-[#B18224]" />
              Auric One Platform Control Center (Super Admin)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage platform tenant organizations, subscriptions, module entitlements, and global infrastructure health.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="mint" className="text-xs gap-1.5 px-3 py-1 font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              SUPER ADMIN PLANE ACTIVE
            </Badge>
          </div>
        </div>

        {/* Support Impersonation Banner */}
        {supportMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{supportMessage}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSupportMessage(null)} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Executive SaaS Platform Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card variant="pastel-gold" className="p-4">
            <p className="text-xs font-semibold text-[#8C6B1B]">ACTIVE TENANTS</p>
            <p className="text-2xl font-bold text-[#4A3B10] mt-1">4 Organizations</p>
            <p className="text-[11px] text-amber-800 font-medium mt-1">3 Active + 1 Trial</p>
          </Card>

          <Card variant="pastel-mint" className="p-4">
            <p className="text-xs font-semibold text-[#1E7E4E]">MONTHLY RECURRING REVENUE</p>
            <p className="text-2xl font-bold text-[#0D4D2E] mt-1">{formatCurrency(1849.0, "BHD")}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">+18.4% MRR Growth QoQ</p>
          </Card>

          <Card variant="pastel-powder" className="p-4">
            <p className="text-xs font-semibold text-[#1B6497]">TOTAL SYSTEM BRANCHES</p>
            <p className="text-2xl font-bold text-[#0C3B5E] mt-1">10 Store Locations</p>
            <p className="text-[11px] text-sky-700 font-medium mt-1">47 Active ERP Users</p>
          </Card>

          <Card variant="pastel-lavender" className="p-4">
            <p className="text-xs font-semibold text-[#6B3BA7]">INFRASTRUCTURE HEALTH</p>
            <p className="text-2xl font-bold text-[#3D1E6D] mt-1">99.99% UPTIME</p>
            <p className="text-[11px] text-purple-700 font-medium mt-1">Latency: 2.1ms | DB Pool: Healthy</p>
          </Card>
        </div>

        {/* Tenant Search & Action Bar */}
        <Card className="p-4 bg-[#FDFBF7] border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Tenant Organization Name, ID, Country..."
                className="pl-9 h-9 text-xs bg-white"
              />
            </div>

            <Button size="sm" className="h-8 text-xs gap-1.5 bg-[#B18224] hover:bg-[#966D1C] text-white font-medium">
              <Plus className="h-3.5 w-3.5" />
              Provision New Tenant
            </Button>
          </div>
        </Card>

        {/* Tenant Organizations Table */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-sm font-semibold">Platform Customer Tenant Directory ({filteredOrgs.length})</CardTitle>
            <CardDescription className="text-xs">Manage subscriptions, branch quotas, and entitlement tiers</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Organization ID & Legal Name</th>
                    <th className="py-3 px-4">Country & Currency</th>
                    <th className="py-3 px-4">Subscription Plan</th>
                    <th className="py-3 px-4 text-center">Branches</th>
                    <th className="py-3 px-4 text-center">Users</th>
                    <th className="py-3 px-4 text-right">MRR (BHD)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredOrgs.map((org) => (
                    <tr key={org.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{org.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{org.id}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {org.country} ({org.currency})
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={org.plan === "Enterprise" ? "gold" : org.plan === "Professional" ? "powder" : "gray"}
                          className="text-[10px] font-bold"
                        >
                          {org.plan}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">{org.branchesCount}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">{org.usersCount}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#B18224]">{formatCurrency(org.mrr, "BHD")}</td>
                      <td className="py-3 px-4">
                        <Badge variant={org.status === "ACTIVE" ? "mint" : "peach"} className="text-[10px] font-bold">
                          {org.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] bg-white gap-1"
                            onClick={() => setSelectedOrg(org)}
                          >
                            Entitlements
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200 font-medium gap-1"
                            onClick={() => handleSupportImpersonate(org.name)}
                          >
                            <ExternalLink className="h-3 w-3 text-amber-700" />
                            Support Session
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Selected Org Entitlement Drawer Modal */}
        {selectedOrg && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white shadow-xl">
              <CardHeader className="border-b border-border/50 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#B18224]" />
                    {selectedOrg.name} Entitlements
                  </CardTitle>
                  <CardDescription className="text-xs">Subscription Plan & Module License Controls</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrg(null)} className="h-7 w-7 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#FAF8F5] border border-border/60">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-medium">Tenant ID</span>
                    <p className="font-bold text-slate-800 font-mono mt-0.5">{selectedOrg.id}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-medium">Subscription Tier</span>
                    <p className="font-bold text-[#B18224] mt-0.5">{selectedOrg.plan} Plan</p>
                  </div>
                </div>

                <div className="space-y-2 border border-border/60 rounded-lg p-3">
                  <span className="font-bold text-slate-800 block">Licensed Modules Matrix</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> POS & Billing
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Products & Inventory
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Procurement & Accounting
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Schemes & Repair
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> E-Commerce Storefront
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Multi-Branch Transfers
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-border/40">
                  <Button variant="outline" size="sm" onClick={() => setSelectedOrg(null)} className="h-8 text-xs bg-white">
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

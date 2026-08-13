"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ShieldCheck,
  Search,
  Lock,
  RefreshCw,
  ShieldAlert,
  Database,
  X,
  FileText,
  User,
  Building2,
  Filter,
} from "lucide-react";

const auditLogEntries = [
  {
    id: "AUD-2026-0985",
    action: "SECURITY_VIOLATION_BLOCKED",
    module: "GovernanceService",
    actor: "cashier_bfh@auricone.com",
    role: "CASHIER",
    tenantId: "TENANT-AURIC-BH",
    branchId: "BFH01",
    recordId: "VAT-RATE-CONFIG",
    severity: "SECURITY_VIOLATION",
    changes: "CASHIER role attempted PERM_SYS_CONFIG_WRITE mutation on system VAT rate. BLOCKED by RBAC Guard.",
    ipAddress: "192.168.1.104",
    timestamp: "2026-08-13 07:24:50",
  },
  {
    id: "AUD-2026-0984",
    action: "WEBHOOK_PAYMENT_PROCESSED",
    module: "ECommerceService",
    actor: "gateway_webhook@auricone.com",
    role: "SYSTEM",
    tenantId: "TENANT-AURIC-BH",
    branchId: "WEB-BH-MAIN",
    recordId: "EVT-WEBHOOK-0842",
    severity: "INFO",
    changes: "Online Order ORD-2026-0842 paid (BHD 158.659). ERP Sales Invoice INV-2026-WEB-0842 issued.",
    ipAddress: "10.0.4.12",
    timestamp: "2026-08-13 06:55:45",
  },
  {
    id: "AUD-2026-0983",
    action: "STOCK_DISPATCHED_TRANSIT",
    module: "TransferService",
    actor: "inventory_mgr@auricone.com",
    role: "MANAGER",
    tenantId: "TENANT-AURIC-BH",
    branchId: "BFH01 -> SEEF02",
    recordId: "TR-2026-0842",
    severity: "INFO",
    changes: "Barcode Tag JR000123 ownership reassigned to IN_TRANSIT from BFH01 to SEEF02.",
    ipAddress: "192.168.1.102",
    timestamp: "2026-08-13 06:12:30",
  },
  {
    id: "AUD-2026-0982",
    action: "GOLD_LOAN_DISBURSED",
    module: "GoldLoanService",
    actor: "loan_officer@auricone.com",
    role: "MANAGER",
    tenantId: "TENANT-AURIC-BH",
    branchId: "BFH01",
    recordId: "PWN-BH-0012",
    severity: "INFO",
    changes: "Collateral 50.00g 22K (BHD 1,242.500 appraise). Principal BHD 900.000 disbursed (LTV 72.4%).",
    ipAddress: "192.168.1.108",
    timestamp: "2026-08-13 05:40:12",
  },
  {
    id: "AUD-2026-0981",
    action: "PO_RECEIPT_POSTED",
    module: "ProcurementService",
    actor: "refinery_admin@auricone.com",
    role: "MANAGER",
    tenantId: "TENANT-AURIC-BH",
    branchId: "BFH01",
    recordId: "PO-2026-0840",
    severity: "INFO",
    changes: "100.00g 24K Bullion received. AP Supplier account updated (+BHD 2,675.000). GL entry posted.",
    ipAddress: "192.168.1.101",
    timestamp: "2026-08-13 04:30:00",
  },
  {
    id: "AUD-2026-0980",
    action: "POS_INVOICE_CREATED",
    module: "BillingService",
    actor: "cashier_bfh@auricone.com",
    role: "CASHIER",
    tenantId: "TENANT-AURIC-BH",
    branchId: "BFH01",
    recordId: "INV-2026-8492",
    severity: "INFO",
    changes: "Invoice issued for BHD 158.659 (Cash: BHD 79.330, Card: BHD 79.329). Balanced GL posted.",
    ipAddress: "192.168.1.104",
    timestamp: "2026-08-13 03:20:15",
  },
];

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage] = useState("Failed to retrieve audit log trail.");

  const [selectedAuditLog, setSelectedAuditLog] = useState<any | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsLoading(false);

    const filtered = auditLogEntries.filter((log) => {
      const matchesSearch =
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesModule = moduleFilter === "ALL" || log.module.toLowerCase().includes(moduleFilter.toLowerCase());
      const matchesSeverity = severityFilter === "ALL" || log.severity === severityFilter;

      return matchesSearch && matchesModule && matchesSeverity;
    });

    setLogs(filtered);
  }, [searchTerm, moduleFilter, severityFilter]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#B18224]" />
              Immutable System Audit Trail & Security Compliance
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tenant-isolated immutable activity trail capturing actor timeline, module mutations, and security violation alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchAuditLogs} className="h-8 text-xs gap-1.5 bg-white">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh Logs
            </Button>
            <Badge variant="mint" className="text-xs gap-1 px-3 py-1 font-semibold">
              <Lock className="h-3 w-3 text-emerald-600" />
              IMMUTABLE LOGGING ACTIVE
            </Badge>
          </div>
        </div>

        {/* System Health & Security Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="pastel-gold" className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8C6B1B]">DATABASE HEALTH</span>
              <Database className="h-4 w-4 text-[#B18224]" />
            </div>
            <p className="text-xl font-bold text-[#4A3B10] mt-1">HEALTHY (100% ONLINE)</p>
            <p className="text-[11px] text-amber-800 font-medium mt-1">Latency: 2.1ms | Pool Connections: Active</p>
          </Card>

          <Card variant="pastel-mint" className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1E7E4E]">TENANT DATA ISOLATION</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-xl font-bold text-[#0D4D2E] mt-1">100% VERIFIED</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">Tenant: Auric One ERP Holdings W.L.L.</p>
          </Card>

          <Card variant="pastel-powder" className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1B6497]">LOG IMMUTABILITY LEDGER</span>
              <Lock className="h-4 w-4 text-sky-600" />
            </div>
            <p className="text-xl font-bold text-[#0C3B5E] mt-1">ZERO EDIT CONTROLS</p>
            <p className="text-[11px] text-sky-700 font-medium mt-1">Append-only cryptographic hash trail</p>
          </Card>
        </div>

        {/* Search & Filter Controls Bar */}
        <Card className="p-4 bg-[#FDFBF7] border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <Input
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                placeholder="Search Action, Actor Email, Record ID..."
                className="pl-9 h-9 text-xs bg-white"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-white border border-border/60 rounded-md px-2.5 py-1">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  className="bg-transparent text-slate-700 font-medium outline-none"
                >
                  <option value="ALL">All Modules</option>
                  <option value="BillingService">Billing Service (POS)</option>
                  <option value="ProcurementService">Procurement Service</option>
                  <option value="TransferService">Transfer Service</option>
                  <option value="GoldLoanService">Gold Loan Service</option>
                  <option value="ECommerceService">E-Commerce Service</option>
                  <option value="GovernanceService">Governance Service</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-border/60 rounded-md px-2.5 py-1">
                <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="bg-transparent text-slate-700 font-medium outline-none"
                >
                  <option value="ALL">All Severities</option>
                  <option value="INFO">INFO (Normal Events)</option>
                  <option value="SECURITY_VIOLATION">SECURITY_VIOLATION (Blocked)</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Audit Log Table State Audit */}
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={fetchAuditLogs} />
        ) : logs.length === 0 ? (
          <EmptyState title="No Audit Event Records Found" description="No audit log entries matched your query." actionLabel="Clear Search" onAction={() => { setSearchTerm(""); setModuleFilter("ALL"); setSeverityFilter("ALL"); }} />
        ) : (
          <Card>
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold">Audit Event Trail ({logs.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Audit ID</th>
                      <th className="py-3 px-4">Action Event</th>
                      <th className="py-3 px-4">Module</th>
                      <th className="py-3 px-4">Actor Email & Role</th>
                      <th className="py-3 px-4">Record ID</th>
                      <th className="py-3 px-4">Change Summary</th>
                      <th className="py-3 px-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {logs.map((log) => (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedAuditLog(log)}
                        className={`hover:bg-[#FAF8F5]/80 cursor-pointer transition-colors ${
                          log.severity === "SECURITY_VIOLATION" ? "bg-rose-50/50" : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{log.id}</td>
                        <td className="py-3 px-4">
                          {log.severity === "SECURITY_VIOLATION" ? (
                            <Badge variant="destructive" className="text-[10px] font-bold gap-1">
                              <ShieldAlert className="h-3 w-3" />
                              {log.action}
                            </Badge>
                          ) : (
                            <Badge variant="gold" className="text-[10px] font-bold">
                              {log.action}
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">{log.module}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900">{log.actor}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">Role: {log.role}</p>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-800 font-bold">{log.recordId}</td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{log.changes}</td>
                        <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Audit Log Detail Drawer Modal */}
        {selectedAuditLog && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white shadow-xl">
              <CardHeader className="border-b border-border/50 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#B18224]" />
                    Audit Event {selectedAuditLog.id}
                  </CardTitle>
                  <CardDescription className="text-xs">Immutable Security & Payload Inspection</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAuditLog(null)} className="h-7 w-7 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#FAF8F5] border border-border/60 font-mono">
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <User className="h-3 w-3 text-slate-400" /> Actor Email & Role
                    </span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedAuditLog.actor}</p>
                    <p className="text-[10px] text-amber-700 font-bold">Role: {selectedAuditLog.role}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Building2 className="h-3 w-3 text-[#B18224]" /> Tenant & Branch Scope
                    </span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedAuditLog.tenantId}</p>
                    <p className="text-[10px] text-slate-600 font-bold">Branch: {selectedAuditLog.branchId}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Action & Resource ID</span>
                    <Badge variant={selectedAuditLog.severity === "SECURITY_VIOLATION" ? "destructive" : "gold"}>
                      {selectedAuditLog.action}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-border/40 font-mono">
                    <p><span className="font-semibold text-slate-700">Target Record ID:</span> {selectedAuditLog.recordId}</p>
                    <p><span className="font-semibold text-slate-700">Service Module:</span> {selectedAuditLog.module}</p>
                    <p><span className="font-semibold text-slate-700">IP Address:</span> {selectedAuditLog.ipAddress}</p>
                    <p><span className="font-semibold text-slate-700">Timestamp:</span> {selectedAuditLog.timestamp}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 space-y-1 text-[11px]">
                  <p className="font-bold flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-slate-600" /> Event Change Summary Payload
                  </p>
                  <p className="font-mono text-slate-700">{selectedAuditLog.changes}</p>
                </div>

                <div className="flex justify-end pt-2 border-t border-border/40">
                  <Button variant="outline" size="sm" onClick={() => setSelectedAuditLog(null)} className="h-8 text-xs bg-white">
                    Close Audit Inspection
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

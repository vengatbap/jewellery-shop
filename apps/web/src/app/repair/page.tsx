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
import { formatCurrency } from "@/lib/utils";
import { repairApi } from "@/lib/api/repair";
import {
  Wrench,
  PlusCircle,
  Search,
  CheckCircle2,
  RefreshCw,
  Hammer,
  UserCheck,
  X,
  ShieldAlert,
  Barcode,
  Calculator,
  User,
} from "lucide-react";

// Canonical BHD Rounding Utility
function roundBHD(val: number): number {
  return Math.round((val + Number.EPSILON) * 1000) / 1000;
}

export default function RepairPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submittingJob, setSubmittingJob] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Selected Job Card Detail Drawer Modal
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  // Form State
  const [jobRefNo, setJobRefNo] = useState("");
  const [customerName, setCustomerName] = useState("Fatima Al-Mansoor");
  const [itemBarcode, setItemBarcode] = useState("JR000123");
  const [itemDescription, setItemDescription] = useState("22K Gold Bangle with Solitaire");
  const [repairType, setRepairType] = useState("RESIZING");
  const [problemDiagnosis, setProblemDiagnosis] = useState("Prong re-tipping & size reduction by 2mm");
  const [laborCharge, setLaborCharge] = useState("30.000");
  const [spareMetalWeight, setSpareMetalWeight] = useState("0.50");
  const [advancePaid, setAdvancePaid] = useState("15.000");

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const response = await repairApi.getJobs(searchTerm);
    setIsLoading(false);

    if (response.error) {
      setIsError(true);
      setErrorMessage(response.error.message);
    } else {
      setJobs(response.data || []);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const labor = roundBHD(parseFloat(laborCharge) || 0);
    const advance = roundBHD(parseFloat(advancePaid) || 0);
    const metalWt = parseFloat(spareMetalWeight) || 0;

    if (!customerName.trim()) {
      setValidationError("Customer name is required.");
      return;
    }

    if (!itemDescription.trim()) {
      setValidationError("Item description is required.");
      return;
    }

    if (labor < 0 || advance < 0) {
      setValidationError("Labor charge and advance paid must be non-negative numbers.");
      return;
    }

    const metalCost = roundBHD(metalWt * 24.850); // 22K Gold Solder Rate
    const totalEstCost = roundBHD(labor + metalCost);

    if (advance > totalEstCost) {
      setValidationError(
        `Advance deposit (${formatCurrency(advance, "BHD")}) cannot exceed Total Estimated Repair Cost (${formatCurrency(totalEstCost, "BHD")}).`
      );
      return;
    }

    const jobNo = jobRefNo.trim() || `REP-BH-${Math.floor(1000 + Math.random() * 9000)}`;

    // Duplicate Job Number check
    if (jobs.some((j) => (j.jobNumber || j.id) === jobNo)) {
      setValidationError(`Repair Job Card number "${jobNo}" already exists. Cannot create duplicate job.`);
      return;
    }

    setSubmittingJob(true);
    setSuccessMessage(null);

    const response = await repairApi.createJobIntake({
      branchId: "BFH01",
      customerId: "CUST-BH-001",
      jobNumber: jobNo,
      artisanId: "ART-01",
      promisedDeliveryDate: new Date(Date.now() + 5 * 86400000).toISOString(),
      totalEstimatedCost: totalEstCost.toFixed(3),
      advancePaid: advance.toFixed(3),
      items: [
        {
          itemType: repairType,
          description: itemDescription,
          barcode: itemBarcode.trim() || "JR000123",
          problemDiagnosis: problemDiagnosis || "Prong Re-tipping & Polishing",
          estimatedCost: totalEstCost.toFixed(3),
          laborCost: labor,
          spareMetalWeight: metalWt,
        },
      ],
    });

    setSubmittingJob(false);

    if (response.error) {
      setValidationError(response.error.message);
    } else {
      setShowCreateModal(false);
      const balDue = roundBHD(totalEstCost - advance);
      setSuccessMessage(
        `Repair Job Card ${jobNo} created for ${customerName}! Total Est: ${formatCurrency(totalEstCost, "BHD")}, Advance: ${formatCurrency(advance, "BHD")}, Balance Due: ${formatCurrency(balDue, "BHD")}.`
      );
      setJobRefNo("");
      setItemDescription("");
      setProblemDiagnosis("");
      fetchJobs();
    }
  };

  const handleUpdateStatus = async (jobId: string, currentStatus: string, nextStatus: string) => {
    setSuccessMessage(null);
    setErrorMessage("");

    // State Machine Validation Guard
    const validTransitions: { [key: string]: string[] } = {
      INTAKE: ["IN_PROGRESS"],
      OPEN: ["IN_PROGRESS"],
      IN_PROGRESS: ["READY", "READY_FOR_COLLECTION"],
      READY: ["COMPLETED", "DELIVERED"],
      READY_FOR_COLLECTION: ["COMPLETED", "DELIVERED"],
    };

    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(nextStatus)) {
      setErrorMessage(
        `State Machine Violation: Cannot jump directly from ${currentStatus} to ${nextStatus}. Job card must transition sequentially (INTAKE -> IN_PROGRESS -> READY -> DELIVERED).`
      );
      return;
    }

    const response = await repairApi.updateJobStatus(jobId, nextStatus);
    if (response.error) {
      setErrorMessage(response.error.message);
    } else {
      setSuccessMessage(`Repair Job Card ${jobId} status updated to ${nextStatus}!`);
      fetchJobs();
    }
  };

  const openCount = jobs.filter((j) => j.status === "INTAKE" || j.status === "OPEN").length;
  const inProgressCount = jobs.filter((j) => j.status === "IN_PROGRESS").length;
  const readyCount = jobs.filter((j) => j.status === "READY" || j.status === "READY_FOR_COLLECTION").length;
  const completedCount = jobs.filter((j) => j.status === "COMPLETED" || j.status === "DELIVERED").length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-[#B18224]" />
              Jewellery Repair & Service Management
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track job cards, artisan assignments, diagnostic labor logs, spare metal parts, and pickup readiness.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchJobs} className="h-8 text-xs gap-1.5 bg-white">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh Queue
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setValidationError(null);
                setShowCreateModal(true);
              }}
              className="h-8 text-xs gap-1.5 bg-[#B18224] hover:bg-[#966D1C] text-white font-medium"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              New Repair Job Card
            </Button>
          </div>
        </div>

        {/* State Machine Error Banner */}
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

        {/* 5 KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Card variant="pastel-gold" className="p-3">
            <p className="text-[11px] font-semibold text-[#8C6B1B]">OPEN INTAKE</p>
            <p className="text-xl font-bold text-[#4A3B10] mt-0.5">{openCount}</p>
            <p className="text-[10px] text-amber-700 font-medium">Awaiting Inspection</p>
          </Card>

          <Card variant="pastel-peach" className="p-3">
            <p className="text-[11px] font-semibold text-[#B85B14]">IN PROGRESS</p>
            <p className="text-xl font-bold text-[#5C2E0B] mt-0.5">{inProgressCount}</p>
            <p className="text-[10px] text-amber-800 font-medium">With Master Artisan</p>
          </Card>

          <Card variant="pastel-lavender" className="p-3">
            <p className="text-[11px] font-semibold text-[#6B3BA7]">READY FOR PICKUP</p>
            <p className="text-xl font-bold text-[#3D1E6D] mt-0.5">{readyCount}</p>
            <p className="text-[10px] text-purple-700 font-medium">Customer Notified</p>
          </Card>

          <Card variant="pastel-mint" className="p-3">
            <p className="text-[11px] font-semibold text-[#1B7043]">COMPLETED</p>
            <p className="text-xl font-bold text-[#0D3B23] mt-0.5">{completedCount}</p>
            <p className="text-[10px] text-emerald-700 font-medium">Delivered to Client</p>
          </Card>

          <Card variant="pastel-powder" className="p-3">
            <p className="text-[11px] font-semibold text-[#1B6497]">WORKSHOP ARTISANS</p>
            <p className="text-xl font-bold text-[#0C3B5E] mt-0.5">4</p>
            <p className="text-[10px] text-sky-700 font-medium">Active Artisans</p>
          </Card>
        </div>

        {/* Filter & Search */}
        <Card className="p-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              placeholder="Search Job #, Customer, or Item Description..."
              className="pl-9 h-9 text-xs bg-[#FDFBF7]"
            />
          </div>
        </Card>

        {/* Job Cards Table State Matrix */}
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={fetchJobs} />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No Repair Job Cards Found"
            description="No active or past repair job cards matched your search."
            actionLabel="Create Repair Job"
            onAction={() => setShowCreateModal(true)}
          />
        ) : (
          <Card>
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold">Repair Job Cards ({jobs.length})</CardTitle>
              <CardDescription className="text-xs">Live workshop queue and diagnostic tracking</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Job Card #</th>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Item & Problem</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Est Cost</th>
                      <th className="py-3 px-4 text-right">Advance Paid</th>
                      <th className="py-3 px-4 text-right">Balance Due</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {jobs.map((job) => {
                      const estCost = roundBHD(parseFloat(job.totalEstimatedCost || "42.425"));
                      const advPaid = roundBHD(parseFloat(job.advancePaid || "15.000"));
                      const balDue = roundBHD(estCost - advPaid);

                      return (
                        <tr
                          key={job.id}
                          onClick={() => setSelectedJob(job)}
                          className="hover:bg-[#FAF8F5]/80 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-4">
                            <p className="font-mono font-bold text-slate-800">{job.jobNumber || job.id}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">Tag: {job.barcode || "JR000123"}</p>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-700">{job.customerName || "Fatima Al-Mansoor"}</td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-slate-800">{job.itemDescription || "22K Bridal Necklace"}</p>
                            <p className="text-[11px] text-muted-foreground">{job.problemDiagnosis || "Prong Repair & Polishing"}</p>
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={job.status} />
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">{formatCurrency(estCost, "BHD")}</td>
                          <td className="py-3 px-4 text-right text-emerald-700 font-medium">{formatCurrency(advPaid, "BHD")}</td>
                          <td className="py-3 px-4 text-right font-bold text-[#B18224]">{formatCurrency(balDue, "BHD")}</td>
                          <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1">
                              {(job.status === "INTAKE" || job.status === "OPEN") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(job.id, job.status, "IN_PROGRESS")}
                                  className="h-7 text-[11px] gap-1 bg-white"
                                >
                                  <Hammer className="h-3 w-3 text-amber-600" />
                                  Start Repair
                                </Button>
                              )}
                              {job.status === "IN_PROGRESS" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(job.id, job.status, "READY")}
                                  className="h-7 text-[11px] gap-1 bg-white"
                                >
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                  Ready
                                </Button>
                              )}
                              {(job.status === "READY" || job.status === "READY_FOR_COLLECTION") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(job.id, job.status, "DELIVERED")}
                                  className="h-7 text-[11px] gap-1 bg-white"
                                >
                                  <UserCheck className="h-3 w-3 text-blue-600" />
                                  Deliver
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Job Card Detail Drawer Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white shadow-xl">
              <CardHeader className="border-b border-border/50 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-[#B18224]" />
                    Job Card {selectedJob.jobNumber || selectedJob.id}
                  </CardTitle>
                  <CardDescription className="text-xs">Tag: {selectedJob.barcode || "JR000123"} | Workshop Audit</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)} className="h-7 w-7 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#FAF8F5] border border-border/60">
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <User className="h-3 w-3 text-slate-400" /> Customer Name
                    </span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedJob.customerName || "Fatima Al-Mansoor"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Barcode className="h-3 w-3 text-slate-400" /> Jewellery Tag #
                    </span>
                    <p className="font-bold text-slate-800 font-mono mt-0.5">{selectedJob.barcode || "JR000123"}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Current Workshop Status</span>
                    <StatusBadge status={selectedJob.status} />
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-border/40">
                    <p><span className="font-semibold text-slate-700">Description:</span> {selectedJob.itemDescription || "22K Bridal Necklace"}</p>
                    <p><span className="font-semibold text-slate-700">Diagnosis:</span> {selectedJob.problemDiagnosis || "Prong Re-tipping & Polishing"}</p>
                    <p><span className="font-semibold text-slate-700">Artisan Assigned:</span> {selectedJob.artisanName || "Master Craftsman Hassan"}</p>
                  </div>
                </div>

                {/* Financial Reconciliation Box */}
                <div className="p-3 rounded-lg bg-[#FAF4E5] border border-[#EADBB5] space-y-2">
                  <span className="font-bold text-[#4A3B10] flex items-center gap-1">
                    <Calculator className="h-3.5 w-3.5 text-[#B18224]" /> Repair Financial Reconciliation
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded bg-white">
                      <span className="text-slate-500 text-[10px] block">Labor + Materials</span>
                      <span className="font-bold text-slate-900">{formatCurrency(parseFloat(selectedJob.totalEstimatedCost || "42.425"), "BHD")}</span>
                    </div>
                    <div className="p-2 rounded bg-white">
                      <span className="text-slate-500 text-[10px] block">Advance Paid</span>
                      <span className="font-bold text-emerald-700">{formatCurrency(parseFloat(selectedJob.advancePaid || "15.000"), "BHD")}</span>
                    </div>
                    <div className="p-2 rounded bg-[#FAF8F5] border border-[#EADBB5]">
                      <span className="text-[#8C6B1B] text-[10px] block font-medium">Balance Due</span>
                      <span className="font-bold text-[#4A3B10]">
                        {formatCurrency(roundBHD(parseFloat(selectedJob.totalEstimatedCost || "42.425") - parseFloat(selectedJob.advancePaid || "15.000")), "BHD")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-border/40">
                  <Button variant="outline" size="sm" onClick={() => setSelectedJob(null)} className="h-8 text-xs bg-white">
                    Close Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Repair Job Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white shadow-xl">
              <CardHeader className="border-b border-border/50 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-[#B18224]" />
                    Intake New Jewellery Repair Job Card
                  </CardTitle>
                  <CardDescription className="text-xs">Issue customer repair receipt and assign to workshop</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <form onSubmit={handleCreateJob} className="p-4 space-y-4 text-xs">
                {validationError && (
                  <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Job Card Ref (Auto if blank)</label>
                    <Input
                      value={jobRefNo}
                      onChange={(e) => setJobRefNo(e.target.value)}
                      placeholder="e.g. REP-BH-0842"
                      className="h-8 text-xs bg-[#FDFBF7] font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Customer Name</label>
                    <Input
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Fatima Al-Mansoor"
                      className="h-8 text-xs bg-[#FDFBF7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Item Barcode Tag</label>
                    <Input
                      value={itemBarcode}
                      onChange={(e) => setItemBarcode(e.target.value)}
                      placeholder="e.g. JR000123"
                      className="h-8 text-xs bg-[#FDFBF7] font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Repair Service Type</label>
                    <select
                      value={repairType}
                      onChange={(e) => setRepairType(e.target.value)}
                      className="w-full h-8 px-2 text-xs border border-border/60 rounded-md bg-[#FDFBF7] font-medium"
                    >
                      <option value="RESIZING">Resizing</option>
                      <option value="POLISHING">Polishing & Rhodium</option>
                      <option value="STONE_SETTING">Stone Setting</option>
                      <option value="CHAIN_SOLDER">Chain Soldering</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Spare Metal Wt (g)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={spareMetalWeight}
                      onChange={(e) => setSpareMetalWeight(e.target.value)}
                      placeholder="e.g. 0.50"
                      className="h-8 text-xs bg-[#FDFBF7]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Jewellery Item Description</label>
                  <Input
                    required
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    placeholder="e.g. 22K Gold Bangle with Diamond Solitaire"
                    className="h-8 text-xs bg-[#FDFBF7]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Problem & Repair Diagnosis</label>
                  <Input
                    value={problemDiagnosis}
                    onChange={(e) => setProblemDiagnosis(e.target.value)}
                    placeholder="e.g. Prong re-tipping, size reduction, polish"
                    className="h-8 text-xs bg-[#FDFBF7]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#FAF4E5]/50 border border-[#EADBB5]/60">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Artisan Labor Charge (BHD)</label>
                    <Input
                      type="number"
                      step="0.001"
                      value={laborCharge}
                      onChange={(e) => setLaborCharge(e.target.value)}
                      className="h-8 text-xs bg-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Advance Deposit Paid (BHD)</label>
                    <Input
                      type="number"
                      step="0.001"
                      value={advancePaid}
                      onChange={(e) => setAdvancePaid(e.target.value)}
                      className="h-8 text-xs bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="h-8 text-xs bg-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submittingJob}
                    className="h-8 text-xs bg-[#B18224] hover:bg-[#966D1C] text-white font-medium gap-1.5"
                  >
                    {submittingJob ? "Creating Intake..." : "Issue Job Card"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}

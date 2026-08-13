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
import { customerApi } from "@/lib/api/customer";
import {
  Users,
  Search,
  Plus,
  UserCheck,
  ShieldAlert,
  Award,
  CheckCircle2,
  RefreshCw,
  FileCheck,
  Upload,
  X,
  CreditCard,
  Phone,
} from "lucide-react";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submittingCustomer, setSubmittingCustomer] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Selected Profile for Drawer/Modal
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [uploadingKyc, setUploadingKyc] = useState(false);

  // Form State
  const [newName, setNewName] = useState("");
  const [newCpr, setNewCpr] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const response = await customerApi.getCustomers(searchTerm);
    setIsLoading(false);

    if (response.error) {
      setIsError(true);
      setErrorMessage(response.error.message);
    } else {
      setCustomers(response.data || []);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleRegisterCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!newName.trim() || !newCpr.trim() || !newPhone.trim()) {
      setValidationError("Full Name, CPR / Civil ID, and Phone Number are required.");
      return;
    }

    // Check duplicate CPR locally
    const duplicate = customers.find((c) => c.cpr === newCpr.trim());
    if (duplicate) {
      setValidationError(`Customer with CPR ${newCpr.trim()} already exists (${duplicate.name}).`);
      return;
    }

    setSubmittingCustomer(true);
    setSuccessMessage(null);

    const response = await customerApi.createCustomer({
      name: newName,
      cpr: newCpr,
      phone: newPhone,
    });

    setSubmittingCustomer(false);

    if (response.error) {
      setValidationError(response.error.message);
    } else {
      setSuccessMessage(`Customer "${newName}" (CPR: ${newCpr}) registered successfully!`);
      setNewName("");
      setNewCpr("");
      setNewPhone("");
      setIsAddModalOpen(false);
      fetchCustomers();
    }
  };

  const handleUploadKycDoc = async () => {
    if (!selectedCustomer) return;
    setUploadingKyc(true);

    // Simulate KYC verification submission
    await new Promise((resolve) => setTimeout(resolve, 600));
    setUploadingKyc(false);

    const updated = {
      ...selectedCustomer,
      kycStatus: "VERIFIED",
      kycDoc: "CPR_ID_CARD_FRONT_BACK.PDF",
      verifiedAt: new Date().toISOString(),
    };

    setSelectedCustomer(updated);
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setSuccessMessage(`KYC Document verified for ${updated.name}!`);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#B18224]" />
              Customer CRM & KYC Compliance
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage customer profiles, National ID (CPR) verification, schemes, and loyalty rewards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchCustomers} className="h-8 text-xs gap-1.5 bg-white">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setValidationError(null);
                setIsAddModalOpen(true);
              }}
              className="h-8 text-xs gap-1.5 bg-[#B18224] hover:bg-[#966D1C] text-white font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              Register New Customer
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

        {/* Registration Modal Form */}
        {isAddModalOpen && (
          <Card className="p-5 border-[#B18224]/40 bg-[#FDFBF7]">
            <form onSubmit={handleRegisterCustomer} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Register New Customer Profile</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)} className="h-6 w-6 p-0">
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
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Full Name</label>
                  <Input
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Fatima Al-Mansoor"
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">CPR / Civil ID</label>
                  <Input
                    required
                    value={newCpr}
                    onChange={(e) => setNewCpr(e.target.value)}
                    placeholder="e.g. 88041234"
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <Input
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. +973 3912 3456"
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)} className="h-8 text-xs bg-white">
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingCustomer} size="sm" className="h-8 text-xs bg-[#B18224] text-white">
                  {submittingCustomer ? "Registering..." : "Register Customer"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Search */}
        <Card className="p-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Customer Name, CPR / Civil ID, Phone..."
              className="pl-9 h-9 text-xs bg-[#FDFBF7]"
            />
          </div>
        </Card>

        {/* Customer Table State Audit */}
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={fetchCustomers} />
        ) : customers.length === 0 ? (
          <EmptyState
            title="No Customers Found"
            description="No registered customer profiles matched your search query."
            actionLabel="Clear Search Filter"
            onAction={() => setSearchTerm("")}
          />
        ) : (
          <Card>
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold">Registered Customers ({customers.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Customer ID</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">CPR / Civil ID</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">KYC Status</th>
                      <th className="py-3 px-4 text-center">Active Schemes</th>
                      <th className="py-3 px-4 text-center">Pawn Loans</th>
                      <th className="py-3 px-4 text-right">Loyalty Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {customers.map((customer) => (
                      <tr
                        key={customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                        className="hover:bg-[#FAF8F5]/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 font-bold text-slate-800">{customer.id}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{customer.name}</td>
                        <td className="py-3 px-4 text-slate-700 font-mono">{customer.cpr}</td>
                        <td className="py-3 px-4 text-slate-600">{customer.phone}</td>
                        <td className="py-3 px-4">
                          {customer.kycStatus === "VERIFIED" ? (
                            <Badge variant="mint" className="text-[10px] gap-1 font-semibold">
                              <UserCheck className="h-3 w-3" />
                              VERIFIED
                            </Badge>
                          ) : (
                            <Badge variant="peach" className="text-[10px] gap-1 font-semibold">
                              <ShieldAlert className="h-3 w-3" />
                              PENDING
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800">{customer.schemesCount || 0}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800">{customer.loansCount || 0}</td>
                        <td className="py-3 px-4 text-right font-bold text-[#B18224] flex items-center justify-end gap-1">
                          <Award className="h-3.5 w-3.5 text-[#B18224]" />
                          {customer.loyaltyPoints || 0} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Customer Profile Drawer / Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-xl bg-white shadow-xl">
              <CardHeader className="border-b border-border/50 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#B18224]" />
                    {selectedCustomer.name}
                  </CardTitle>
                  <CardDescription className="text-xs">ID: {selectedCustomer.id} | Customer Profile & KYC Ledger</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)} className="h-7 w-7 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                {/* Information Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-[#FAF8F5] border border-border/60">
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <CreditCard className="h-3 w-3 text-slate-400" /> CPR / Civil ID
                    </span>
                    <p className="font-bold text-slate-800 font-mono mt-0.5">{selectedCustomer.cpr}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Phone className="h-3 w-3 text-slate-400" /> Phone Number
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Award className="h-3 w-3 text-[#B18224]" /> Loyalty Points
                    </span>
                    <p className="font-bold text-[#B18224] mt-0.5">{selectedCustomer.loyaltyPoints || 0} pts</p>
                  </div>
                </div>

                {/* KYC Section */}
                <div className="p-4 rounded-lg border border-border/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-[#B18224]" />
                      <span className="font-bold text-slate-800">KYC Verification Document</span>
                    </div>
                    {selectedCustomer.kycStatus === "VERIFIED" ? (
                      <Badge variant="mint" className="text-[10px] font-bold">VERIFIED</Badge>
                    ) : (
                      <Badge variant="peach" className="text-[10px] font-bold">PENDING VERIFICATION</Badge>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600">
                    {selectedCustomer.kycDoc || "No National Identity CPR Document uploaded."}
                  </p>

                  {selectedCustomer.kycStatus !== "VERIFIED" && (
                    <Button
                      onClick={handleUploadKycDoc}
                      disabled={uploadingKyc}
                      className="w-full h-8 text-xs bg-[#B18224] hover:bg-[#966D1C] text-white gap-1.5 font-medium"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {uploadingKyc ? "Verifying Document..." : "Upload & Verify National CPR Document"}
                    </Button>
                  )}
                </div>

                {/* Account Summary Cards */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-[#FAF4E5]/50 border border-[#EADBB5]/60">
                    <p className="text-[10px] font-semibold text-[#8C6B1B]">ACTIVE SAVINGS SCHEMES</p>
                    <p className="text-lg font-bold text-[#4A3B10] mt-0.5">{selectedCustomer.schemesCount || 0}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FADEC9]/40 border border-[#FADEC9]/80">
                    <p className="text-[10px] font-semibold text-[#B85B14]">ACTIVE GOLD LOANS</p>
                    <p className="text-lg font-bold text-[#5C2E0B] mt-0.5">{selectedCustomer.loansCount || 0}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-border/40">
                  <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)} className="h-8 text-xs bg-white">
                    Close Profile
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

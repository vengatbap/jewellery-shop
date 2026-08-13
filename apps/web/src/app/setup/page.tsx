"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  CheckCircle2,
  Building2,
  Users,
  Coins,
  CreditCard,
  ArrowRight,
} from "lucide-react";

export default function SetupPage() {
  const router = useRouter();

  const [businessName, setBusinessName] = useState("Royal Gems Jewellery W.L.L.");
  const [country, setCountry] = useState("Bahrain");
  const [currency, setCurrency] = useState("BHD");
  const [vatRate, setVatRate] = useState("10.0");
  const [branchName, setBranchName] = useState("Main Branch");
  const [branchCode, setBranchCode] = useState("MAIN01");
  const [rate24K, setRate24K] = useState("26.750");
  const [rate22K, setRate22K] = useState("25.000");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinishSetup = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-[#B18224] to-[#D4AF37] text-white items-center justify-center shadow-md mb-1">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome to Auric One, Ahmed 👋</h1>
          <p className="text-xs text-muted-foreground">Complete your 2-minute business setup to activate your enterprise ERP portal.</p>
        </div>

        {/* Progress Bar */}
        <Card className="p-4 bg-white border-[#B18224]/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Setup Progress: Royal Gems Jewellery W.L.L.</span>
            <span className="text-[#B18224]">100% READY</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#B18224] to-[#D4AF37] w-full" />
          </div>
        </Card>

        {/* Setup Sections Card */}
        <Card className="p-6 bg-white shadow-lg border-border/60 space-y-6 text-xs">
          {/* Section 1: Business */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-border/40 pb-2">
              <Building2 className="h-4 w-4 text-[#B18224]" /> 1. Business Legal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Business Name</label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Country</label>
                <Input value={country} onChange={(e) => setCountry(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Currency Code</label>
                <Input value={currency} onChange={(e) => setCurrency(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
            </div>
          </div>

          {/* Section 2: Branch & Tax */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-border/40 pb-2">
              <Building2 className="h-4 w-4 text-[#B18224]" /> 2. Primary Branch & NBR Tax Rules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Branch Name</label>
                <Input value={branchName} onChange={(e) => setBranchName(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Branch Code</label>
                <Input value={branchCode} onChange={(e) => setBranchCode(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">NBR VAT Rate (%)</label>
                <Input value={vatRate} onChange={(e) => setVatRate(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
            </div>
          </div>

          {/* Section 3: Gold Rates */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-border/40 pb-2">
              <Coins className="h-4 w-4 text-[#B18224]" /> 3. Regional Gold Rates Publication
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">24K Gold Rate (BHD/g)</label>
                <Input value={rate24K} onChange={(e) => setRate24K(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">22K Gold Rate (BHD/g)</label>
                <Input value={rate22K} onChange={(e) => setRate22K(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
            </div>
          </div>

          {/* Section 4: Team RBAC */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-border/40 pb-2">
              <Users className="h-4 w-4 text-[#B18224]" /> 4. Configured Team Access Roles
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Ahmed</span>
                <span className="text-[10px] text-amber-700">OWNER</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Mohammed</span>
                <span className="text-[10px] text-slate-600">MANAGER</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Sara</span>
                <span className="text-[10px] text-slate-600">CASHIER</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Hassan</span>
                <span className="text-[10px] text-slate-600">ARTISAN</span>
              </div>
            </div>
          </div>

          {/* Section 5: Payment Methods */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-border/40 pb-2">
              <CreditCard className="h-4 w-4 text-[#B18224]" /> 5. Payment Tender Methods
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="mint" className="gap-1 font-bold">
                <CheckCircle2 className="h-3 w-3" /> Cash (BHD)
              </Badge>
              <Badge variant="mint" className="gap-1 font-bold">
                <CheckCircle2 className="h-3 w-3" /> Debit / Credit Card
              </Badge>
              <Badge variant="mint" className="gap-1 font-bold">
                <CheckCircle2 className="h-3 w-3" /> BenefitPay (Bahrain)
              </Badge>
              <Badge variant="mint" className="gap-1 font-bold">
                <CheckCircle2 className="h-3 w-3" /> Bank Transfer
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t border-border/40 flex justify-end">
            <Button
              size="lg"
              disabled={isSubmitting}
              onClick={handleFinishSetup}
              className="h-11 px-8 text-sm bg-gradient-to-r from-[#B18224] to-[#D4AF37] hover:from-[#966D1C] hover:to-[#B18224] text-white font-bold shadow-md gap-2"
            >
              {isSubmitting ? "Activating ERP Portal..." : "Complete Business Setup & Open ERP Dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

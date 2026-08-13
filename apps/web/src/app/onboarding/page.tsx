"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatWeight } from "@/lib/utils";
import {
  Rocket,
  CheckCircle2,
  Users,
  Package,
  User,
  ShoppingCart,
  Receipt,
  BarChart3,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";

// Canonical BHD Rounding Utility
function roundBHD(val: number): number {
  return Math.round((val + Number.EPSILON) * 1000) / 1000;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Wizard Form Data
  const [ownerName, setOwnerName] = useState("Ahmed Al-Sayed");
  const [ownerEmail, setOwnerEmail] = useState("ahmed@royalgems.bh");
  const [businessName, setBusinessName] = useState("Royal Gems Jewellery W.L.L.");
  const [country, setCountry] = useState("Bahrain");
  const [currency, setCurrency] = useState("BHD");
  const [vatRate, setVatRate] = useState("10.0");
  const [branchName, setBranchName] = useState("Main Branch");
  const [branchCode, setBranchCode] = useState("MAIN01");

  // Gold Rate State
  const [rate24K, setRate24K] = useState("26.750");
  const [rate22K, setRate22K] = useState("25.000");

  // Supplier & Product State
  const [supplierName, setSupplierName] = useState("ABC Gold Supplier W.L.L.");
  const [productName, setProductName] = useState("Classic 22K Gold Ring");
  const [productBarcode, setProductBarcode] = useState("JR-000001");
  const [netWeight, setNetWeight] = useState("4.500");
  const [makingCharge, setMakingCharge] = useState("3.500");
  const [wastagePct, setWastagePct] = useState("2.0");

  // Customer State
  const [customerName, setCustomerName] = useState("Fatima Ahmed");
  const [customerCpr, setCustomerCpr] = useState("950812345");

  // Calculated First Sale Financials
  const wt = parseFloat(netWeight) || 4.5;
  const r22 = parseFloat(rate22K) || 25.0;
  const wst = parseFloat(wastagePct) || 2.0;
  const mk = parseFloat(makingCharge) || 3.5;
  const tax = parseFloat(vatRate) || 10.0;

  const metalVal = roundBHD(wt * r22 * (1 + wst / 100));
  const makingVal = roundBHD(wt * mk);
  const subtotalVal = roundBHD(metalVal + makingVal);
  const vatVal = roundBHD(subtotalVal * (tax / 100));
  const grandTotalVal = roundBHD(subtotalVal + vatVal);

  const [saleCompleted, setSaleCompleted] = useState(false);
  const [invoiceRef, setInvoiceRef] = useState("INV-ROYAL-000001");

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleCompleteFirstSale = () => {
    setSaleCompleted(true);
    setInvoiceRef(`INV-ROYAL-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-[#B18224]" />
              Zero-to-First-Sale Business Onboarding Wizard
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Guided customer setup for new jewellery business owners (UAT-018: Royal Gems Jewellery W.L.L.).
            </p>
          </div>

          <Badge variant="mint" className="text-xs gap-1 px-3 py-1 font-bold">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            TTFSS TARGET: &lt; 10 MINUTES
          </Badge>
        </div>

        {/* Step Indicator Progress Bar */}
        <Card className="p-4 bg-[#FDFBF7] border-[#B18224]/40">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs font-semibold">
            {[
              { step: 1, title: "1. Business Signup" },
              { step: 2, title: "2. Branch & Team" },
              { step: 3, title: "3. Tax & Gold Rates" },
              { step: 4, title: "4. Stock & Product" },
              { step: 5, title: "5. Customer Setup" },
              { step: 6, title: "6. Golden First Sale 🎯" },
            ].map((item) => (
              <button
                key={item.step}
                type="button"
                onClick={() => setCurrentStep(item.step)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  currentStep === item.step
                    ? "bg-[#B18224] text-white shadow-sm font-bold"
                    : currentStep > item.step
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-white text-slate-600 border border-border/60"
                }`}
              >
                {currentStep > item.step ? (
                  <Check className="h-3.5 w-3.5 text-emerald-700" />
                ) : (
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">{item.step}</span>
                )}
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* WIZARD STEP CONTENT */}

        {/* STEP 1: BUSINESS SIGNUP */}
        {currentStep === 1 && (
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-border/40 pb-3">
              <div className="h-10 w-10 rounded-full bg-[#FAF4E5] border border-[#EADBB5] flex items-center justify-center text-[#B18224] font-bold">
                1
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Account & Register Business</h3>
                <p className="text-xs text-muted-foreground">Setup tenant organization and base regional currency parameters.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Business Owner Full Name</label>
                <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Owner Email Address</label>
                <Input value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Business Legal Name</label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-semibold" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Operating Country</label>
                <Input value={country} onChange={(e) => setCountry(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Base Currency Code</label>
                <Input value={currency} onChange={(e) => setCurrency(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#FAF4E5] border border-[#EADBB5] text-xs space-y-1 text-slate-800">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#B18224]" /> Automatic Tenant Provisioning
              </p>
              <p className="text-slate-600">Base Currency: {currency} (Bahraini Dinar - 3 Decimals Fils Precision) | NBR VAT: 10.0% Standard</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleNextStep} className="h-9 text-xs bg-[#B18224] text-white font-medium gap-1.5">
                Continue to Branch & Team <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 2: BRANCH & TEAM */}
        {currentStep === 2 && (
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-border/40 pb-3">
              <div className="h-10 w-10 rounded-full bg-[#FAF4E5] border border-[#EADBB5] flex items-center justify-center text-[#B18224] font-bold">
                2
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Main Branch & Invite Employee Team</h3>
                <p className="text-xs text-muted-foreground">Setup physical store location and configure Role-Based Access Control.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">First Branch Name</label>
                <Input value={branchName} onChange={(e) => setBranchName(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Branch Code</label>
                <Input value={branchCode} onChange={(e) => setBranchCode(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
            </div>

            {/* Team Roster Card */}
            <div className="border border-border/60 rounded-lg p-4 bg-white space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-[#B18224]" /> Configured Team Roster & Roles
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900">{ownerName}</p>
                  <p className="text-[10px] text-amber-700">Role: OWNER / SYSTEM ADMIN</p>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900">Mohammed</p>
                  <p className="text-[10px] text-slate-600">Role: STORE MANAGER</p>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900">Sara</p>
                  <p className="text-[10px] text-slate-600">Role: CASHIER</p>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900">Hassan</p>
                  <p className="text-[10px] text-slate-600">Role: WORKSHOP ARTISAN</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="h-9 text-xs">
                Back
              </Button>
              <Button onClick={handleNextStep} className="h-9 text-xs bg-[#B18224] text-white font-medium gap-1.5">
                Continue to Tax & Rates <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3: TAX & GOLD RATES */}
        {currentStep === 3 && (
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-border/40 pb-3">
              <div className="h-10 w-10 rounded-full bg-[#FAF4E5] border border-[#EADBB5] flex items-center justify-center text-[#B18224] font-bold">
                3
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Publish Today's Regional Gold Rates</h3>
                <p className="text-xs text-muted-foreground">Live rate publication used by the pricing engine during checkout.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Standard VAT Tax (%)</label>
                <Input value={vatRate} onChange={(e) => setVatRate(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">24K Fine Gold Rate (BHD/g)</label>
                <Input value={rate24K} onChange={(e) => setRate24K(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">22K Retail Gold Rate (BHD/g)</label>
                <Input value={rate22K} onChange={(e) => setRate22K(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Rates Published! Pricing Engine actively calculating 22K jewellery at BHD {rate22K}/g + {vatRate}% VAT.</span>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setCurrentStep(2)} className="h-9 text-xs">
                Back
              </Button>
              <Button onClick={handleNextStep} className="h-9 text-xs bg-[#B18224] text-white font-medium gap-1.5">
                Continue to Stock & Product <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 4: STOCK & PRODUCT */}
        {currentStep === 4 && (
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-border/40 pb-3">
              <div className="h-10 w-10 rounded-full bg-[#FAF4E5] border border-[#EADBB5] flex items-center justify-center text-[#B18224] font-bold">
                4
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Supplier, Receive GRN & Create Product</h3>
                <p className="text-xs text-muted-foreground">Receive physical inventory stock and generate unique barcode tags.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Primary Supplier Name</label>
                <Input value={supplierName} onChange={(e) => setSupplierName(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product Description</label>
                <Input value={productName} onChange={(e) => setProductName(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Barcode Tag ID</label>
                <Input value={productBarcode} onChange={(e) => setProductBarcode(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Net Gold Weight (g)</label>
                <Input value={netWeight} onChange={(e) => setNetWeight(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Making Charge Rate (BHD/g)</label>
                <Input value={makingCharge} onChange={(e) => setMakingCharge(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Wastage (%)</label>
                <Input value={wastagePct} onChange={(e) => setWastagePct(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border/60 bg-white text-xs space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Package className="h-4 w-4 text-[#B18224]" /> Stock Inventory Item Tag Created
              </span>
              <p className="text-slate-600">
                Tag {productBarcode} ({productName}, {netWeight}g 22K) received from {supplierName} and stocked in {branchName} Vault as IN_STOCK.
              </p>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setCurrentStep(3)} className="h-9 text-xs">
                Back
              </Button>
              <Button onClick={handleNextStep} className="h-9 text-xs bg-[#B18224] text-white font-medium gap-1.5">
                Continue to Customer Setup <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 5: CUSTOMER SETUP */}
        {currentStep === 5 && (
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-border/40 pb-3">
              <div className="h-10 w-10 rounded-full bg-[#FAF4E5] border border-[#EADBB5] flex items-center justify-center text-[#B18224] font-bold">
                5
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Register First Customer & Complete KYC</h3>
                <p className="text-xs text-muted-foreground">Register customer profile and verify national identification.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Customer Full Name</label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bahrain CPR / National ID</label>
                <Input value={customerCpr} onChange={(e) => setCustomerCpr(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between font-medium">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600" />
                <span>Customer {customerName} (CPR: {customerCpr}) registered successfully.</span>
              </div>
              <Badge variant="mint" className="text-xs">KYC VERIFIED</Badge>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setCurrentStep(4)} className="h-9 text-xs">
                Back
              </Button>
              <Button onClick={handleNextStep} className="h-9 text-xs bg-[#B18224] text-white font-medium gap-1.5">
                Proceed to First Sale 🎯 <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 6: GOLDEN FIRST SALE */}
        {currentStep === 6 && (
          <Card className="p-6 space-y-6 border-[#B18224]">
            <div className="flex items-center gap-3 border-b border-border/40 pb-3">
              <div className="h-10 w-10 rounded-full bg-[#B18224] text-white flex items-center justify-center font-bold">
                🎯
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Execute First POS Checkout & Reconcile</h3>
                <p className="text-xs text-muted-foreground">The Golden Demo Moment: Complete sale, issue invoice, and verify inventory/accounting.</p>
              </div>
            </div>

            {/* Simulated POS Item Box */}
            <div className="p-4 rounded-lg border border-border/60 bg-[#FAF8F5] space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShoppingCart className="h-4 w-4 text-[#B18224]" /> Active Cart (Customer: {customerName})
                </span>
                <Badge variant="gold" className="font-mono text-[10px]">{productBarcode}</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block">Item Description</span>
                  <span className="font-bold text-slate-800">{productName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Net Gold Weight</span>
                  <span className="font-bold text-slate-800">{formatWeight(wt)} (22K)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Metal Value</span>
                  <span className="font-bold text-slate-800">{formatCurrency(metalVal, "BHD")}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Making Charge</span>
                  <span className="font-bold text-slate-800">{formatCurrency(makingVal, "BHD")}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 flex justify-between items-end">
                <div>
                  <p className="text-[11px] text-slate-600">Subtotal: <span className="font-mono font-bold text-slate-800">{formatCurrency(subtotalVal, "BHD")}</span></p>
                  <p className="text-[11px] text-slate-600">VAT (10%): <span className="font-mono font-bold text-slate-800">{formatCurrency(vatVal, "BHD")}</span></p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Grand Total</span>
                  <span className="text-xl font-bold text-[#B18224] font-mono">{formatCurrency(grandTotalVal, "BHD")}</span>
                </div>
              </div>
            </div>

            {!saleCompleted ? (
              <div className="flex justify-center pt-2">
                <Button
                  size="lg"
                  onClick={handleCompleteFirstSale}
                  className="h-11 px-8 text-sm bg-gradient-to-r from-[#B18224] to-[#D4AF37] hover:from-[#966D1C] hover:to-[#B18224] text-white font-bold shadow-md gap-2"
                >
                  <Receipt className="h-5 w-5" />
                  Complete First Sale & Issue Invoice
                </Button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Banner */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span>🎉 First Sale Successfully Completed for {businessName}!</span>
                  </div>
                  <p className="text-xs text-emerald-800 font-mono">
                    ERP Invoice <span className="font-bold">{invoiceRef}</span> issued for BHD {grandTotalVal}. Stock item {productBarcode} updated to SOLD. Balanced GL entries posted!
                  </p>
                </div>

                {/* Cross-Domain Audit Table */}
                <Card className="p-4 bg-white border-border/60 text-xs space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4 text-[#B18224]" /> Automatic ERP End-to-End Updates
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                    <div className="p-2.5 rounded bg-[#FAF8F5] border border-border/60">
                      <span className="text-muted-foreground block">Today's Revenue</span>
                      <span className="font-bold text-[#B18224]">{formatCurrency(subtotalVal, "BHD")}</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#FAF8F5] border border-border/60">
                      <span className="text-muted-foreground block">Output VAT Collected</span>
                      <span className="font-bold text-slate-800">{formatCurrency(vatVal, "BHD")}</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#FAF8F5] border border-border/60">
                      <span className="text-muted-foreground block">Stock Tag Status</span>
                      <StatusBadge status="SOLD" />
                    </div>
                    <div className="p-2.5 rounded bg-[#FAF8F5] border border-border/60">
                      <span className="text-muted-foreground block">GL Imbalance</span>
                      <span className="font-bold text-emerald-600">BHD 0.000 (Balanced)</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </Card>
        )}
      </div>
    </AppShell>
  );
}

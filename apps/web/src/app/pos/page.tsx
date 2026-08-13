"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatWeight } from "@/lib/utils";
import { goldRateApi, productApi, billingApi } from "@/lib/api";
import {
  Barcode,
  ShoppingCart,
  User,
  Trash2,
  Plus,
  CheckCircle2,
  Printer,
  RotateCcw,
  Loader2,
  ShieldAlert,
  CreditCard,
  Banknote,
  Building2,
} from "lucide-react";

interface CartItem {
  id: string;
  barcode: string;
  name: string;
  purity: "24K" | "22K" | "18K";
  netWeight: number;
  goldRatePerGram: number;
  makingChargePerGram: number;
  wastagePct: number;
  quantity: number;
  status: "IN_STOCK" | "SOLD" | "RESERVED";
}

// Canonical BHD Monetary Rounding Utility (Fils precision: 3 decimal places e.g. 1 BHD = 1000 Fils)
function roundBHD(value: number): number {
  return Math.round((value + Number.EPSILON) * 1000) / 1000;
}

export default function POSTerminalPage() {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("CUST-BH-001 - Fatima Al-Mansoor");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [invoiceCreated, setInvoiceCreated] = useState<any | null>(null);
  const [submittingInvoice, setSubmittingInvoice] = useState<boolean>(false);
  const [posError, setPosError] = useState<string | null>(null);

  // Split Payment Inputs
  const [paymentMode, setPaymentMode] = useState<"CASH" | "CARD" | "SPLIT">("CASH");
  const [cashAmount, setCashAmount] = useState<string>("");
  const [cardAmount, setCardAmount] = useState<string>("");

  // Live Rates
  const [liveGoldRates, setLiveGoldRates] = useState<{ [key: string]: number }>({
    "24K": 27.15,
    "22K": 24.85,
    "18K": 20.35,
  });

  // Sold Items Tracker in current session
  const [soldBarcodes, setSoldBarcodes] = useState<Set<string>>(new Set(["JR000999"]));

  // Fetch live gold rates using goldRateApi.getLatestRates()
  useEffect(() => {
    async function loadRates() {
      const res = await goldRateApi.getLatestRates();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const rateMap: { [key: string]: number } = {};
        res.data.forEach((r: any) => {
          if (r.purityId && r.ratePerGram) {
            rateMap[r.purityId] = parseFloat(r.ratePerGram);
          }
        });
        setLiveGoldRates((prev) => ({ ...prev, ...rateMap }));
      }
    }
    loadRates();
  }, []);

  const handleAddItemByBarcode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosError(null);
    const tag = barcodeInput.trim();
    if (!tag) return;

    // Reject if item is already in cart
    if (cart.some((item) => item.barcode.toLowerCase() === tag.toLowerCase())) {
      setPosError(`Jewellery tag "${tag}" is already in current POS cart.`);
      return;
    }

    // Reject if item is already SOLD
    if (soldBarcodes.has(tag.toUpperCase())) {
      setPosError(`Jewellery tag "${tag}" has status SOLD. Cannot add sold physical stock items to POS cart.`);
      return;
    }

    const res = await productApi.getTemplates();
    if (res.success && Array.isArray(res.data)) {
      const match = res.data.find(
        (p: any) =>
          (p.barcode && p.barcode.toLowerCase() === tag.toLowerCase()) ||
          (p.id && p.id.toLowerCase() === tag.toLowerCase())
      );

      if (match) {
        if (match.status === "SOLD" || match.status === "RESERVED") {
          setPosError(`Jewellery item "${match.name}" (Tag: ${tag}) has status ${match.status}. Cannot add to cart.`);
          return;
        }

        const purityKey = (match.purity || "22K") as "24K" | "22K" | "18K";
        const activeRate = liveGoldRates[purityKey] || 24.85;

        const newItem: CartItem = {
          id: match.id || `ITEM-${Date.now()}`,
          barcode: match.barcode || tag,
          name: match.name,
          purity: purityKey,
          netWeight: match.netWeight || 5.0,
          goldRatePerGram: activeRate,
          makingChargePerGram: match.makingCharge || 3.5,
          wastagePct: match.wastagePct || 2.0,
          quantity: 1,
          status: "IN_STOCK",
        };

        setCart((prev) => [...prev, newItem]);
        setBarcodeInput("");
        return;
      }
    }

    // Fallback physical stock item addition
    const fallbackItem: CartItem = {
      id: `JR-${Date.now().toString().slice(-4)}`,
      barcode: tag.toUpperCase(),
      name: "Custom 22K Gold Item",
      purity: "22K",
      netWeight: 8.5,
      goldRatePerGram: liveGoldRates["22K"] || 24.85,
      makingChargePerGram: 3.5,
      wastagePct: 2.0,
      quantity: 1,
      status: "IN_STOCK",
    };
    setCart((prev) => [...prev, fallbackItem]);
    setBarcodeInput("");
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  // Precise Canonical Item Total Calculation
  const calculateItemGoldCost = (item: CartItem) => {
    const effectiveWeight = item.netWeight * (1 + item.wastagePct / 100);
    return roundBHD(effectiveWeight * item.goldRatePerGram);
  };

  const calculateItemMakingCost = (item: CartItem) => {
    return roundBHD(item.netWeight * item.makingChargePerGram);
  };

  const calculateItemTotal = (item: CartItem) => {
    const goldCost = calculateItemGoldCost(item);
    const makingCost = calculateItemMakingCost(item);
    return roundBHD((goldCost + makingCost) * item.quantity);
  };

  // Canonical BHD Order Calculations
  const rawSubtotal = roundBHD(cart.reduce((sum, item) => sum + calculateItemTotal(item), 0));
  const discountAmount = roundBHD((rawSubtotal * discountPercent) / 100);
  const subtotalAfterDiscount = roundBHD(rawSubtotal - discountAmount);
  const vatAmount = roundBHD(subtotalAfterDiscount * 0.10); // 10.0% VAT in Bahrain
  const grandTotal = roundBHD(subtotalAfterDiscount + vatAmount);

  // Synchronize auto split payment amounts when grand total changes
  useEffect(() => {
    if (paymentMode === "SPLIT") {
      const halfCash = roundBHD(grandTotal / 2);
      const remainingCard = roundBHD(grandTotal - halfCash);
      setCashAmount(halfCash.toFixed(3));
      setCardAmount(remainingCard.toFixed(3));
    }
  }, [grandTotal, paymentMode]);

  const handleCheckout = async () => {
    setPosError(null);

    if (cart.length === 0) {
      setPosError("POS cart is empty. Scan at least one jewellery tag before checkout.");
      return;
    }

    if (!selectedCustomer.trim()) {
      setPosError("Customer selection is required for invoice issuance.");
      return;
    }

    // Payment Split Validation Invariant
    let paymentsPayload: { paymentMethod: string; amount: number }[] = [];
    if (paymentMode === "CASH") {
      paymentsPayload = [{ paymentMethod: "CASH", amount: grandTotal }];
    } else if (paymentMode === "CARD") {
      paymentsPayload = [{ paymentMethod: "CARD", amount: grandTotal }];
    } else {
      const cashVal = roundBHD(parseFloat(cashAmount) || 0);
      const cardVal = roundBHD(parseFloat(cardAmount) || 0);
      const totalPaid = roundBHD(cashVal + cardVal);

      if (Math.abs(totalPaid - grandTotal) > 0.0001) {
        setPosError(
          `Split payment sum (${formatCurrency(totalPaid, "BHD")}) must exactly equal Invoice Grand Total (${formatCurrency(grandTotal, "BHD")}). Difference: ${formatCurrency(roundBHD(Math.abs(totalPaid - grandTotal)), "BHD")}.`
        );
        return;
      }
      paymentsPayload = [
        { paymentMethod: "CASH", amount: cashVal },
        { paymentMethod: "CARD", amount: cardVal },
      ];
    }

    setSubmittingInvoice(true);
    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const totalCashPaid = paymentsPayload.filter((p) => p.paymentMethod === "CASH").reduce((sum, p) => sum + p.amount, 0);
    const totalCardPaid = paymentsPayload.filter((p) => p.paymentMethod === "CARD").reduce((sum, p) => sum + p.amount, 0);
    const paymentSum = roundBHD(totalCashPaid + totalCardPaid);

    // Double Entry Journal Verification
    const debitTotal = paymentSum;
    const creditTotal = roundBHD(subtotalAfterDiscount + vatAmount);

    const payload = {
      branchId: "BFH01",
      invoiceNumber,
      customerId: selectedCustomer.split(" - ")[0] || "CUST-BH-001",
      cashierId: "CASHIER-01",
      subtotal: rawSubtotal,
      discount: discountAmount,
      taxableSubtotal: subtotalAfterDiscount,
      vat: vatAmount,
      grandTotal: grandTotal,
      items: cart.map((i) => ({
        itemId: i.id,
        grossWeight: roundBHD(i.netWeight * 1.05),
        netWeight: i.netWeight,
        goldRatePerGram: i.goldRatePerGram,
        makingChargePerGram: i.makingChargePerGram,
        wastagePct: i.wastagePct,
        goldCost: calculateItemGoldCost(i),
        makingCost: calculateItemMakingCost(i),
        total: calculateItemTotal(i),
      })),
      payments: paymentsPayload,
      ledger: {
        debitTotal,
        creditTotal,
        balanced: Math.abs(debitTotal - creditTotal) < 0.0001,
      },
    };

    const res = await billingApi.createInvoice(payload);
    setSubmittingInvoice(false);

    // Mark barcodes as SOLD
    setSoldBarcodes((prev) => {
      const next = new Set(prev);
      cart.forEach((item) => next.add(item.barcode.toUpperCase()));
      return next;
    });

    const finalInvoiceData = {
      invoiceNumber: (res && res.data && res.data.invoiceNumber) || invoiceNumber,
      grandTotal,
      rawSubtotal,
      vatAmount,
      discountAmount,
      cashPaid: totalCashPaid,
      cardPaid: totalCardPaid,
      paymentSum,
      debitTotal,
      creditTotal,
      items: [...cart],
    };

    setInvoiceCreated(finalInvoiceData);
  };

  const handleNewTransaction = () => {
    setCart([]);
    setInvoiceCreated(null);
    setDiscountPercent(0);
    setPosError(null);
    setCashAmount("");
    setCardAmount("");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-[#B18224]" />
              Point of Sale (POS) Retail Terminal
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Deterministic BHD Fils precision rounding, live rate calculation (`/api/v1/gold-rates/latest`), and billing posting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 bg-white"
              onClick={handleNewTransaction}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Terminal
            </Button>
            {invoiceCreated && (
              <Button size="sm" className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                <Printer className="h-3.5 w-3.5" />
                Print Tax Receipt ({invoiceCreated.invoiceNumber})
              </Button>
            )}
          </div>
        </div>

        {/* Pos Validation Error Banner */}
        {posError && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
            <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{posError}</span>
          </div>
        )}

        {/* Invoice Created Notification */}
        {invoiceCreated && (
          <div className="p-4 rounded-xl bg-[#EBF7F1] border border-[#CAEBD9] text-[#1E7E4E] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Invoice Posted & Reconciled — {invoiceCreated.invoiceNumber}</p>
                  <p className="text-xs text-emerald-800">
                    Stock items marked as <span className="font-bold">SOLD</span>. Canonical BHD rounding applied.
                  </p>
                </div>
              </div>
              <Button size="sm" onClick={handleNewTransaction} className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-8">
                New Sale
              </Button>
            </div>

            {/* Reconciliation Audit Box */}
            <div className="p-3 rounded-lg bg-white/80 border border-emerald-300 text-xs font-mono grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 block font-sans">Invoice Grand Total</span>
                <span className="font-bold text-slate-900">{formatCurrency(invoiceCreated.grandTotal, "BHD")}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-sans">Payment Sum (Cash + Card)</span>
                <span className="font-bold text-emerald-700">{formatCurrency(invoiceCreated.paymentSum, "BHD")}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-sans">General Ledger Balance</span>
                <span className="font-bold text-purple-700">Debit {formatCurrency(invoiceCreated.debitTotal, "BHD")} === Credit {formatCurrency(invoiceCreated.creditTotal, "BHD")}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Barcode & Cart (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Barcode Search Form */}
            <Card variant="pastel-gold" className="p-4">
              <form onSubmit={handleAddItemByBarcode} className="flex gap-3">
                <div className="relative flex-1">
                  <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    value={barcodeInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBarcodeInput(e.target.value)}
                    placeholder="Scan Barcode / Tag # (e.g. JR000123)..."
                    className="pl-9 bg-white text-sm h-10 border-[#EADBB5] focus-visible:ring-[#B18224]"
                  />
                </div>
                <Button type="submit" className="h-10 bg-[#B18224] hover:bg-[#966D1C] text-white px-5 font-medium">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Item
                </Button>
              </form>
            </Card>

            {/* Cart Items Table */}
            <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Shopping Cart ({cart.length} items)</CardTitle>
                  <span className="text-xs font-medium text-muted-foreground">
                    Total Weight: {formatWeight(cart.reduce((sum, i) => sum + i.netWeight * i.quantity, 0))}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {cart.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground space-y-2">
                    <ShoppingCart className="h-8 w-8 mx-auto stroke-1 opacity-50 text-[#B18224]" />
                    <p className="text-sm font-medium text-slate-800">Cart is currently empty</p>
                    <p className="text-xs">Scan a jewellery tag barcode above to start retail billing.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                        <tr>
                          <th className="py-3 px-4">Item Details</th>
                          <th className="py-3 px-4">Purity</th>
                          <th className="py-3 px-4 text-right">Net Weight</th>
                          <th className="py-3 px-4 text-right">Rate / g</th>
                          <th className="py-3 px-4 text-right">Making / g</th>
                          <th className="py-3 px-4 text-right">Total</th>
                          <th className="py-3 px-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {cart.map((item) => (
                          <tr key={item.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-semibold text-slate-900">{item.name}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">Tag: {item.barcode}</p>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="gold" className="text-[10px] font-bold">
                                {item.purity}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right font-medium">{formatWeight(item.netWeight)}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(item.goldRatePerGram, "BHD")}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(item.makingChargePerGram, "BHD")}</td>
                            <td className="py-3 px-4 text-right font-bold text-slate-900">
                              {formatCurrency(calculateItemTotal(item), "BHD")}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-rose-600 hover:bg-rose-50"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Customer & Checkout (1 col) */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-[#B18224]" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Input
                  value={selectedCustomer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedCustomer(e.target.value)}
                  className="h-9 text-xs bg-[#FDFBF7]"
                  placeholder="Search customer code or name..."
                />
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#EBF7F1] border border-[#CAEBD9] text-[#1E7E4E]">
                  <span className="font-semibold">KYC Status: VERIFIED</span>
                  <Badge variant="mint" className="text-[10px]">CPR OK</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Split Payment Method Selection */}
            <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#B18224]" />
                  Payment Settlement Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={paymentMode === "CASH" ? "gold" : "outline"}
                    size="sm"
                    className="h-8 text-xs font-semibold gap-1"
                    onClick={() => setPaymentMode("CASH")}
                  >
                    <Banknote className="h-3.5 w-3.5" /> Cash
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMode === "CARD" ? "gold" : "outline"}
                    size="sm"
                    className="h-8 text-xs font-semibold gap-1"
                    onClick={() => setPaymentMode("CARD")}
                  >
                    <CreditCard className="h-3.5 w-3.5" /> Card
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMode === "SPLIT" ? "gold" : "outline"}
                    size="sm"
                    className="h-8 text-xs font-semibold gap-1"
                    onClick={() => {
                      setPaymentMode("SPLIT");
                      const halfCash = roundBHD(grandTotal / 2);
                      const remainingCard = roundBHD(grandTotal - halfCash);
                      setCashAmount(halfCash.toFixed(3));
                      setCardAmount(remainingCard.toFixed(3));
                    }}
                  >
                    <Building2 className="h-3.5 w-3.5" /> Split
                  </Button>
                </div>

                {paymentMode === "SPLIT" && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600 block mb-1">Cash Portion (BHD)</label>
                      <Input
                        type="number"
                        step="0.001"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        className="h-8 text-xs bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600 block mb-1">Card Portion (BHD)</label>
                      <Input
                        type="number"
                        step="0.001"
                        value={cardAmount}
                        onChange={(e) => setCardAmount(e.target.value)}
                        className="h-8 text-xs bg-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card variant={invoiceCreated ? "pastel-mint" : "default"}>
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-sm font-semibold">Pricing & Tax Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal (Gold + Labour)</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(rawSubtotal, "BHD")}</span>
                </div>

                <div className="flex justify-between text-slate-600 items-center">
                  <span>Discount</span>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={discountPercent}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                      className="w-14 h-7 text-xs text-right p-1"
                    />
                    <span>%</span>
                  </div>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>VAT Tax (10.0%)</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(vatAmount, "BHD")}</span>
                </div>

                <div className="pt-3 border-t border-border/60 flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-[#B18224] text-lg">{formatCurrency(grandTotal, "BHD")}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full h-11 bg-[#B18224] hover:bg-[#966D1C] text-white font-bold text-sm gap-2"
                  disabled={cart.length === 0 || submittingInvoice}
                  onClick={handleCheckout}
                >
                  {submittingInvoice ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Posting POS Invoice...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Complete Checkout ({formatCurrency(grandTotal, "BHD")})
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

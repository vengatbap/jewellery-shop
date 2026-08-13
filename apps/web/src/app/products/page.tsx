"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatWeight } from "@/lib/utils";
import { productApi } from "@/lib/api/product";
import {
  Package,
  Search,
  Plus,
  Download,
  CheckCircle2,
  RefreshCw,
  X,
  Barcode,
  Sparkles,
  ShieldAlert,
  Layers,
  Scale,
  DollarSign,
} from "lucide-react";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Selected Product Detail Modal/Drawer
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Form State
  const [newSku, setNewSku] = useState("");
  const [newBarcode, setNewBarcode] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newCategory, setNewCategory] = useState("Rings");
  const [newProductPurity, setNewProductPurity] = useState("22K");
  const [grossWeight, setGrossWeight] = useState("12.50");
  const [netWeight, setNetWeight] = useState("11.80");
  const [makingChargeType, setMakingChargeType] = useState<"PER_GRAM" | "FIXED">("PER_GRAM");
  const [makingCharge, setMakingCharge] = useState("3.50");
  const [wastagePct, setWastagePct] = useState("2.0");

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const response = await productApi.getTemplates(searchTerm);
    setIsLoading(false);

    if (response.error) {
      setIsError(true);
      setErrorMessage(response.error.message);
    } else {
      setProducts(response.data || []);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const gross = parseFloat(grossWeight);
    const net = parseFloat(netWeight);

    if (!newProductName.trim()) {
      setValidationError("Product Name is required.");
      return;
    }

    if (isNaN(gross) || isNaN(net) || gross <= 0 || net <= 0) {
      setValidationError("Gross Weight and Net Weight must be positive numbers.");
      return;
    }

    if (gross < net) {
      setValidationError("Gross Weight cannot be less than Net Weight.");
      return;
    }

    const generatedBarcode = newBarcode.trim() || `JR-${Math.floor(100000 + Math.random() * 900000)}`;

    // Duplicate check
    const duplicate = products.find((p) => p.barcode === generatedBarcode || (newSku && p.id === newSku.trim()));
    if (duplicate) {
      setValidationError(`Product with Tag Barcode "${generatedBarcode}" or SKU already exists.`);
      return;
    }

    setSubmittingProduct(true);
    setSuccessMessage(null);

    const response = await productApi.createTemplate({
      id: newSku.trim() || undefined,
      barcode: generatedBarcode,
      name: newProductName,
      purity: newProductPurity,
      category: newCategory,
      grossWeight: gross,
      netWeight: net,
      stoneWeight: Math.max(0, gross - net),
      makingChargeType,
      makingCharge: parseFloat(makingCharge) || 3.5,
      wastagePct: parseFloat(wastagePct) || 2.0,
      status: "IN_STOCK",
    });

    setSubmittingProduct(false);

    if (response.error) {
      setValidationError(response.error.message);
    } else {
      setSuccessMessage(`Product SKU "${newProductName}" (Tag: ${generatedBarcode}) created successfully!`);
      setNewSku("");
      setNewBarcode("");
      setNewProductName("");
      setGrossWeight("12.50");
      setNetWeight("11.80");
      setIsAddModalOpen(false);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
    return matchesCategory;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-[#B18224]" />
              Product Catalog & Inventory Items
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage barcoded stock items, purities, making charges, and physical branch locations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchProducts} className="h-8 text-xs gap-1.5 bg-white">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 bg-white">
              <Download className="h-3.5 w-3.5" />
              Export Stock List
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
              Add New Product SKU
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

        {/* Add Product Modal */}
        {isAddModalOpen && (
          <Card className="p-5 border-[#B18224]/40 bg-[#FDFBF7]">
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Add New Jewellery Product SKU</h3>
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
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Product Name</label>
                  <Input
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="e.g. Arabesque 22K Solitaire Ring"
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-border/60 rounded-md bg-white font-medium"
                  >
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Bangles">Bangles</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bullion">Bullion / Investment Bar</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Metal Purity</label>
                  <select
                    value={newProductPurity}
                    onChange={(e) => setNewProductPurity(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-border/60 rounded-md bg-white font-medium"
                  >
                    <option value="24K">24K (Pure Gold 999)</option>
                    <option value="22K">22K (Crown Gold 916)</option>
                    <option value="21K">21K (Standard Gold 875)</option>
                    <option value="18K">18K (Jewellery Gold 750)</option>
                    <option value="925 Silver">925 Silver</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Tag Barcode (Auto if empty)</label>
                  <Input
                    value={newBarcode}
                    onChange={(e) => setNewBarcode(e.target.value)}
                    placeholder="e.g. JR000128"
                    className="h-8 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Gross Weight (g)</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(e.target.value)}
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Net Weight (g)</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={netWeight}
                    onChange={(e) => setNetWeight(e.target.value)}
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Stone Weight (g)</label>
                  <Input
                    readOnly
                    value={(Math.max(0, (parseFloat(grossWeight) || 0) - (parseFloat(netWeight) || 0))).toFixed(2)}
                    className="h-8 text-xs bg-slate-100 font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Making Charge Type</label>
                  <select
                    value={makingChargeType}
                    onChange={(e) => setMakingChargeType(e.target.value as "PER_GRAM" | "FIXED")}
                    className="w-full h-8 px-2 text-xs border border-border/60 rounded-md bg-white font-medium"
                  >
                    <option value="PER_GRAM">Per Gram (BHD / g)</option>
                    <option value="FIXED">Fixed Lump Sum (BHD)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Making Charge (BHD)</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={makingCharge}
                    onChange={(e) => setMakingCharge(e.target.value)}
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Wastage %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={wastagePct}
                    onChange={(e) => setWastagePct(e.target.value)}
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)} className="h-8 text-xs bg-white">
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingProduct} size="sm" className="h-8 text-xs bg-[#B18224] text-white font-medium">
                  {submittingProduct ? "Saving SKU..." : "Save Product SKU"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Filters & Search */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <Input
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                placeholder="Search Product Name, SKU, Barcode..."
                className="pl-9 h-9 text-xs bg-[#FDFBF7]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-medium text-slate-600">Category:</span>
              <div className="flex gap-1 overflow-x-auto">
                {["ALL", "Rings", "Necklaces", "Bangles", "Earrings", "Bullion"].map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "gold" : "outline"}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Product Table State Audit */}
        {isLoading ? (
          <TableSkeleton rows={6} />
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={fetchProducts} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title="No Products Found"
            description="No inventory products matched your query or selected category filter."
            actionLabel="Reset Search Filters"
            onAction={() => {
              setSearchTerm("");
              setSelectedCategory("ALL");
            }}
          />
        ) : (
          <Card>
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Inventory Stock Table ({filteredProducts.length} items)</CardTitle>
                <Badge variant="powder" className="text-xs">
                  Total Stock Weight: {formatWeight(filteredProducts.reduce((sum, p) => sum + (p.netWeight || p.weight || 0), 0))}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-slate-600 border-b border-border/60 font-semibold">
                    <tr>
                      <th className="py-3 px-4">SKU / Barcode</th>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Purity</th>
                      <th className="py-3 px-4 text-right">Gross Wt</th>
                      <th className="py-3 px-4 text-right">Net Wt</th>
                      <th className="py-3 px-4 text-right">Making / g</th>
                      <th className="py-3 px-4 text-right">Wastage %</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredProducts.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedProduct(item)}
                        className="hover:bg-[#FAF8F5]/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-800">{item.id}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">Tag: {item.barcode || "TAG-001"}</p>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{item.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-[11px] bg-white">
                            {item.category || "Rings"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="gold" className="text-[10px] font-bold">
                            {item.purity}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">{formatWeight(item.grossWeight || item.weight * 1.05 || 10)}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">{formatWeight(item.netWeight || item.weight || 10)}</td>
                        <td className="py-3 px-4 text-right font-medium">{formatCurrency(item.makingCharge || 3.5, "BHD")}</td>
                        <td className="py-3 px-4 text-right font-medium">{(item.wastagePct || 2.0).toFixed(1)}%</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={item.status || "IN_STOCK"} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Product Detail Drawer / Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-white shadow-xl">
              <CardHeader className="border-b border-border/50 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#B18224]" />
                    {selectedProduct.name}
                  </CardTitle>
                  <CardDescription className="text-xs">SKU: {selectedProduct.id} | Jewellery Specification</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)} className="h-7 w-7 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                {/* Key Technical Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-[#FAF8F5] border border-border/60">
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Barcode className="h-3 w-3 text-slate-400" /> Tag Barcode
                    </span>
                    <p className="font-bold text-slate-800 font-mono mt-0.5">{selectedProduct.barcode || "JR000123"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Sparkles className="h-3 w-3 text-[#B18224]" /> Metal Purity
                    </span>
                    <p className="font-bold text-[#B18224] mt-0.5">{selectedProduct.purity}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Layers className="h-3 w-3 text-slate-400" /> Category
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedProduct.category || "Rings"}</p>
                  </div>
                </div>

                {/* Weight Breakdown */}
                <div className="p-3 rounded-lg border border-border/60 space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Scale className="h-3.5 w-3.5 text-[#B18224]" /> Precision Weight Breakdown
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded bg-slate-50">
                      <span className="text-slate-500 text-[10px] block">Gross Weight</span>
                      <span className="font-semibold text-slate-800">{formatWeight(selectedProduct.grossWeight || selectedProduct.weight * 1.05 || 10)}</span>
                    </div>
                    <div className="p-2 rounded bg-[#FAF4E5]">
                      <span className="text-[#8C6B1B] text-[10px] block font-medium">Net Metal Wt</span>
                      <span className="font-bold text-[#4A3B10]">{formatWeight(selectedProduct.netWeight || selectedProduct.weight || 10)}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50">
                      <span className="text-slate-500 text-[10px] block">Stone Weight</span>
                      <span className="font-semibold text-slate-800">{formatWeight((selectedProduct.grossWeight || selectedProduct.weight * 1.05 || 10) - (selectedProduct.netWeight || selectedProduct.weight || 10))}</span>
                    </div>
                  </div>
                </div>

                {/* Labor & Wastage */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-purple-50/50 border border-purple-200">
                    <span className="text-[10px] font-semibold text-purple-800 flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-purple-600" /> Making Charge
                    </span>
                    <p className="text-sm font-bold text-purple-950 mt-1">
                      {formatCurrency(selectedProduct.makingCharge || 3.5, "BHD")} / g
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200">
                    <span className="text-[10px] font-semibold text-amber-800">Wastage %</span>
                    <p className="text-sm font-bold text-amber-950 mt-1">
                      {(selectedProduct.wastagePct || 2.0).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-border/40">
                  <Button variant="outline" size="sm" onClick={() => setSelectedProduct(null)} className="h-8 text-xs bg-white">
                    Close Details
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

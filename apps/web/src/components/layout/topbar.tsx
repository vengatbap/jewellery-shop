"use client";

import React from "react";
import {
  Search,
  Building2,
  GitBranch,
  Bell,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  return (
    <header className="h-16 border-b border-border/70 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Global Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder="Search SKU, Barcode, Customer, Invoice (Press ⌘K)..."
            className="pl-9 bg-[#FDFBF7] border-border/70 text-xs focus-visible:ring-1 focus-visible:ring-[#B18224] h-9"
          />
        </div>
      </div>

      {/* Right Controls: Tenant, Branch, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Live Gold Ticker Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF4E5] border border-[#EADBB5] text-xs font-medium text-[#7A5B12]">
          <Sparkles className="h-3.5 w-3.5 text-[#B18224]" />
          <span>22K Gold: <strong className="text-slate-900 font-bold">BHD 24.850 /g</strong></span>
          <Badge variant="mint" className="text-[10px] py-0 px-1.5 font-bold ml-1">+0.4%</Badge>
        </div>

        <div className="h-4 w-[1px] bg-border/60 hidden lg:block" />

        {/* Organization Selector */}
        <Button variant="outline" size="sm" className="h-9 px-3 gap-2 text-xs bg-white hover:bg-[#FAF8F5]">
          <Building2 className="h-3.5 w-3.5 text-[#B18224]" />
          <span className="font-medium text-slate-700">Auric One Main Shop</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>

        {/* Branch Selector */}
        <Button variant="outline" size="sm" className="h-9 px-3 gap-2 text-xs bg-white hover:bg-[#FAF8F5]">
          <GitBranch className="h-3.5 w-3.5 text-slate-500" />
          <span className="font-medium text-slate-700">BFH01 - Financial Harbor</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>

        {/* Notifications Button */}
        <Button variant="ghost" size="icon" className="h-9 w-9 relative rounded-full hover:bg-[#FAF4E5]/50">
          <Bell className="h-4 w-4 text-slate-600" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
        </Button>

        {/* User Profile Menu */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/60">
          <div className="h-8 w-8 rounded-full bg-[#B18224]/10 border border-[#B18224]/30 flex items-center justify-center text-[#B18224] font-bold text-xs">
            JD
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">John Doe</p>
            <p className="text-[10px] text-muted-foreground">Store Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
}

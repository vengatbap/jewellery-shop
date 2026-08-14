"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Building2,
  GitBranch,
  Bell,
  ChevronDown,
  Sparkles,
  LogOut,
  X,
  ShieldAlert,
  CheckCircle2,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const systemNotifications = [
  {
    id: "notif-01",
    type: "TEAM_JOINED",
    title: "Team Invitation Accepted",
    message: "Sara Cashier accepted team invitation and joined Royal Gems as CASHIER for MAIN01 Branch.",
    time: "5m ago",
    read: false,
    icon: UserCheck,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "notif-02",
    type: "GOLD_RATE_UPDATE",
    title: "22K Gold Rate Updated",
    message: "Live regional rate updated to BHD 24.850/g (+0.4%). POS pricing engine synchronized.",
    time: "1h ago",
    read: false,
    icon: TrendingUp,
    color: "text-amber-600 bg-amber-50",
  },
  {
    id: "notif-03",
    type: "POS_INVOICE",
    title: "POS Invoice INV-000001 Posted",
    message: "Sales invoice for BHD 175.450 posted. Inventory tag JR000001 marked SOLD. GL balanced.",
    time: "2h ago",
    read: true,
    icon: CheckCircle2,
    color: "text-blue-600 bg-blue-50",
  },
  {
    id: "notif-04",
    type: "SECURITY_ALERT",
    title: "Cross-Tenant Access Blocked",
    message: "Gate 18 Security Guard blocked unauthorized direct API request to org_pearlpalace.",
    time: "3h ago",
    read: true,
    icon: ShieldAlert,
    color: "text-rose-600 bg-rose-50",
  },
];

export function Topbar() {
  const router = useRouter();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(systemNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    // Invalidate session JWT and clear auth state
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    router.push("/login");
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 border-b border-border/70 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 select-none">
      {/* Global Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder="Search SKU, Barcode Tag, Customer, Invoice (Press ⌘K)..."
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
          <span className="font-medium text-slate-700 truncate max-w-[140px]">Royal Gems Jewellery</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>

        {/* Branch Selector */}
        <Button variant="outline" size="sm" className="h-9 px-3 gap-2 text-xs bg-white hover:bg-[#FAF8F5]">
          <GitBranch className="h-3.5 w-3.5 text-slate-500" />
          <span className="font-medium text-slate-700">MAIN01 - Main Branch</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>

        {/* Notifications Button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="h-9 w-9 relative rounded-full hover:bg-[#FAF4E5]/50"
          >
            <Bell className="h-4 w-4 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* Persistent Notification Side Drawer Panel */}
          {isNotifOpen && (
            <Card className="absolute right-0 mt-2 w-80 bg-white shadow-xl z-50 border-border/70 animate-in fade-in slide-in-from-top-2">
              <CardHeader className="p-3 border-b border-border/50 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-[#B18224]" /> Notification Center
                </CardTitle>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-6 text-[10px] text-[#B18224] px-1.5">
                      Mark Read
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setIsNotifOpen(false)} className="h-6 w-6 p-0">
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-2 space-y-1 max-h-80 overflow-y-auto text-xs">
                {notifications.map((n) => {
                  const IconComp = n.icon;
                  return (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg border transition-colors ${
                        n.read ? "bg-white border-border/40 opacity-75" : "bg-[#FAF8F5] border-[#B18224]/30"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`p-1 rounded ${n.color} shrink-0 mt-0.5`}>
                          <IconComp className="h-3.5 w-3.5" />
                        </div>
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-[11px]">{n.title}</span>
                            <span className="text-[9px] text-muted-foreground font-mono">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-600 leading-tight">{n.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* User Profile Menu & Logout Control */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 pl-2 border-l border-border/60 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded-full bg-[#B18224]/10 border border-[#B18224]/30 flex items-center justify-center text-[#B18224] font-bold text-xs">
              AA
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">Ahmed Al-Sayed</p>
              <p className="text-[10px] text-[#8C6B1B] font-bold">Store Owner</p>
            </div>
            <ChevronDown className="h-3 w-3 opacity-50 hidden sm:block" />
          </button>

          {/* User Profile Dropdown Menu */}
          {isUserMenuOpen && (
            <Card className="absolute right-0 mt-2 w-56 bg-white shadow-xl z-50 border-border/70 p-2 text-xs space-y-1">
              <div className="p-2 bg-[#FAF8F5] rounded border border-border/50">
                <p className="font-bold text-slate-900">Ahmed Al-Sayed</p>
                <p className="text-[10px] text-slate-500 font-mono">ahmed@royalgems.bh</p>
                <Badge variant="mint" className="text-[9px] mt-1 font-bold">OWNER (org_royalgems)</Badge>
              </div>

              <Link
                href="/configuration"
                onClick={() => setIsUserMenuOpen(false)}
                className="block px-2.5 py-1.5 rounded hover:bg-slate-50 font-medium text-slate-700"
              >
                Store Settings & Roles
              </Link>
              <Link
                href="/platform"
                onClick={() => setIsUserMenuOpen(false)}
                className="block px-2.5 py-1.5 rounded hover:bg-slate-50 font-medium text-slate-700"
              >
                Platform Control Plane
              </Link>

              <div className="pt-1 border-t border-border/40">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-rose-50 text-rose-700 font-bold flex items-center gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-600" />
                  Sign Out of Auric One
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </header>
  );
}

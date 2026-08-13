"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Truck,
  TrendingUp,
  Users,
  PiggyBank,
  Coins,
  BookOpen,
  BarChart3,
  Globe,
  GitFork,
  Wrench,
  Settings,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Platform Core", href: "/platform", icon: Server, badge: "SUPER ADMIN" },
  { title: "Sales & POS", href: "/pos", icon: ShoppingCart },
  { title: "Products", href: "/products", icon: Package },
  { title: "Inventory", href: "/inventory", icon: Boxes },
  { title: "Procurement", href: "/procurement", icon: Truck },
  { title: "Gold Rates", href: "/gold-rates", icon: TrendingUp },
  { title: "Customers & KYC", href: "/customers", icon: Users },
  { title: "Savings Schemes", href: "/schemes", icon: PiggyBank },
  { title: "Gold Loans", href: "/gold-loans", icon: Coins },
  { title: "Accounting", href: "/accounting", icon: BookOpen },
  { title: "Analytics & Reports", href: "/reports", icon: BarChart3 },
  { title: "E-Commerce", href: "/ecommerce", icon: Globe },
  { title: "Multi-Branch", href: "/multibranch", icon: GitFork },
  { title: "Repair Job Cards", href: "/repair", icon: Wrench },
  { title: "Configuration", href: "/configuration", icon: Settings },
  { title: "Audit & Security Logs", href: "/audit", icon: ShieldCheck },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("w-64 border-r border-border/70 bg-[#FAF8F5]/90 backdrop-blur-md flex flex-col h-screen sticky top-0 shrink-0 select-none", className)}>
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center border-b border-border/50 gap-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#B18224] to-[#D4AF37] text-white flex items-center justify-center shadow-soft">
          <Sparkles className="h-5 w-5 stroke-[2.2]" />
        </div>
        <div>
          <h1 className="font-semibold tracking-tight text-slate-900 text-sm flex items-center gap-1.5">
            Auric One <span className="text-[10px] uppercase font-bold text-[#8C6B1B] bg-[#FAF4E5] px-1.5 py-0.5 rounded border border-[#EADBB5]">v1.0</span>
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium">Enterprise Jewellery ERP</p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Core ERP Modules
        </div>

        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group",
                isActive
                  ? "bg-[#FAF4E5] text-[#7A5B12] font-semibold border border-[#EADBB5] shadow-soft"
                  : "text-slate-600 hover:bg-white/80 hover:text-slate-900 border border-transparent"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-[#B18224]" : "text-slate-400 group-hover:text-slate-600")} />
              <span className="flex-1 truncate">{item.title}</span>
              {item.badge && (
                <span className="text-[9px] font-bold text-[#8C6B1B] bg-[#FAF4E5] px-1.5 py-0.5 rounded border border-[#EADBB5]">
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-[#B18224]" />}
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-border/50 bg-[#FAF8F5]">
        <div className="p-2.5 rounded-lg bg-[#FAF4E5]/60 border border-[#EADBB5]/70 flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-[11px]">
            <p className="font-semibold text-slate-800">Production Node</p>
            <p className="text-slate-500 text-[10px]">Multi-Tenant Isolated</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

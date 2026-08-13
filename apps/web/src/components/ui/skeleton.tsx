import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/70 dark:bg-slate-800", className)}
      {...props}
    />
  );
}

export function KpiSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-border/60 bg-white space-y-3">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3 w-44" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-border/60 bg-white space-y-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="p-6 border border-border/60 rounded-xl bg-white space-y-4">
      <Skeleton className="h-5 w-40" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="p-6 border border-border/60 rounded-xl bg-white space-y-3">
      <Skeleton className="h-6 w-56" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="p-5 border border-border/60 rounded-xl bg-white space-y-4">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  );
}

export function LoadingOverlay({ message = "Processing..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="p-6 bg-white rounded-xl shadow-xl flex items-center gap-3">
        <div className="h-5 w-5 rounded-full border-2 border-t-[#B18224] border-slate-200 animate-spin" />
        <span className="text-xs font-semibold text-slate-800">{message}</span>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-border/60 rounded-xl bg-white overflow-hidden">
      <div className="p-4 border-b border-border/40 bg-[#FAF8F5]">
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="divide-y divide-border/30 p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-80" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>
      <TableSkeleton rows={4} />
    </div>
  );
}

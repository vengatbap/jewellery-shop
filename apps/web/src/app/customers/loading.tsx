import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TableSkeleton } from "@/components/ui/skeleton";

export default function CustomersLoading() {
  return (
    <AppShell>
      <div className="space-y-6 p-2">
        <TableSkeleton rows={5} />
      </div>
    </AppShell>
  );
}

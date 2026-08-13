import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <AppShell>
      <PageSkeleton />
    </AppShell>
  );
}

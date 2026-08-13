import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ExecutiveDashboard } from "@/components/domain/dashboard/executive-dashboard";

export default function Home() {
  return (
    <AppShell>
      <ExecutiveDashboard />
    </AppShell>
  );
}

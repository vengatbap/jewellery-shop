"use client";

import React, { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/ui/error-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Router Caught Uncaught Exception:", error);
  }, [error]);

  return (
    <AppShell>
      <div className="py-12 max-w-xl mx-auto">
        <ErrorState
          title="Application Encountered an Error"
          message={error.message || "An unexpected error occurred while loading this section."}
          onRetry={reset}
        />
      </div>
    </AppShell>
  );
}

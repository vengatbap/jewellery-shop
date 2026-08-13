"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-6">
      <ErrorState message={error.message || "An unexpected error occurred in Repair & Service Management."} onRetry={reset} />
    </div>
  );
}

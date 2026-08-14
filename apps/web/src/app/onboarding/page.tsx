"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Canonical Tenant Setup Route is /setup
    router.replace("/setup");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-4">
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground font-medium animate-pulse">
          Redirecting to canonical Business Setup Wizard (/setup)...
        </p>
      </div>
    </div>
  );
}

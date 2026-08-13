import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <AppShell>
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <FileQuestion className="h-12 w-12 mx-auto text-[#B18224] stroke-1" />
        <h1 className="text-xl font-bold text-slate-900">404 — Page or Resource Not Found</h1>
        <p className="text-xs text-muted-foreground">
          The ERP portal route or requested entity does not exist or has been relocated.
        </p>
        <Link href="/">
          <Button size="sm" className="bg-[#B18224] hover:bg-[#966D1C] text-white text-xs gap-1.5 mt-2">
            <Home className="h-3.5 w-3.5" />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </AppShell>
  );
}

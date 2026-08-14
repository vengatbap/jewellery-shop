"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShieldCheck, CheckCircle2, UserCheck } from "lucide-react";

export default function AcceptInvitationPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("Sara Cashier");
  const [password, setPassword] = useState("••••••••••••");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    setSuccessMessage(
      "Invitation Accepted! Account linked to Royal Gems Jewellery W.L.L. as CASHIER for MAIN01 - Main Branch. No duplicate organization created."
    );

    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-[#B18224] to-[#D4AF37] text-white items-center justify-center shadow-md mb-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">You're Invited to Join Royal Gems</h1>
          <p className="text-xs text-muted-foreground">Accept invitation from Ahmed Al-Sayed to join Royal Gems Jewellery W.L.L.</p>
        </div>

        <Card className="p-6 bg-white shadow-lg border-border/60">
          <form onSubmit={handleAccept} className="space-y-4 text-xs">
            {successMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="p-3 rounded-lg bg-[#FAF4E5] border border-[#EADBB5] space-y-1.5 text-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Royal Gems Jewellery W.L.L.</span>
                <Badge variant="mint" className="text-[10px] font-bold">CASHIER</Badge>
              </div>
              <div className="text-[11px] text-slate-600 space-y-0.5 font-mono">
                <p>Target Branch: <span className="font-bold text-slate-900">MAIN01 - Main Branch</span></p>
                <p>Invited Email: <span className="font-bold text-slate-900">sara@royalgems.bh</span></p>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
              <Input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-9 text-xs bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Set Account Password</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 text-xs bg-[#FDFBF7]"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Attaches your user membership directly to Royal Gems. No duplicate organization created.</span>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-9 text-xs bg-[#B18224] hover:bg-[#966D1C] text-white font-bold gap-2 mt-2"
            >
              {isSubmitting ? "Linking Account..." : "Accept Invitation & Sign In"}
              <UserCheck className="h-3.5 w-3.5" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

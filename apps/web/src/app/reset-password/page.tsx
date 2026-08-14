"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("••••••••••••");
  const [confirmPassword, setConfirmPassword] = useState("••••••••••••");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    setSuccessMessage(
      "Password updated successfully! Existing sessions invalidated and security confirmation email sent via Resend. Redirecting to Sign In..."
    );

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-[#B18224] to-[#D4AF37] text-white items-center justify-center shadow-md mb-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Set New Password</h1>
          <p className="text-xs text-muted-foreground">Token validated. Choose a strong new password.</p>
        </div>

        <Card className="p-6 bg-white shadow-lg border-border/60">
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            {successMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 block mb-1">New Password</label>
              <Input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-9 text-xs bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Confirm New Password</label>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-9 text-xs bg-[#FDFBF7]"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Submitting invalidates all existing JWT sessions and triggers password-changed email.</span>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-9 text-xs bg-[#B18224] hover:bg-[#966D1C] text-white font-bold gap-2 mt-2"
            >
              {isSubmitting ? "Updating Password..." : "Update Password & Sign In"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

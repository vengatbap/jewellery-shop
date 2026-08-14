"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, ShieldCheck, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("ahmed@royalgems.bh");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate hashed reset token creation & Resend email dispatch
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-[#B18224] to-[#D4AF37] text-white items-center justify-center shadow-md mb-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset Your Password</h1>
          <p className="text-xs text-muted-foreground">Enter your business email to receive reset instructions.</p>
        </div>

        <Card className="p-6 bg-white shadow-lg border-border/60">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-xs bg-[#FDFBF7]"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Security Notice: Reset tokens are short-lived (15 mins) and cryptographically hashed.</span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-9 text-xs bg-[#B18224] hover:bg-[#966D1C] text-white font-bold gap-2 mt-2"
              >
                {isSubmitting ? "Dispatching Email..." : "Send Reset Instructions"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>

              <div className="text-center pt-2 text-[11px] text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="font-bold text-[#B18224] hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center text-xs">
              <div className="inline-flex h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Reset Email Dispatched!</h3>
              <p className="text-slate-600 leading-relaxed">
                If an account exists for <strong className="text-slate-900">{email}</strong>, we have sent a secure password reset link via Resend.
              </p>
              <div className="pt-2 border-t border-border/40">
                <Link href="/reset-password?token=tok_demo_reset_123">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8 bg-white border-[#B18224]/40 text-[#8C6B1B]">
                    Simulate Clicking Reset Email Link
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

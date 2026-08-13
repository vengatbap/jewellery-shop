"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("ahmed@royalgems.bh");
  const [password, setPassword] = useState("••••••••••••");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsSubmitting(false);

    // Redirect to ERP Dashboard or Super Admin Platform based on user role
    if (email.includes("admin@auricone.com")) {
      router.push("/platform");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-[#B18224] to-[#D4AF37] text-white items-center justify-center shadow-md mb-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign In to Auric One</h1>
          <p className="text-xs text-muted-foreground">Access your jewellery enterprise portal.</p>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 bg-white shadow-lg border-border/60">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Password</label>
                <a href="#" className="text-[10px] text-[#B18224] hover:underline font-medium">Forgot Password?</a>
              </div>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-9 text-xs bg-[#B18224] hover:bg-[#966D1C] text-white font-bold gap-2 mt-2"
            >
              {isSubmitting ? "Authenticating..." : "Sign In to ERP Portal"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>For Super Admin Platform Access, sign in as <strong className="font-mono text-slate-900">admin@auricone.com</strong></span>
            </div>

            <div className="text-center pt-2 text-[11px] text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="font-bold text-[#B18224] hover:underline">
                Start Free Trial
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("Ahmed Al-Sayed");
  const [email, setEmail] = useState("ahmed@royalgems.bh");
  const [phone, setPhone] = useState("+973 39123456");
  const [password, setPassword] = useState("••••••••••••");
  const [businessName, setBusinessName] = useState("Royal Gems Jewellery W.L.L.");
  const [country, setCountry] = useState("Bahrain");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provisionMessage, setProvisionMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProvisionMessage(null);

    // Simulate tenant provisioning step sequence
    await new Promise((resolve) => setTimeout(resolve, 600));

    setProvisionMessage(
      `Tenant org_royalgems provisioned! Account created for ${fullName} (${email}). Redirecting to Business Setup Wizard...`
    );

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/setup");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-[#B18224] to-[#D4AF37] text-white items-center justify-center shadow-md mb-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Start Your Free Trial on Auric One</h1>
          <p className="text-xs text-muted-foreground">The enterprise cloud platform for modern jewellery businesses.</p>
        </div>

        {/* Signup Form Card */}
        <Card className="p-6 bg-white shadow-lg border-[#B18224]/30">
          <form onSubmit={handleSignup} className="space-y-4 text-xs">
            {provisionMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{provisionMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mobile Phone</label>
                <Input required value={phone} onChange={(e) => setPhone(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-mono" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Password</label>
                <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/40">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Business Legal Name</label>
                <Input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="h-9 text-xs bg-[#FDFBF7] font-semibold" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Country</label>
                <Input required value={country} onChange={(e) => setCountry(e.target.value)} className="h-9 text-xs bg-[#FDFBF7]" />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF4E5] border border-[#EADBB5] text-[11px] text-slate-700 space-y-1">
              <p className="font-bold text-[#7A5B12] flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#B18224]" /> Automatic Tenant & Branch Provisioning
              </p>
              <p>Creates isolated tenant database workspace, default roles, NBR 10% VAT rules & BHD currency precision.</p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 text-xs bg-[#B18224] hover:bg-[#966D1C] text-white font-bold gap-2 mt-2"
            >
              {isSubmitting ? "Provisioning Tenant..." : "Create Account & Provision Tenant"}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="text-center pt-2 text-[11px] text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#B18224] hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

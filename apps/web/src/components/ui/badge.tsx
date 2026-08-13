import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive/10 text-destructive border-destructive/20",
        outline: "text-foreground border-border",
        gold: "bg-[#FAF4E5] text-[#8C6B1B] border-[#EADBB5]",
        peach: "bg-[#FDF2E9] text-[#B85B14] border-[#FADEC9]",
        lavender: "bg-[#F4EFFC] text-[#6B3BA7] border-[#E2D5F8]",
        powder: "bg-[#EEF6FB] text-[#1B6497] border-[#D4E7F5]",
        pink: "bg-[#FDF0F4] text-[#A82D58] border-[#FAD5E2]",
        mint: "bg-[#EBF7F1] text-[#1E7E4E] border-[#CAEBD9]",
        gray: "bg-slate-100 text-slate-700 border-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "gold" | "peach" | "lavender" | "powder" | "pink" | "mint" | "gray" | null;
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

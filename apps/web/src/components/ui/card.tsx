import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "pastel-gold" | "pastel-peach" | "pastel-lavender" | "pastel-powder" | "pastel-pink" | "pastel-mint" }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-card text-card-foreground border-border/80 shadow-card",
    "pastel-gold": "bg-[#FAF4E5] text-[#4A3B10] border-[#EADBB5] shadow-soft",
    "pastel-peach": "bg-[#FDF2E9] text-[#5C2E0B] border-[#FADEC9] shadow-soft",
    "pastel-lavender": "bg-[#F4EFFC] text-[#3D1E6D] border-[#E2D5F8] shadow-soft",
    "pastel-powder": "bg-[#EEF6FB] text-[#0C3B5E] border-[#D4E7F5] shadow-soft",
    "pastel-pink": "bg-[#FDF0F4] text-[#5C162E] border-[#FAD5E2] shadow-soft",
    "pastel-mint": "bg-[#EBF7F1] text-[#0D4D2E] border-[#CAEBD9] shadow-soft",
  };

  return (
    <div
      ref={ref}
      className={cn("rounded-xl border transition-all duration-200", variantStyles[variant], className)}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5 pb-3", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-medium leading-none tracking-tight text-slate-800 text-base", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 pt-0 border-t border-border/40 mt-3 pt-3", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

import * as React from "react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

export type DomainStatus =
  | "IN_STOCK"
  | "RESERVED"
  | "SOLD"
  | "TRANSFERRED"
  | "IN_TRANSIT"
  | "REPAIR"
  | "MELTING"
  | "COMPLETED"
  | "CANCELLED"
  | "ACTIVE"
  | "CLOSED"
  | "PENDING"
  | "PAID"
  | "REDEEMED"
  | "DEFAULTED"
  | "AUCTIONED"
  | string;

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: DomainStatus;
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();

  const getVariantAndLabel = (s: string) => {
    switch (s) {
      case "IN_STOCK":
      case "COMPLETED":
      case "PAID":
      case "ACTIVE":
        return { variant: "mint" as const, label: s.replace("_", " ") };

      case "RESERVED":
      case "PENDING":
      case "IN_TRANSIT":
        return { variant: "powder" as const, label: s.replace("_", " ") };

      case "TRANSFERRED":
      case "REDEEMED":
        return { variant: "lavender" as const, label: s.replace("_", " ") };

      case "REPAIR":
      case "MELTING":
        return { variant: "peach" as const, label: s.replace("_", " ") };

      case "SOLD":
      case "CLOSED":
        return { variant: "gray" as const, label: s.replace("_", " ") };

      case "CANCELLED":
      case "DEFAULTED":
      case "AUCTIONED":
        return { variant: "destructive" as const, label: s.replace("_", " ") };

      default:
        return { variant: "gold" as const, label: s.replace("_", " ") };
    }
  };

  const { variant, label } = getVariantAndLabel(normalized);

  return (
    <Badge variant={variant} className={cn("font-medium tracking-wide text-[11px] uppercase py-0.5 px-2", className)} {...props}>
      {label}
    </Badge>
  );
}

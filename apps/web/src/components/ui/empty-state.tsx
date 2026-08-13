import React from "react";
import { Button } from "./button";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No records found",
  description = "There are no items matching your criteria.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="p-12 text-center border border-dashed border-border/70 rounded-xl bg-[#FAF8F5]/40 space-y-3">
      <FolderOpen className="h-10 w-10 mx-auto text-[#B18224] opacity-60 stroke-1" />
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-2 text-xs bg-[#B18224] hover:bg-[#966D1C] text-white">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

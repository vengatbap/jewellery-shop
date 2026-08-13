import React from "react";
import { Button } from "./button";
import { AlertTriangle, RotateCcw, WifiOff, ShieldAlert, FileQuestion } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Service Temporarily Unavailable",
  message = "Failed to load data from server. Please verify network connectivity.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="p-8 text-center border border-rose-200 rounded-xl bg-rose-50/50 text-rose-900 space-y-3">
      <AlertTriangle className="h-9 w-9 mx-auto text-rose-600" />
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="text-xs text-rose-700 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <Button size="sm" onClick={onRetry} variant="outline" className="mt-2 text-xs bg-white border-rose-300 gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          Retry Operation
        </Button>
      )}
    </div>
  );
}

export function InlineError({ message }: { message: string }) {
  return (
    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
      <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="p-8 text-center border border-amber-200 rounded-xl bg-amber-50/50 text-amber-900 space-y-3">
      <WifiOff className="h-9 w-9 mx-auto text-amber-600" />
      <h3 className="text-sm font-bold">Network Connection Lost</h3>
      <p className="text-xs text-amber-800 max-w-md mx-auto">
        Could not reach API gateway. Please check your network connection and retry.
      </p>
      {onRetry && (
        <Button size="sm" onClick={onRetry} variant="outline" className="mt-2 text-xs bg-white border-amber-300 gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          Reconnect
        </Button>
      )}
    </div>
  );
}

export function PermissionDenied({ role = "Staff" }: { role?: string }) {
  return (
    <div className="p-8 text-center border border-slate-200 rounded-xl bg-slate-50 text-slate-800 space-y-3">
      <ShieldAlert className="h-9 w-9 mx-auto text-slate-500" />
      <h3 className="text-sm font-bold">Access Restricted ({role})</h3>
      <p className="text-xs text-slate-600 max-w-md mx-auto">
        Your current role does not have permission to view or modify this resource.
      </p>
    </div>
  );
}

export function NotFoundState({ resourceName = "Resource" }: { resourceName?: string }) {
  return (
    <div className="p-8 text-center border border-border/60 rounded-xl bg-[#FAF8F5] text-slate-800 space-y-3">
      <FileQuestion className="h-9 w-9 mx-auto text-[#B18224]" />
      <h3 className="text-sm font-bold">{resourceName} Not Found</h3>
      <p className="text-xs text-slate-600 max-w-md mx-auto">
        The requested {resourceName.toLowerCase()} could not be located or has been deleted.
      </p>
    </div>
  );
}

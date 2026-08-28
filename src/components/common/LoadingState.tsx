import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle } from "lucide-react";

export function LoadingState({ label = "正在加载..." }: { label?: string }) {
  return (
    <div className="space-y-4 rounded-[1.75rem] border border-border/60 bg-card p-6">
      <div className="text-sm text-muted-foreground">{label}</div>
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-40" />
    </div>
  );
}

export function FullScreenLoadingState({ label = "正在加载..." }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex min-h-screen w-full items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <LoaderCircle className="size-10 animate-spin text-primary" aria-hidden="true" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

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

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BusinessStoryStatus } from "@/lib/types/business-story";

const statusLabels: Record<BusinessStoryStatus, string> = {
  draft: "草稿",
  ready: "就绪",
  in_progress: "进行中",
  done: "已完成",
  deferred: "已延期",
};

const statusClasses: Record<BusinessStoryStatus, string> = {
  draft: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300",
  ready: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300",
  in_progress: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300",
  done: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  deferred: "border-stone-200 bg-stone-50 text-stone-700 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-300",
};

export function BusinessStoryStatusBadge({
  status,
}: {
  status: BusinessStoryStatus;
}) {
  return (
    <Badge variant="outline" className={cn("whitespace-nowrap", statusClasses[status])}>
      {statusLabels[status]}
    </Badge>
  );
}

export { statusLabels };

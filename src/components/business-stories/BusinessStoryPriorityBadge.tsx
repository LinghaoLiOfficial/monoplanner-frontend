import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BusinessStoryPriority } from "@/lib/types/business-story";

const priorityLabels: Record<BusinessStoryPriority, string> = {
  p1_must: "P1 Must 必须完成",
  p2_should: "P2 Should 应该完成",
  p3_could: "P3 Could 可以完成",
  p4_wont: "P4 Won't 本阶段不做",
};

const priorityBadgeLabels: Record<BusinessStoryPriority, string> = {
  p1_must: "P1",
  p2_should: "P2",
  p3_could: "P3",
  p4_wont: "P4",
};

const priorityClasses: Record<BusinessStoryPriority, string> = {
  p1_must: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300",
  p2_should: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
  p3_could: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300",
  p4_wont: "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300",
};

export function BusinessStoryPriorityBadge({
  priority,
}: {
  priority: BusinessStoryPriority;
}) {
  return (
    <Badge variant="outline" className={cn("whitespace-nowrap", priorityClasses[priority])}>
      {priorityBadgeLabels[priority]}
    </Badge>
  );
}

export { priorityBadgeLabels, priorityLabels };

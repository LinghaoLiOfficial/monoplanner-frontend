import { cn } from "@/lib/utils";
import type { UXFieldDefinition } from "@/lib/ux-design-contract";

export function UXFieldHeading({
  definition,
  className,
  titleClassName,
  showMeaning = true,
}: {
  definition: UXFieldDefinition;
  className?: string;
  titleClassName?: string;
  showMeaning?: boolean;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className={cn("flex flex-wrap items-center gap-2", titleClassName)}>
        <span>{definition.chineseName}</span>
        <code className="rounded-full border border-border/60 bg-muted px-2 py-0.5 font-mono text-[11px] font-normal text-muted-foreground">
          {definition.englishName}
        </code>
      </div>
      {showMeaning ? (
        <p className="text-xs font-normal leading-5 text-muted-foreground">{definition.meaning}</p>
      ) : null}
    </div>
  );
}

export function UXFieldBlock({
  definition,
  children,
  className,
}: {
  definition: UXFieldDefinition;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <UXFieldHeading definition={definition} />
      {children}
    </div>
  );
}

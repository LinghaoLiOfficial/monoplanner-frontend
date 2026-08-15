import { cn } from "@/lib/utils";
import type { DatabaseModelFieldDefinition } from "@/lib/database-model-contract";

export function DatabaseModelFieldHeading({
  definition,
  className,
  titleClassName,
  showMeaning = true,
}: {
  definition: DatabaseModelFieldDefinition;
  className?: string;
  titleClassName?: string;
  showMeaning?: boolean;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className={cn("flex flex-wrap items-center gap-2", titleClassName)}>
        <span>{definition.chineseName}</span>
      </div>
      {showMeaning ? (
        <p className="text-xs font-normal leading-5 text-muted-foreground">{definition.meaning}</p>
      ) : null}
    </div>
  );
}

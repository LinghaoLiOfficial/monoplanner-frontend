import { Badge } from "@/components/ui/badge";
import { implementationScopeLabels } from "@/lib/design-asset-labels";
import type { ImplementationScope } from "@/lib/types/business-story";

export function ImplementationScopeBadge({ scope }: { scope: ImplementationScope }) {
  return (
    <Badge variant="outline" className="whitespace-nowrap border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-300">
      {implementationScopeLabels[scope]}
    </Badge>
  );
}

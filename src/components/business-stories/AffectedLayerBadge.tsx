import { Badge } from "@/components/ui/badge";
import { affectedLayerLabels } from "@/lib/design-asset-labels";
import type { AffectedLayer } from "@/lib/types/business-story";

export function AffectedLayerBadge({ layer }: { layer: AffectedLayer }) {
  return (
    <Badge variant="outline" className="whitespace-nowrap border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
      {affectedLayerLabels[layer]}
    </Badge>
  );
}

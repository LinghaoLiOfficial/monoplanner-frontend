import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/design-asset-labels";
import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export function AssetHeader({
  asset,
  emptyTitle = "暂无版本",
  emptyDescription = "应用变更集后会在这里显示最新设计资产。",
}: {
  asset: VersionedDesignAsset | null;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (!asset) {
    return (
      <Card>
        <CardContent className="py-6">
          <h2 className="text-lg font-semibold">{emptyTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{emptyDescription}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 py-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold">{asset.title}</h2>
            <Badge variant="outline">v{asset.version}</Badge>
          </div>
          {asset.summary ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{asset.summary}</p>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">{formatDateTime(asset.created_at)}</p>
      </CardContent>
    </Card>
  );
}

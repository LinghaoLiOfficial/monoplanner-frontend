import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/design-asset-labels";
import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export function AssetHeader({
  asset,
  emptyTitle = "暂无版本",
  emptyDescription = "应用变更集后会在这里显示最新设计资产。",
  titleIcon: TitleIcon,
}: {
  asset: VersionedDesignAsset | null;
  emptyTitle?: string;
  emptyDescription?: string;
  titleIcon?: LucideIcon;
}) {
  if (!asset) {
    return (
      <Card>
        <CardContent className="py-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            {TitleIcon ? <TitleIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" /> : null}
            {emptyTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{emptyDescription}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {TitleIcon ? <TitleIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" /> : null}
            <h2 className="text-xl font-semibold">{asset.title}</h2>
            <Badge variant="outline">v{asset.version}</Badge>
            {asset.is_current ? <Badge>当前版本</Badge> : null}
          </div>
          {asset.summary ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{asset.summary}</p>
          ) : null}
          <p className="mt-2 pt-4 text-sm text-muted-foreground">{formatDateTime(asset.created_at)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

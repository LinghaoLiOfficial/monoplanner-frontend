import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/design-asset-labels";
import { cn } from "@/lib/utils";
import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export function sortAssetsByVersion<T extends VersionedDesignAsset>(assets: T[]) {
  return [...assets].sort(
    (a, b) => b.version - a.version || Date.parse(b.created_at) - Date.parse(a.created_at)
  );
}

export function VersionList<T extends VersionedDesignAsset>({
  assets,
  selectedId,
  title = "版本列表",
  description = "选择一个版本查看详情",
  onSelect,
}: {
  assets: T[];
  selectedId?: string | null;
  title?: string;
  description?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {assets.length === 0 ? (
          <p className="text-sm leading-6 text-muted-foreground">暂无版本</p>
        ) : null}
        {assets.map((asset) => {
          const active = selectedId === asset.id;

          return (
            <Button
              key={asset.id}
              type="button"
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start rounded-2xl border border-border/60 px-4 py-3 text-left",
                active && "border-foreground bg-muted"
              )}
              onClick={() => onSelect(asset.id)}
            >
              <span className="min-w-0 space-y-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{asset.title}</span>
                  <Badge variant="outline">v{asset.version}</Badge>
                </span>
                <span className="block text-xs text-muted-foreground">{formatDateTime(asset.created_at)}</span>
              </span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

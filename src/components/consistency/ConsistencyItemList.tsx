import { Badge } from "@/components/ui/badge";
import type { ConsistencyCheckItem } from "@/lib/types/consistency";

const levelVariant: Record<ConsistencyCheckItem["level"], "default" | "secondary" | "outline" | "destructive"> = {
  info: "outline",
  warning: "secondary",
  error: "destructive",
};

export function ConsistencyItemList({ items }: { items: ConsistencyCheckItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">暂无检查项。</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={`${item.source}-${item.code}-${item.message}`} className="rounded-2xl border border-border/60 bg-background/70 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={levelVariant[item.level] ?? "outline"}>{item.level}</Badge>
            <Badge variant="outline">{item.source}</Badge>
            <span className="font-mono text-xs text-muted-foreground">{item.code}</span>
          </div>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.message}</p>
        </div>
      ))}
    </div>
  );
}

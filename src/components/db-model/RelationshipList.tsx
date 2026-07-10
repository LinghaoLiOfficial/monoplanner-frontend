import { Badge } from "@/components/ui/badge";
import type { DbIndex, DbRelationship } from "@/lib/types/db-model";

export function RelationshipList({ relationships }: { relationships: DbRelationship[] }) {
  if (relationships.length === 0) {
    return <p className="text-sm text-muted-foreground">暂无 relationships</p>;
  }

  return (
    <div className="space-y-2">
      {relationships.map((item) => (
        <div key={`${item.from}-${item.to}-${item.type}`} className="rounded-2xl border border-border/60 bg-background/70 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{item.from}</span>
            <Badge variant="outline">{item.type}</Badge>
            <span className="font-medium">{item.to}</span>
          </div>
          {item.description ? <p className="mt-2 text-sm text-muted-foreground">{item.description}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function IndexList({ indexes }: { indexes: DbIndex[] }) {
  if (indexes.length === 0) {
    return <p className="text-sm text-muted-foreground">暂无 indexes</p>;
  }

  return (
    <div className="space-y-2">
      {indexes.map((item) => (
        <div key={`${item.table}-${item.fields.join("-")}`} className="rounded-2xl border border-border/60 bg-background/70 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{item.table}</Badge>
            <span className="font-mono text-xs">{item.fields.join(", ")}</span>
          </div>
          {item.reason ? <p className="mt-2 text-sm text-muted-foreground">{item.reason}</p> : null}
        </div>
      ))}
    </div>
  );
}

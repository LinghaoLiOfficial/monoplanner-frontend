import { ShieldCheck } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { ConsistencyItemList } from "@/components/consistency/ConsistencyItemList";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConsistencyCheck } from "@/lib/types/consistency";

const statusMeta: Record<ConsistencyCheck["status"], { label: string; className: string }> = {
  passed: { label: "Passed", className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  warning: { label: "Warning", className: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  failed: { label: "Failed", className: "border-destructive/40 bg-destructive/10 text-destructive" },
};

export function ConsistencyCheckPanel({ check }: { check: ConsistencyCheck | null }) {
  if (!check) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="暂无一致性检查结果"
        description="运行一致性检查后，可查看 Blueprint、API 契约、数据库模型和 Prompt Pack 之间的问题"
      />
    );
  }

  const meta = statusMeta[check.status] ?? {
    label: check.status,
    className: "border-border bg-secondary text-secondary-foreground",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>一致性检查结果</CardTitle>
            <CardDescription>展示整体状态和逐项检查结果</CardDescription>
          </div>
          <Badge className={meta.className}>{meta.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ConsistencyItemList items={check.items} />
      </CardContent>
    </Card>
  );
}

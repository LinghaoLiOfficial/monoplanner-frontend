import { JsonViewer } from "@/components/common/JsonViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { affectedLayerLabels } from "@/lib/design-asset-labels";
import type { ChangeSet } from "@/lib/types/change-set";
import type { ModuleChangeGroup } from "@/lib/types/design-asset";

const groupLabels: Array<[keyof ModuleChangeGroup, string]> = [
  ["added", "新增"],
  ["modified", "修改"],
  ["removed", "删除"],
  ["unchanged", "不变"],
];

const moduleLabels: Record<keyof ChangeSet["module_changes"], string> = {
  ux_design: affectedLayerLabels.ux_design,
  ui_design: affectedLayerLabels.ui_design,
  frontend_pages: affectedLayerLabels.frontend_pages,
  frontend_tools: affectedLayerLabels.frontend_tools,
  api_contract: affectedLayerLabels.api_contract,
  backend_services: affectedLayerLabels.backend_services,
  backend_tools: affectedLayerLabels.backend_tools,
  database_models: affectedLayerLabels.database_models,
};

const moduleOrder: Array<keyof ChangeSet["module_changes"]> = [
  "ux_design",
  "ui_design",
  "frontend_pages",
  "frontend_tools",
  "api_contract",
  "backend_services",
  "backend_tools",
  "database_models",
];

function PreviewValue({ value }: { value: unknown }) {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return <span>{String(value)}</span>;
  }

  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    const title = record.title ?? record.name ?? record.path ?? record.id;

    if (typeof title === "string") {
      return <span>{title}</span>;
    }
  }

  return <code className="text-xs">{JSON.stringify(value)}</code>;
}

export function ModuleChangeViewer({
  moduleChanges,
}: {
  moduleChanges: ChangeSet["module_changes"];
}) {
  const entries = moduleOrder
    .filter((moduleKey) => Boolean(moduleChanges[moduleKey]))
    .map((moduleKey) => [moduleKey, moduleChanges[moduleKey] as ModuleChangeGroup] as const);

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>模块变更</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">暂无模块变更明细</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>模块变更</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map(([moduleKey, group]) => (
          <section key={moduleKey} className="rounded-2xl border border-border/60 p-4">
            <h3 className="font-medium">{moduleLabels[moduleKey]}</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {groupLabels.map(([groupKey, label]) => {
                const items = group[groupKey] ?? [];

                return (
                  <div key={groupKey} className="rounded-2xl bg-muted/50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-medium">{label}</h4>
                      <span className="text-xs text-muted-foreground">{items.length}</span>
                    </div>
                    {items.length > 0 ? (
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                        {items.slice(0, 6).map((item, index) => (
                          <li key={index} className="truncate">
                            <PreviewValue value={item} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">暂无</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
        <JsonViewer title="模块变更 JSON" data={moduleChanges} />
      </CardContent>
    </Card>
  );
}

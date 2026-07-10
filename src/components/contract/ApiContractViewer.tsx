import { Code2 } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { JsonViewer } from "@/components/common/JsonViewer";
import { EndpointTable } from "@/components/contract/EndpointTable";
import { SchemaList } from "@/components/contract/SchemaList";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiContractDraft } from "@/lib/types/api-contract";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ApiContractViewer({ contract }: { contract: ApiContractDraft | null }) {
  if (!contract) {
    return (
      <EmptyState
        icon={Code2}
        title="当前项目还没有 API 契约草案"
        description="先在工作台或本页触发生成，随后可查看 endpoints、schemas 和完整 JSON"
      />
    );
  }

  const resources = Array.isArray(contract.content.resources) ? contract.content.resources : [];
  const schemas = Array.isArray(contract.content.schemas) ? contract.content.schemas : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>{contract.title}</CardTitle>
              <CardDescription>{contract.summary}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>v{contract.version}</Badge>
              <Badge variant="outline">{contract.base_path || contract.content.base_path}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">创建时间：{formatDate(contract.created_at)}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resources & Endpoints</CardTitle>
          <CardDescription>按资源分组展示接口契约草案</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {resources.map((resource) => (
            <section key={resource.name} className="space-y-3 rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
              <div>
                <h3 className="font-medium">{resource.name}</h3>
                {resource.description ? <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p> : null}
              </div>
              <EndpointTable endpoints={resource.endpoints} />
            </section>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schemas</CardTitle>
          <CardDescription>接口请求和响应中涉及的数据结构</CardDescription>
        </CardHeader>
        <CardContent>
          <SchemaList schemas={schemas} />
        </CardContent>
      </Card>

      <JsonViewer data={contract} title="完整 API Contract JSON" />
    </div>
  );
}

import { Database } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { JsonViewer } from "@/components/common/JsonViewer";
import { EntityTable } from "@/components/db-model/EntityTable";
import { IndexList, RelationshipList } from "@/components/db-model/RelationshipList";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DbModelDraft } from "@/lib/types/db-model";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function DbModelViewer({ model }: { model: DbModelDraft | null }) {
  if (!model) {
    return (
      <EmptyState
        icon={Database}
        title="当前项目还没有数据库模型草案"
        description="先在工作台或本页触发生成，随后可查看实体、字段、关系和完整 JSON"
      />
    );
  }

  const database = model.content.database;
  const entities = Array.isArray(model.content.entities) ? model.content.entities : [];
  const relationships = Array.isArray(model.content.relationships) ? model.content.relationships : [];
  const indexes = Array.isArray(model.content.indexes) ? model.content.indexes : [];
  const migrationNotes = Array.isArray(model.content.migration_notes) ? model.content.migration_notes : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>{model.title}</CardTitle>
              <CardDescription>{model.summary}</CardDescription>
            </div>
            <Badge>v{model.version}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground md:grid-cols-4">
          <div>创建时间：{formatDate(model.created_at)}</div>
          <div>Engine：{database?.engine || "未指定"}</div>
          <div>ORM：{database?.orm || "未指定"}</div>
          <div>Migration：{database?.migration_tool || "未指定"}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entities</CardTitle>
          <CardDescription>核心数据实体与字段草案</CardDescription>
        </CardHeader>
        <CardContent>
          <EntityTable entities={entities} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <RelationshipList relationships={relationships} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Indexes</CardTitle>
          </CardHeader>
          <CardContent>
            <IndexList indexes={indexes} />
          </CardContent>
        </Card>
      </div>

      {migrationNotes.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Migration Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm leading-7 text-muted-foreground">
              {migrationNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <JsonViewer data={model} title="完整 DB Model JSON" />
    </div>
  );
}

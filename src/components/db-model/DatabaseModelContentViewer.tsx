"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import {
  MetricStrip,
  RelationshipMap,
  StatusBadge,
  TextChips,
  VisualSection,
  visualIcons,
} from "@/components/design-assets/visual-dashboard";
import { FieldHint } from "@/components/ui/field-hint";
import {
  databaseModelLegacySections,
} from "@/lib/database-model-contract";
import {
  isNewDbModelContent,
  type DatabaseField,
  type DbIndex,
  type DbModelContent,
  type DbRelationship,
  type NewDbModelContent,
} from "@/lib/types/db-model";

function relationshipTitle(relationship: DbRelationship) {
  return `${relationship.from ?? relationship.field ?? "-"} -> ${relationship.to ?? relationship.target ?? "-"} (${relationship.type})`;
}

function FieldTable({ fields }: { fields: DatabaseField[] }) {
  if (fields.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">暂无字段</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>字段</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>主键</TableHead>
            <TableHead>必填</TableHead>
            <TableHead>可空</TableHead>
            <TableHead>说明</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field.name}>
              <TableCell className="font-mono text-xs">{field.name}</TableCell>
              <TableCell className="font-mono text-xs">{field.type}</TableCell>
              <TableCell>{field.primary_key ? "是" : "否"}</TableCell>
              <TableCell>{field.required ? "是" : "否"}</TableCell>
              <TableCell>{field.nullable ? "是" : "否"}</TableCell>
              <TableCell className="min-w-48 text-muted-foreground">{field.description || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function IndexList({ indexes }: { indexes: DbIndex[] }) {
  if (indexes.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">暂无索引</p>;
  }

  return (
    <div className="space-y-2">
      {indexes.map((index, itemIndex) => (
        <div key={`${index.table}-${index.fields.join("-")}-${itemIndex}`} className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{index.table}</Badge>
            <code className="text-xs text-muted-foreground">{index.fields.join(", ")}</code>
          </div>
          {index.reason ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{index.reason}</p> : null}
        </div>
      ))}
    </div>
  );
}

function RelationshipList({ relationships }: { relationships: DbRelationship[] }) {
  if (relationships.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">暂无关系</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {relationships.map((relationship, index) => (
        <StatusBadge key={`${relationshipTitle(relationship)}-${index}`} label={relationshipTitle(relationship)} tone="muted" />
      ))}
    </div>
  );
}

function NewDatabaseModelContentView({ content }: { content: NewDbModelContent }) {
  const tables = Array.isArray(content.database_tables) ? content.database_tables : [];
  const relationships = Array.isArray(content.relationships) ? content.relationships : [];
  const indexes = Array.isArray(content.indexes) ? content.indexes : [];
  const migrationNotes = Array.isArray(content.migration_notes) ? content.migration_notes : [];
  const fieldCount = tables.reduce((sum, table) => sum + (table.fields?.length ?? 0), 0);
  const tableRelationships = tables.flatMap((table) => table.relationships ?? []);
  const allRelationships = [...relationships, ...tableRelationships];
  const tableIndexes = tables.flatMap((table) => table.indexes ?? []);

  return (
    <div className="space-y-4">
      <MetricStrip
        items={[
          { label: "数据表", value: tables.length, description: content.database?.engine || "未指定数据库引擎" },
          { label: "字段", value: fieldCount, description: "所有表字段总数" },
          { label: "关系", value: allRelationships.length, description: "全局关系 + 表内关系" },
          { label: "索引 / 迁移", value: `${indexes.length + tableIndexes.length} / ${migrationNotes.length}`, description: `${content.database?.orm || "ORM 未指定"} · ${content.database?.migration_tool || "迁移工具未指定"}` },
        ]}
      />

      <VisualSection
        title={
          <FieldHint
            label="数据库关系图"
            hint="以表为节点展示关系、索引和迁移关注点。"
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.database}
      >
        <RelationshipMap
          nodes={tables.map((table) => ({
            id: table.table_name ?? table.name,
            title: table.name,
            subtitle: table.description || table.table_name || "暂无表说明",
            badge: <StatusBadge label={`${table.fields?.length ?? 0} 字段`} tone="muted" />,
            tone: "accent" as const,
          }))}
          edges={allRelationships.map((relationship) => ({
            from: relationship.from ?? relationship.field ?? "",
            to: relationship.to ?? relationship.target ?? "",
            label: relationship.type,
          })).filter((edge) => edge.from && edge.to)}
          emptyText="暂无数据表"
        />
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label="实体与字段"
            hint="展示每张表的字段、关系、索引和迁移说明。"
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.workflow}
      >
        <div className="space-y-4">
          {tables.length > 0 ? (
            tables.map((table, index) => (
              <section key={`${table.table_name ?? table.name}-${index}`} className="space-y-4 rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">{table.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{table.description || "暂无表说明"}</p>
                  </div>
                  {table.table_name ? <Badge variant="outline">{table.table_name}</Badge> : null}
                </div>
                <FieldTable fields={Array.isArray(table.fields) ? table.fields : []} />
                <div className="grid gap-3 xl:grid-cols-3">
                  <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                    <p className="text-sm font-medium text-muted-foreground">表内关系</p>
                    <RelationshipList relationships={Array.isArray(table.relationships) ? table.relationships : []} />
                  </div>
                  <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                    <p className="text-sm font-medium text-muted-foreground">表内索引</p>
                    <IndexList indexes={Array.isArray(table.indexes) ? table.indexes : []} />
                  </div>
                  <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                    <p className="text-sm font-medium text-muted-foreground">迁移说明</p>
                    <TextChips values={Array.isArray(table.migration_notes) ? table.migration_notes : []} emptyText="暂无迁移说明" />
                  </div>
                </div>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无数据表</p>
          )}
        </div>
      </VisualSection>

      <div className="grid gap-4 xl:grid-cols-3">
        <VisualSection title="全局关系" icon={visualIcons.branch}>
          <RelationshipList relationships={relationships} />
        </VisualSection>
        <VisualSection title="全局索引" icon={visualIcons.dot}>
          <IndexList indexes={indexes} />
        </VisualSection>
        <VisualSection title="迁移说明" icon={visualIcons.workflow}>
          <TextChips values={migrationNotes} emptyText="暂无迁移说明" />
        </VisualSection>
      </div>

    </div>
  );
}

function LegacyDatabaseModelContentView({ content }: { content: DbModelContent }) {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          这是历史数据库模型内容结构，保留兼容读取。新版资产会使用数据库模型、数据表、表、字段集合和字段契约。
        </AlertDescription>
      </Alert>
      <AssetContentSections content={content as Record<string, unknown>} sections={databaseModelLegacySections} />
    </div>
  );
}

export function DatabaseModelContentViewer({ content }: { content: DbModelContent }) {
  if (isNewDbModelContent(content)) {
    return <NewDatabaseModelContentView content={content} />;
  }

  return <LegacyDatabaseModelContentView content={content} />;
}

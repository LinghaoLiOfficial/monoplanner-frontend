"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import { DatabaseModelFieldHeading } from "@/components/db-model/DatabaseModelFieldDefinition";
import {
  databaseModelFieldDefinitions,
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

function TextList({ values, emptyText = "暂无" }: { values: string[]; emptyText?: string }) {
  if (values.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{emptyText}</p>;
  }

  return (
    <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
      {values.map((value, index) => (
        <li key={`${value}-${index}`}>{value}</li>
      ))}
    </ul>
  );
}

function RelationshipSummary({ relationships }: { relationships: DbRelationship[] }) {
  if (relationships.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {relationships.map((relationship, index) => (
        <Badge key={`${relationship.from ?? relationship.field}-${relationship.to ?? relationship.target}-${index}`} variant="secondary">
          {relationship.from ?? relationship.field} -&gt; {relationship.to ?? relationship.target} ({relationship.type})
        </Badge>
      ))}
    </div>
  );
}

function IndexSummary({ indexes }: { indexes: DbIndex[] }) {
  if (indexes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {indexes.map((index, itemIndex) => (
        <div key={`${index.table}-${index.fields.join("-")}-${itemIndex}`} className="rounded-lg border border-border/60 bg-muted/30 p-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="outline">{index.table}</Badge>
            <span className="font-mono text-xs text-muted-foreground">{index.fields.join(", ")}</span>
          </div>
          {index.reason ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{index.reason}</p> : null}
        </div>
      ))}
    </div>
  );
}

function FieldRows({ fields }: { fields: DatabaseField[] }) {
  if (fields.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">暂无字段</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <DatabaseModelFieldHeading
              definition={databaseModelFieldDefinitions.field}
              showMeaning={false}
            />
          </TableHead>
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
            <TableCell>
              <div className="space-y-1">
                <DatabaseModelFieldHeading
                  definition={databaseModelFieldDefinitions.field}
                  titleClassName="text-sm font-medium"
                />
                <code className="text-xs text-muted-foreground">{field.name}</code>
              </div>
            </TableCell>
            <TableCell className="font-mono text-xs">{field.type}</TableCell>
            <TableCell>{field.primary_key ? "是" : "否"}</TableCell>
            <TableCell>{field.required ? "是" : "否"}</TableCell>
            <TableCell>{field.nullable ? "是" : "否"}</TableCell>
            <TableCell className="text-muted-foreground">{field.description || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function NewDatabaseModelContentView({ content }: { content: NewDbModelContent }) {
  const tables = Array.isArray(content.database_tables) ? content.database_tables : [];
  const relationships = Array.isArray(content.relationships) ? content.relationships : [];
  const indexes = Array.isArray(content.indexes) ? content.indexes : [];
  const migrationNotes = Array.isArray(content.migration_notes) ? content.migration_notes : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <DatabaseModelFieldHeading definition={databaseModelFieldDefinitions.database_model} />
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
          <div>Engine：{content.database?.engine || "未指定"}</div>
          <div>ORM：{content.database?.orm || "未指定"}</div>
          <div>Migration：{content.database?.migration_tool || "未指定"}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <DatabaseModelFieldHeading definition={databaseModelFieldDefinitions.database_tables} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tables.length > 0 ? (
            tables.map((table, index) => (
              <section key={`${table.table_name ?? table.name}-${index}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <DatabaseModelFieldHeading definition={databaseModelFieldDefinitions.database_table} />
                  {table.table_name ? <Badge variant="outline">{table.table_name}</Badge> : null}
                </div>
                <div>
                  <h3 className="text-base font-semibold">{table.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{table.description || "暂无表说明"}</p>
                </div>
                <div className="space-y-3">
                  <DatabaseModelFieldHeading definition={databaseModelFieldDefinitions.fields} />
                  <FieldRows fields={Array.isArray(table.fields) ? table.fields : []} />
                </div>
                <RelationshipSummary relationships={Array.isArray(table.relationships) ? table.relationships : []} />
                <IndexSummary indexes={Array.isArray(table.indexes) ? table.indexes : []} />
                <TextList
                  values={Array.isArray(table.migration_notes) ? table.migration_notes : []}
                  emptyText=""
                />
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无数据表</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">关系补充</CardTitle>
          </CardHeader>
          <CardContent>
            <RelationshipSummary relationships={relationships} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">索引补充</CardTitle>
          </CardHeader>
          <CardContent>
            <IndexSummary indexes={indexes} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">迁移说明</CardTitle>
          </CardHeader>
          <CardContent>
            <TextList values={migrationNotes} />
          </CardContent>
        </Card>
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
      <AssetContentSections
        content={content as Record<string, unknown>}
        sections={databaseModelLegacySections}
      />
    </div>
  );
}

export function DatabaseModelContentViewer({ content }: { content: DbModelContent }) {
  if (isNewDbModelContent(content)) {
    return <NewDatabaseModelContentView content={content} />;
  }

  return <LegacyDatabaseModelContentView content={content} />;
}

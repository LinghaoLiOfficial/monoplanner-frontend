import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ApiSchema } from "@/lib/types/api-contract";

export function SchemaList({ schemas }: { schemas: ApiSchema[] }) {
  if (schemas.length === 0) {
    return <p className="text-sm text-muted-foreground">暂无 schemas。</p>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {schemas.map((schema) => (
        <Card key={schema.name} className="bg-background/70">
          <CardHeader>
            <CardTitle className="text-base">{schema.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schema.fields.map((field) => (
                  <TableRow key={`${schema.name}-${field.name}`}>
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell className="font-mono text-xs">{field.type}</TableCell>
                    <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-muted-foreground">{field.description || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

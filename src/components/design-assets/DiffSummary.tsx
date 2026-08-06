import { JsonViewer } from "@/components/common/JsonViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DiffSummary({ diff }: { diff: unknown }) {
  if (!diff) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>版本差异</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">暂无版本差异记录</p>
        </CardContent>
      </Card>
    );
  }

  if (typeof diff === "string") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>版本差异</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{diff}</p>
        </CardContent>
      </Card>
    );
  }

  return <JsonViewer title="版本差异" data={diff} />;
}

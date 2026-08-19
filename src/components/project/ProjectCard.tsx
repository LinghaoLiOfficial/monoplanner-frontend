import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/types/project";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ProjectCard({
  project,
  onDelete,
}: {
  project: Project;
  onDelete?: (project: Project) => void;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="line-clamp-3 leading-6">
            {project.description?.trim() || "暂无项目描述"}
          </p>
          <Badge variant="outline" className="whitespace-nowrap">
            创建时间：{formatDate(project.created_at)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/projects/${project.id}`}>进入</Link>
          </Button>
          {onDelete ? (
            <Button
              type="button"
              variant="destructive"
              className="bg-destructive/10 text-destructive shadow-none hover:bg-destructive/15"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDelete(project);
              }}
            >
              删除
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

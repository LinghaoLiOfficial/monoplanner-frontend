import Link from "next/link";

import { ProjectStatusBadge } from "@/components/project/ProjectStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/types/project";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>{project.description || "暂无项目描述"}</CardDescription>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <div>前端：{project.target_frontend_stack || "未设置"}</div>
          <div>后端：{project.target_backend_stack || "未设置"}</div>
          <div className="sm:col-span-2">创建时间：{formatDate(project.created_at)}</div>
        </div>
        <Button asChild>
          <Link href={`/projects/${project.id}`}>进入工作台</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

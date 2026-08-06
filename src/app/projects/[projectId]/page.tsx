"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { GenerationActionPanel } from "@/components/project/GenerationActionPanel";
import { ProjectStatusBadge } from "@/components/project/ProjectStatusBadge";
import { RequirementEditor } from "@/components/requirement/RequirementEditor";
import { RequirementList } from "@/components/requirement/RequirementList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectBlueprints } from "@/lib/api/blueprints";
import { getProject } from "@/lib/api/projects";
import { createProjectRequirement, getProjectRequirements } from "@/lib/api/requirements";
import { isProjectTechStackConfigured } from "@/lib/project-tech-stack";
import type { ProjectBlueprint } from "@/lib/types/blueprint";
import type { Project } from "@/lib/types/project";
import type { Requirement } from "@/lib/types/requirement";

function getLatestBlueprint(blueprints: ProjectBlueprint[]) {
  return [...blueprints].sort((a, b) => b.version - a.version || Date.parse(b.created_at) - Date.parse(a.created_at))[0] ?? null;
}

export default function ProjectWorkspacePage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [project, setProject] = useState<Project | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [blueprints, setBlueprints] = useState<ProjectBlueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const latestBlueprint = useMemo(() => getLatestBlueprint(blueprints), [blueprints]);
  const isTechStackConfigured = project
    ? isProjectTechStackConfigured(project)
    : false;

  const loadWorkspace = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectData, requirementsData, blueprintsData] = await Promise.all([
        getProject(projectId),
        getProjectRequirements(projectId),
        getProjectBlueprints(projectId),
      ]);
      setProject(projectData);
      setRequirements(requirementsData);
      setBlueprints(blueprintsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载项目工作台失败");
    } finally {
      setLoading(false);
    }
  };

  const refreshRequirements = async () => {
    setRequirements(await getProjectRequirements(projectId));
  };

  const handleSaveRequirement = async (rawText: string) => {
    const requirement = await createProjectRequirement(projectId, {
      raw_text: rawText,
      language: "zh-CN",
      source_type: "manual",
    });
    await refreshRequirements();
    return requirement;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (loading) {
    return <LoadingState label="正在加载项目工作台..." />;
  }

  if (error || !project) {
    return <ErrorState title="项目不可用" message={error || "项目不存在"} actionLabel="重新加载" onAction={loadWorkspace} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/projects">返回项目列表</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}/configuration`}>项目配置</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}/business-requirements`}>敏捷业务需求</Link>
          </Button>
        </div>
      </div>

      <GenerationActionPanel
        projectId={projectId}
        hasBlueprint={Boolean(latestBlueprint)}
        isTechStackConfigured={isTechStackConfigured}
      />

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <RequirementEditor onSave={handleSaveRequirement} />
          <Card>
            <CardHeader>
              <CardTitle>原始用户需求</CardTitle>
              <CardDescription>最近保存的自然语言需求</CardDescription>
            </CardHeader>
            <CardContent>
              <RequirementList requirements={requirements} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>当前编排状态</CardTitle>
              <CardDescription>新版流程会在应用变更集后更新前端工程实现、API 契约、后端工程实现、数据库模型和交付资产</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/60 p-4">
                <p className="text-sm font-medium">项目配置</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isTechStackConfigured ? "已配置前后端技术栈" : "尚未完成项目配置"}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 p-4">
                <p className="text-sm font-medium">项目蓝图</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {latestBlueprint ? `当前最新版本：v${latestBlueprint.version}` : "暂无蓝图版本"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <Link href={`/projects/${projectId}/configuration`}>项目配置</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/projects/${projectId}/frontend-implementation`}>前端工程实现</Link>
                </Button>
                <Button asChild>
                  <Link href={`/projects/${projectId}/delivery`}>交付 / 指令集合</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

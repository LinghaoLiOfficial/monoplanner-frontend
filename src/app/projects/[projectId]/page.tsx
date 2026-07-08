"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BlueprintViewer } from "@/components/blueprint/BlueprintViewer";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { GenerationActionPanel } from "@/components/project/GenerationActionPanel";
import { ProjectStatusBadge } from "@/components/project/ProjectStatusBadge";
import { ProjectWorkspaceNav } from "@/components/project/ProjectWorkspaceNav";
import { RequirementEditor } from "@/components/requirement/RequirementEditor";
import { RequirementList } from "@/components/requirement/RequirementList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateProjectBlueprint, getProjectBlueprints } from "@/lib/api/blueprints";
import { getProject } from "@/lib/api/projects";
import { createProjectRequirement, getProjectRequirements } from "@/lib/api/requirements";
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
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState<string | null>(null);

  const latestBlueprint = useMemo(() => getLatestBlueprint(blueprints), [blueprints]);

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
      setError(err instanceof Error ? err.message : "加载项目工作台失败。");
    } finally {
      setLoading(false);
    }
  };

  const refreshRequirements = async () => {
    setRequirements(await getProjectRequirements(projectId));
  };

  const refreshBlueprints = async () => {
    setBlueprints(await getProjectBlueprints(projectId));
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

  const handleGenerateBlueprint = async () => {
    setGenerating(true);
    setGenerateError(null);
    setGenerateSuccess(null);
    try {
      await generateProjectBlueprint(projectId);
      await refreshBlueprints();
      setGenerateSuccess("蓝图草案已生成。");
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "生成 blueprint 草案失败。");
    } finally {
      setGenerating(false);
    }
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
    return <ErrorState title="项目不可用" message={error || "项目不存在。"} actionLabel="重新加载" onAction={loadWorkspace} />;
  }

  return (
    <div className="space-y-6 pb-12">
      <ProjectWorkspaceNav projectId={projectId} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Project Workspace</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
            <ProjectStatusBadge status={project.status} />
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            {project.description || "暂无项目描述"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/projects">返回项目列表</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}/blueprint`}>蓝图版本</Link>
          </Button>
        </div>
      </div>

      <GenerationActionPanel projectId={projectId} hasBlueprint={Boolean(latestBlueprint)} onGenerated={refreshBlueprints} />

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <RequirementEditor onSave={handleSaveRequirement} />
          <Card>
            <CardHeader>
              <CardTitle>需求历史</CardTitle>
              <CardDescription>最近保存的自然语言需求。</CardDescription>
            </CardHeader>
            <CardContent>
              <RequirementList requirements={requirements} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Blueprint 预览</CardTitle>
              <CardDescription>调用后端占位接口生成并展示最新 JSON 草案。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generateError ? <ErrorState message={generateError} /> : null}
              {generateSuccess ? <p className="text-sm text-muted-foreground">{generateSuccess}</p> : null}
              <Button type="button" onClick={handleGenerateBlueprint} disabled={generating}>
                {generating ? "正在生成蓝图草案..." : "生成蓝图草案"}
              </Button>
            </CardContent>
          </Card>
          <BlueprintViewer blueprint={latestBlueprint} />
        </div>
      </div>
    </div>
  );
}

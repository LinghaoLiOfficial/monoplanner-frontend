"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BlueprintViewer } from "@/components/blueprint/BlueprintViewer";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { SavedGenerationPanel } from "@/components/common/SavedGenerationPanel";
import { GenerationActionPanel } from "@/components/project/GenerationActionPanel";
import { ProjectStatusBadge } from "@/components/project/ProjectStatusBadge";
import { ProjectWorkspaceNav } from "@/components/project/ProjectWorkspaceNav";
import { RequirementEditor } from "@/components/requirement/RequirementEditor";
import { RequirementList } from "@/components/requirement/RequirementList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateProjectBlueprint, getProjectBlueprints } from "@/lib/api/blueprints";
import { getGenerationErrorMessage } from "@/lib/api/generation-errors";
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

  const refreshBlueprints = async () => {
    setBlueprints(await getProjectBlueprints(projectId));
  };

  const handleGenerateBlueprint = async () => {
    if (!isTechStackConfigured) {
      throw new Error("请先在项目蓝图页完成技术栈首次配置");
    }

    await generateProjectBlueprint(projectId);
    await refreshBlueprints();
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
    <div className="space-y-6 pb-12">
      <ProjectWorkspaceNav projectId={projectId} />

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
            <Link href={`/projects/${projectId}/blueprint`}>蓝图版本</Link>
          </Button>
        </div>
      </div>

      <GenerationActionPanel
        projectId={projectId}
        hasBlueprint={Boolean(latestBlueprint)}
        isTechStackConfigured={isTechStackConfigured}
        onGenerated={refreshBlueprints}
      />

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <RequirementEditor onSave={handleSaveRequirement} />
          <Card>
            <CardHeader>
              <CardTitle>需求历史</CardTitle>
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
              <CardTitle>Project Blueprint 预览</CardTitle>
              <CardDescription>调用后端生成接口，由大模型基于用户需求和业务需求池生成最新 JSON 蓝图</CardDescription>
            </CardHeader>
            <CardContent>
              <SavedGenerationPanel
                buttonLabel="生成蓝图"
                loadingLabel="正在生成蓝图，请稍候..."
                successLabel="蓝图已生成"
                description={
                  isTechStackConfigured
                    ? "后端会流式读取大模型输出，并在完成后保存为项目蓝图，后端正在调用大模型并保存结果，生成可能需要一些时间"
                    : "请先前往项目蓝图页完成技术栈首次配置，保存后不可修改"
                }
                disabled={!isTechStackConfigured}
                onGenerate={handleGenerateBlueprint}
                formatError={(err) => getGenerationErrorMessage(err, "蓝图")}
              />
              {!isTechStackConfigured ? (
                <Button asChild variant="outline" className="mt-4">
                  <Link href={`/projects/${projectId}/blueprint`}>配置技术栈</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
          <BlueprintViewer blueprint={latestBlueprint} />
        </div>
      </div>
    </div>
  );
}

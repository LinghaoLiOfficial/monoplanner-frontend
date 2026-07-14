"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { TechStackConfigCard } from "@/components/blueprint/TechStackConfigCard";
import { BlueprintViewer } from "@/components/blueprint/BlueprintViewer";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { SavedGenerationPanel } from "@/components/common/SavedGenerationPanel";
import { ProjectWorkspaceNav } from "@/components/project/ProjectWorkspaceNav";
import { Button } from "@/components/ui/button";
import { generateProjectBlueprint, getProjectBlueprints } from "@/lib/api/blueprints";
import { getGenerationErrorMessage } from "@/lib/api/generation-errors";
import { getProject, updateProject } from "@/lib/api/projects";
import { DEFAULT_BACKEND_STACK, DEFAULT_FRONTEND_STACK } from "@/lib/constants/project";
import { isProjectTechStackConfigured } from "@/lib/project-tech-stack";
import type { ProjectBlueprint } from "@/lib/types/blueprint";
import type { Project } from "@/lib/types/project";

function sortBlueprints(blueprints: ProjectBlueprint[]) {
  return [...blueprints].sort((a, b) => b.version - a.version || Date.parse(b.created_at) - Date.parse(a.created_at));
}

export default function ProjectBlueprintPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [project, setProject] = useState<Project | null>(null);
  const [blueprints, setBlueprints] = useState<ProjectBlueprint[]>([]);
  const [frontendStack, setFrontendStack] = useState(DEFAULT_FRONTEND_STACK);
  const [backendStack, setBackendStack] = useState(DEFAULT_BACKEND_STACK);
  const [savedFrontendStack, setSavedFrontendStack] = useState(DEFAULT_FRONTEND_STACK);
  const [savedBackendStack, setSavedBackendStack] = useState(DEFAULT_BACKEND_STACK);
  const [savingStacks, setSavingStacks] = useState(false);
  const [stackSaveError, setStackSaveError] = useState<string | null>(null);
  const [stacksSaved, setStacksSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortedBlueprints = useMemo(() => sortBlueprints(blueprints), [blueprints]);
  const selectedBlueprint = sortedBlueprints[0] ?? null;
  const isTechStackConfigured = project
    ? isProjectTechStackConfigured(project)
    : false;
  const stacksDirty = frontendStack !== savedFrontendStack || backendStack !== savedBackendStack;
  const canSaveTechStacks = !isTechStackConfigured && (stacksDirty || Boolean(project));

  const loadBlueprints = async () => {
    setLoading(true);
    setError(null);
    setStackSaveError(null);
    try {
      const [projectData, data] = await Promise.all([
        getProject(projectId),
        getProjectBlueprints(projectId),
      ]);
      const currentFrontendStack = projectData.target_frontend_stack || DEFAULT_FRONTEND_STACK;
      const currentBackendStack = projectData.target_backend_stack || DEFAULT_BACKEND_STACK;
      const sorted = sortBlueprints(data);
      setProject(projectData);
      setFrontendStack(currentFrontendStack);
      setBackendStack(currentBackendStack);
      setSavedFrontendStack(currentFrontendStack);
      setSavedBackendStack(currentBackendStack);
      setStacksSaved(false);
      setBlueprints(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载 blueprint 失败");
    } finally {
      setLoading(false);
    }
  };

  const refreshBlueprints = async () => {
    const data = await getProjectBlueprints(projectId);
    setBlueprints(sortBlueprints(data));
  };

  const saveTechStacks = async () => {
    if (isTechStackConfigured) {
      return project;
    }

    const nextFrontendStack = frontendStack.trim() || DEFAULT_FRONTEND_STACK;
    const nextBackendStack = backendStack.trim() || DEFAULT_BACKEND_STACK;

    setSavingStacks(true);
    setStackSaveError(null);
    try {
      const updatedProject = await updateProject(projectId, {
        target_frontend_stack: nextFrontendStack,
        target_backend_stack: nextBackendStack,
      });
      setProject(updatedProject);
      setFrontendStack(nextFrontendStack);
      setBackendStack(nextBackendStack);
      setSavedFrontendStack(nextFrontendStack);
      setSavedBackendStack(nextBackendStack);
      setStacksSaved(true);
      return updatedProject;
    } catch (err) {
      const message = err instanceof Error ? err.message : "保存技术栈配置失败";
      setStackSaveError(message);
      throw err;
    } finally {
      setSavingStacks(false);
    }
  };

  const handleGenerateBlueprint = async () => {
    if (!isTechStackConfigured) {
      await saveTechStacks();
    }
    await generateProjectBlueprint(projectId);
    await refreshBlueprints();
    setError(null);
  };

  const handleFrontendStackChange = (value: string) => {
    if (isTechStackConfigured) {
      return;
    }
    setFrontendStack(value);
    setStackSaveError(null);
    setStacksSaved(false);
  };

  const handleBackendStackChange = (value: string) => {
    if (isTechStackConfigured) {
      return;
    }
    setBackendStack(value);
    setStackSaveError(null);
    setStacksSaved(false);
  };

  const handleResetStacksToDefault = () => {
    if (isTechStackConfigured) {
      return;
    }
    setFrontendStack(DEFAULT_FRONTEND_STACK);
    setBackendStack(DEFAULT_BACKEND_STACK);
    setStackSaveError(null);
    setStacksSaved(false);
  };

  const handleSaveTechStacks = async () => {
    await saveTechStacks();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadBlueprints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="space-y-6 pb-12">
      <ProjectWorkspaceNav projectId={projectId} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">项目蓝图</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            蓝图会基于用户需求和业务需求池生成，是 API 契约、数据库模型和指令集合的上游依据
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}`}>返回工作台</Link>
          </Button>
        </div>
      </div>

      {!loading && !error && project ? (
        <TechStackConfigCard
          frontendStack={frontendStack}
          backendStack={backendStack}
          saving={savingStacks}
          error={stackSaveError}
          dirty={stacksDirty}
          saved={stacksSaved}
          configured={isTechStackConfigured}
          canSave={canSaveTechStacks}
          onFrontendStackChange={handleFrontendStackChange}
          onBackendStackChange={handleBackendStackChange}
          onSave={handleSaveTechStacks}
          onResetToDefault={handleResetStacksToDefault}
        />
      ) : null}

      <SavedGenerationPanel
        buttonLabel="生成蓝图"
        loadingLabel={!isTechStackConfigured ? "正在保存技术栈配置..." : "正在生成蓝图，请稍候..."}
        successLabel="蓝图已生成"
        description="后端会流式读取大模型输出，并在完成后保存为项目蓝图，后端正在调用大模型并保存结果，生成可能需要一些时间"
        disabled={loading || Boolean(error)}
        onGenerate={handleGenerateBlueprint}
        formatError={(err) => getGenerationErrorMessage(err, "蓝图")}
      />
      {loading ? <LoadingState label="正在加载 blueprint..." /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadBlueprints} /> : null}
      {!loading && !error ? (
        <BlueprintViewer blueprint={selectedBlueprint} />
      ) : null}
    </div>
  );
}

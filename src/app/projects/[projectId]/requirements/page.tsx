"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { RequirementEditor } from "@/components/requirement/RequirementEditor";
import { RequirementList } from "@/components/requirement/RequirementList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ApiError } from "@/lib/api/client";
import { generateBusinessStories } from "@/lib/api/business-stories";
import {
  createProjectRequirement,
  getProjectRequirements,
  getRequirementBusinessStoryGeneration,
} from "@/lib/api/requirements";
import { getRequirementProgressStatus } from "@/lib/requirement-progress";
import type { BusinessStoryGenerationProgress, Requirement } from "@/lib/types/requirement";

const GENERATION_POLL_INTERVAL_MS = 2500;

const rawUserRequirementsField = {
  chineseName: "原始用户需求",
  englishName: "raw_user_requirements",
  meaning: "用户直接输入的未经结构化拆解的原始需求集合。",
};

const newUserRequirementField = {
  chineseName: "新用户需求",
  englishName: "new_user_requirement",
  meaning: "用户当前准备提交的一条新需求输入。",
};

const requirementHistoryField = {
  chineseName: "用户需求历史",
  englishName: "requirement_history",
  meaning: "当前项目中已提交的原始用户需求记录列表。",
};

type RequirementFieldMeta = typeof rawUserRequirementsField;

function FieldMetaTitle({ fieldMeta }: { fieldMeta: RequirementFieldMeta }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{fieldMeta.chineseName}</h1>
        <span className="rounded-full border border-border/60 bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
          {fieldMeta.englishName}
        </span>
      </div>
      <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{fieldMeta.meaning}</p>
    </div>
  );
}

function FieldMetaSectionTitle({ fieldMeta }: { fieldMeta: RequirementFieldMeta }) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold tracking-tight">{fieldMeta.chineseName}</h2>
        <span className="rounded-full border border-border/60 bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
          {fieldMeta.englishName}
        </span>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{fieldMeta.meaning}</p>
    </div>
  );
}

function debugBusinessStoryGeneration(
  requirementId: string,
  event: string,
  details?: Record<string, unknown>
) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.debug("[business-story-generation]", {
    requirement_id: requirementId,
    event,
    ...details,
  });
}

function getBusinessStoryGenerationErrorMessage(err: unknown, fallback: string) {
  if (err instanceof ApiError) {
    if (err.status === 400) {
      return "请先提交用户需求后再更新业务需求故事";
    }

    if (err.status === 503) {
      return "LLM 服务未配置，请检查后端 LLM 配置后重试";
    }

    return err.message;
  }

  return err instanceof Error ? err.message : fallback;
}

function initialGenerationProgress(): BusinessStoryGenerationProgress {
  return {
    run_id: null,
    status: "running",
    progress: 0,
    message: "正在更新业务需求故事",
    error_message: null,
    updated_at: new Date().toISOString(),
  };
}

function failedGenerationProgress(message: string): BusinessStoryGenerationProgress {
  return {
    run_id: null,
    status: "failed",
    progress: 0,
    message: "业务需求故事更新失败",
    error_message: message,
    updated_at: new Date().toISOString(),
  };
}

function abnormalGenerationProgress(message: string): BusinessStoryGenerationProgress {
  return {
    run_id: null,
    status: "failed",
    progress: 0,
    message: "业务需求故事更新状态异常",
    error_message: message,
    updated_at: new Date().toISOString(),
  };
}

export default function ProjectRequirementsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requirementToRetry, setRequirementToRetry] = useState<Requirement | null>(null);
  const activeGenerationIdsRef = useRef<Set<string>>(new Set());

  const loadRequirements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loadedRequirements = await getProjectRequirements(projectId);

      setRequirements(loadedRequirements);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载需求历史失败");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const updateRequirementGeneration = useCallback(
    (requirementId: string, generation: BusinessStoryGenerationProgress | null) => {
      setRequirements((current) =>
        current.map((requirement) =>
          requirement.id === requirementId
            ? { ...requirement, business_story_generation: generation }
          : requirement
        )
      );
    },
    []
  );

  const runningRequirementIds = useMemo(
    () =>
      requirements
        .filter((requirement) => getRequirementProgressStatus(requirement) === "in_progress")
        .map((requirement) => requirement.id),
    [requirements]
  );
  const runningRequirementIdsKey = runningRequirementIds.join(",");
  const hasRunningRequirement = runningRequirementIds.length > 0;

  const runBusinessStoryGeneration = useCallback(
    async (requirementId: string) => {
      if (activeGenerationIdsRef.current.has(requirementId)) {
        return;
      }

      activeGenerationIdsRef.current.add(requirementId);
      updateRequirementGeneration(requirementId, initialGenerationProgress());

      try {
        await generateBusinessStories(projectId, {
          requirement_id: requirementId,
          overwrite: false,
        });
        debugBusinessStoryGeneration(requirementId, "generate_complete");
        await loadRequirements();
      } catch (err) {
        debugBusinessStoryGeneration(requirementId, "generate_error", {
          error: err instanceof Error ? err.message : String(err),
        });
        updateRequirementGeneration(
          requirementId,
          failedGenerationProgress(
            getBusinessStoryGenerationErrorMessage(err, "更新业务需求故事失败")
          )
        );
      } finally {
        activeGenerationIdsRef.current.delete(requirementId);
      }
    },
    [
      loadRequirements,
      projectId,
      updateRequirementGeneration,
    ]
  );

  const handleRetryBusinessStoryGeneration = useCallback(
    (requirementId: string) => {
      const requirement = requirements.find((item) => item.id === requirementId);

      if (requirement && getRequirementProgressStatus(requirement) !== "in_progress") {
        setRequirementToRetry(requirement);
      }
    },
    [requirements]
  );

  const handleConfirmRetryBusinessStoryGeneration = () => {
    if (!requirementToRetry) {
      return;
    }

    if (getRequirementProgressStatus(requirementToRetry) === "in_progress") {
      setRequirementToRetry(null);
      return;
    }

    void runBusinessStoryGeneration(requirementToRetry.id);
    setRequirementToRetry(null);
  };

  const pollRunningRequirementGenerations = useCallback(
    async (requirementIds: string[]) => {
      const generations = await Promise.all(
        requirementIds.map(async (requirementId) => {
          const generation = await getRequirementBusinessStoryGeneration(requirementId);

          debugBusinessStoryGeneration(requirementId, "status_poll", {
            status: generation?.status ?? null,
            progress: generation?.progress ?? null,
            error: generation?.error_message ?? null,
          });

          if (!generation) {
            updateRequirementGeneration(
              requirementId,
              abnormalGenerationProgress("更新任务状态异常，请稍后刷新或重试")
            );
            return null;
          }

          if (generation.status === "idle") {
            updateRequirementGeneration(
              requirementId,
              abnormalGenerationProgress("更新任务状态异常，请稍后刷新或重试")
            );
            return generation;
          }

          updateRequirementGeneration(requirementId, generation);
          return generation;
        })
      );

      if (generations.some((generation) => generation?.status === "succeeded")) {
        await loadRequirements();
      }
    },
    [loadRequirements, updateRequirementGeneration]
  );

  const handleSaveRequirement = async (rawText: string) => {
    const requirement = await createProjectRequirement(projectId, {
      raw_text: rawText,
      language: "zh-CN",
      source_type: "manual",
    });

    const generation = initialGenerationProgress();
    const requirementWithGeneration: Requirement = {
      ...requirement,
      business_story_generation: generation,
    };

    setRequirements((current) => [requirementWithGeneration, ...current]);
    void runBusinessStoryGeneration(requirement.id);

    return requirement;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRequirements();
  }, [loadRequirements]);

  useEffect(() => {
    if (!runningRequirementIdsKey) {
      return;
    }

    const requirementIds = runningRequirementIdsKey.split(",");

    const interval = window.setInterval(() => {
      void pollRunningRequirementGenerations(requirementIds).catch((err: unknown) => {
        console.error("Failed to poll business story generation status", err);
      });
    }, GENERATION_POLL_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [pollRunningRequirementGenerations, runningRequirementIdsKey]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <FieldMetaTitle fieldMeta={rawUserRequirementsField} />
        </div>
        <Button asChild variant="outline">
          <Link href={`/projects/${projectId}`}>返回工作台</Link>
        </Button>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <FieldMetaSectionTitle fieldMeta={newUserRequirementField} />
          </CardHeader>
          <CardContent>
            <RequirementEditor
              compact
              title={newUserRequirementField.chineseName}
              hideLabel
              submitButton="icon"
              disabled={hasRunningRequirement}
              disabledMessage={hasRunningRequirement ? "已有需求正在更新，请等待完成后再提交新的用户需求" : undefined}
              onSave={handleSaveRequirement}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <FieldMetaSectionTitle fieldMeta={requirementHistoryField} />
          </CardHeader>
          <CardContent>
            {loading ? <LoadingState label="正在加载需求..." /> : null}
            {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadRequirements} /> : null}
            {!loading && !error ? (
              <RequirementList
                requirements={requirements}
                onRetryBusinessStoryGeneration={handleRetryBusinessStoryGeneration}
              />
            ) : null}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(requirementToRetry)}
        title="确认重试更新业务需求故事？"
        description="确认后将基于当前用户需求重新更新业务需求故事，已有业务需求故事不会被覆盖。"
        confirmText="确认重试"
        cancelText="取消"
        onConfirm={handleConfirmRetryBusinessStoryGeneration}
        onOpenChange={(open) => {
          if (!open) {
            setRequirementToRetry(null);
          }
        }}
      />
    </div>
  );
}

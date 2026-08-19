"use client";

import { useParams } from "next/navigation";
import { History } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { RequirementEditor } from "@/components/requirement/RequirementEditor";
import { RequirementList } from "@/components/requirement/RequirementList";
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

const requirementHistoryField = {
  chineseName: "用户需求历史",
  englishName: "requirement_history",
  meaning: "",
};

type RequirementFieldMeta = typeof requirementHistoryField;

function FieldMetaSectionTitle({ fieldMeta }: { fieldMeta: RequirementFieldMeta }) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <History className="size-5 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-lg font-semibold tracking-tight">{fieldMeta.chineseName}</h2>
      </div>
      {fieldMeta.meaning ? (
        <p className="text-sm leading-6 text-muted-foreground">{fieldMeta.meaning}</p>
      ) : null}
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
    <div className="space-y-6 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <Card className="lg:flex lg:min-h-[26rem] lg:flex-1 lg:flex-col">
        <CardHeader>
          <FieldMetaSectionTitle fieldMeta={requirementHistoryField} />
        </CardHeader>
        <CardContent className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-4">
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

      <div className="lg:shrink-0">
        <RequirementEditor
          compact
          hideLabel
          submitButton="icon"
          disabled={hasRunningRequirement}
          disabledMessage={hasRunningRequirement ? "已有需求正在更新，请等待完成后再提交新的用户需求" : undefined}
          onSave={handleSaveRequirement}
        />
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

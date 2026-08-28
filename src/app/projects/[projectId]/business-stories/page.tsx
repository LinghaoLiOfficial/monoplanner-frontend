"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { History, List, ListChecks, PanelTopOpen, X } from "lucide-react";

import { BusinessStoryCard } from "@/components/business-stories/BusinessStoryCard";
import { BusinessStoryList } from "@/components/business-stories/BusinessStoryList";
import { BusinessStoryPriorityBadge } from "@/components/business-stories/BusinessStoryPriorityBadge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import {
  deleteBusinessStory,
  executeBusinessStory,
  listBusinessStories,
  updateBusinessStory,
} from "@/lib/api/business-stories";
import { getGenerationRun } from "@/lib/api/generation-runs";
import {
  businessStoryImpactScopeLabels,
  businessStoryImpactScopeOptions,
  implementationScopeLabels,
} from "@/lib/design-asset-labels";
import { cn } from "@/lib/utils";
import type {
  BusinessRequirementStory,
  BusinessStoryPriority,
  AffectedLayer,
  UpdateBusinessStoryInput,
} from "@/lib/types/business-story";
import type { GenerationRun } from "@/lib/types/generation-run";

function getBusinessStoryErrorMessage(err: unknown, fallback: string) {
  if (err instanceof ApiError) {
    if (err.status === 400) {
      return "请先提交用户需求后再生成业务故事";
    }

    if (err.status === 503) {
      return "LLM 服务未配置，请检查后端 LLM 配置后重试";
    }

    return err.message;
  }

  return err instanceof Error ? err.message : fallback;
}

const successfulExecutionStatuses = new Set([
  "applied",
  "implemented",
  "verified",
  "done",
]);
const generationRunPollIntervalMs = 2000;
const generationRunMaxPolls = 180;
const completedGenerationRunStatuses = new Set(["completed", "succeeded", "success"]);
const failedGenerationRunStatuses = new Set(["failed", "error", "cancelled"]);

function sleep(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function formatHistoryDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildStoryVersionMap(stories: BusinessRequirementStory[]) {
  const orderedStories = [...stories].sort(
    (a, b) =>
      Date.parse(a.created_at) - Date.parse(b.created_at) ||
      Date.parse(a.updated_at) - Date.parse(b.updated_at)
  );

  return new Map(orderedStories.map((story, index) => [story.id, index + 1]));
}

function sortHistoryStories(stories: BusinessRequirementStory[]) {
  return [...stories].sort(
    (a, b) =>
      Date.parse(b.applied_at ?? b.updated_at) - Date.parse(a.applied_at ?? a.updated_at) ||
      Date.parse(b.created_at) - Date.parse(a.created_at)
  );
}

function isSuccessfullyExecutedStory(story: BusinessRequirementStory, run?: GenerationRun) {
  return successfulExecutionStatuses.has(story.status) || Boolean(run && completedGenerationRunStatuses.has(run.status));
}

function matchesImpactScopeFilter(
  story: BusinessRequirementStory,
  scopeFilter:
    | "frontend_only"
    | "backend_only"
    | "fullstack"
    | "non_code"
    | "ux_design"
    | "ui_design"
    | "frontend_implementation"
    | "api_contract"
    | "backend_implementation"
    | "database_models"
    | ""
) {
  if (!scopeFilter) {
    return true;
  }

  if (scopeFilter in implementationScopeLabels) {
    return story.implementation_scope === scopeFilter;
  }

  if (scopeFilter === "frontend_implementation") {
    return story.affected_layers.some((layer) =>
      ["frontend_implementation", "frontend_pages", "frontend_tools"].includes(layer)
    );
  }

  if (scopeFilter === "backend_implementation") {
    return story.affected_layers.some((layer) =>
      ["backend_implementation", "backend_services", "backend_tools"].includes(layer)
    );
  }

  if (scopeFilter === "database_models") {
    return story.affected_layers.some((layer) =>
      ["database_models", "database_model", "db_model"].includes(layer)
    );
  }

  return story.affected_layers.includes(scopeFilter as AffectedLayer);
}

function StoryIndexPanel({
  stories,
  activeStoryId,
  onStorySelect,
}: {
  stories: BusinessRequirementStory[];
  activeStoryId: string | null;
  onStorySelect: (storyId: string) => void;
}) {
  return (
    <Card className="lg:sticky lg:top-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="size-5 text-muted-foreground" aria-hidden="true" />
          需求列表
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-4">
        <div className="space-y-1.5">
          {stories.length > 0 ? (
            stories.map((story) => {
              const isActive = story.id === activeStoryId;

              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => onStorySelect(story.id)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border/60 hover:border-primary/50 hover:bg-muted/60"
                  }`}
                >
                  <span className="min-w-0 whitespace-normal break-words font-medium leading-5">
                    {story.requirement_name ?? story.title}
                  </span>
                  <span className="shrink-0">
                    <BusinessStoryPriorityBadge priority={story.priority} />
                  </span>
                  {isActive ? <span className="sr-only">当前需求</span> : null}
                </button>
              );
            })
          ) : (
            <p className="text-xs text-muted-foreground">暂无可索引的需求</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ExecutionHistoryCard({
  stories,
  loading,
  error,
  selectedStoryId,
  storyVersionById,
  onSelectStory,
  onClose,
  onRetry,
}: {
  stories: BusinessRequirementStory[];
  loading: boolean;
  error: string | null;
  selectedStoryId: string | null;
  storyVersionById: Map<string, number>;
  onSelectStory: (storyId: string) => void;
  onClose: () => void;
  onRetry: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [dragPointerId, setDragPointerId] = useState<number | null>(null);
  const [floatingPosition, setFloatingPosition] = useState<{ left: number; top: number } | null>(null);
  const selectedStory = stories.find((story) => story.id === selectedStoryId) ?? stories[0] ?? null;

  const constrainFloatingPosition = (left: number, top: number) => {
    const rect = cardRef.current?.getBoundingClientRect();
    const margin = 8;
    const maxLeft = Math.max(margin, window.innerWidth - (rect?.width ?? 0) - margin);
    const maxTop = Math.max(margin, window.innerHeight - (rect?.height ?? 0) - margin);

    return {
      left: Math.min(Math.max(left, margin), maxLeft),
      top: Math.min(Math.max(top, margin), maxTop),
    };
  };

  const handleDragStart = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button")) {
      return;
    }

    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    setFloatingPosition({ left: rect.left, top: rect.top });
    setDragPointerId(event.pointerId);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handleDragMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragPointerId !== event.pointerId) {
      return;
    }

    setFloatingPosition(
      constrainFloatingPosition(
        event.clientX - dragOffsetRef.current.x,
        event.clientY - dragOffsetRef.current.y
      )
    );
  };

  const handleDragEnd = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragPointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragPointerId(null);
  };

  return (
    <Card
      ref={cardRef}
      className={cn(
        "fixed z-40 flex h-[min(38rem,calc(100vh-6rem))] max-h-[calc(100vh-6rem)] w-[min(64rem,calc(100vw-2rem))] flex-col shadow-xl lg:h-[min(42rem,calc(100vh-8rem))] lg:max-h-[calc(100vh-8rem)] lg:w-[min(72rem,calc(100vw-4rem))]",
        floatingPosition ? "" : "left-1/2 top-20 -translate-x-1/2 lg:top-24"
      )}
      style={
        floatingPosition
          ? {
              left: floatingPosition.left,
              top: floatingPosition.top,
            }
          : undefined
      }
    >
      <CardHeader
        className={cn(
          "flex-row items-start justify-between gap-4 border-b border-border/60 select-none",
          dragPointerId === null ? "cursor-grab" : "cursor-grabbing"
        )}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
      >
        <div className="flex min-w-0 items-center gap-2">
          <History className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <CardTitle>历史执行记录</CardTitle>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          aria-label="关闭历史执行记录"
          title="关闭历史执行记录"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto p-4 lg:overflow-hidden">
        {loading ? (
          <div className="flex h-full min-h-48 items-center justify-center text-sm text-muted-foreground">
            正在加载历史执行记录...
          </div>
        ) : null}
        {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={onRetry} /> : null}
        {!loading && !error && stories.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">暂无成功执行记录</p>
        ) : null}
        {!loading && !error && stories.length > 0 ? (
          <div className="grid gap-4 lg:h-full lg:min-h-0 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-stretch">
            <section className="min-h-0 space-y-3 lg:overflow-hidden">
              <div className="flex items-center gap-2">
                <List className="size-5 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-base font-semibold">记录列表</h3>
              </div>
              <div className="space-y-2 lg:h-[calc(100%-2.5rem)] lg:overflow-y-auto lg:pr-2">
                {stories.map((story) => {
                  const active = selectedStory?.id === story.id;

                  return (
                    <button
                      key={story.id}
                      type="button"
                      onClick={() => onSelectStory(story.id)}
                      className={cn(
                        "w-full rounded-lg border border-border/70 bg-muted/20 p-3 text-left transition-colors hover:bg-muted",
                        active && "border-foreground bg-muted"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-md border border-border px-2 py-0.5 text-xs font-medium">
                          v{storyVersionById.get(story.id) ?? 1}
                        </span>
                      </div>
                      <div className="mt-3 text-xs leading-5 text-muted-foreground">
                        {formatHistoryDate(story.applied_at ?? story.updated_at)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="min-h-0 space-y-3 lg:overflow-hidden">
              <div className="flex items-center gap-2">
                <PanelTopOpen className="size-5 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-base font-semibold">需求详情</h3>
              </div>
              <div className="space-y-4 lg:h-[calc(100%-2.5rem)] lg:overflow-y-auto lg:pr-2">
                {selectedStory ? (
                  <BusinessStoryCard
                    story={selectedStory}
                    readOnly
                    onUpdateStory={async () => selectedStory}
                    onPriorityChange={async () => undefined}
                  />
                ) : (
                  <p className="text-sm leading-6 text-muted-foreground">暂无需求详情。</p>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

const allFilterValue = "all";

export default function ProjectBusinessStoriesPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [stories, setStories] = useState<BusinessRequirementStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storyToDelete, setStoryToDelete] = useState<BusinessRequirementStory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<BusinessStoryPriority | "">("");
  const [scopeFilter, setScopeFilter] = useState<
    (typeof businessStoryImpactScopeOptions)[number] | ""
  >("");
  const [keyword, setKeyword] = useState("");
  const [executingStoryId, setExecutingStoryId] = useState<string | null>(null);
  const [executionProgressByStoryId, setExecutionProgressByStoryId] = useState<
    Record<string, GenerationRun | undefined>
  >({});
  const [executeError, setExecuteError] = useState<string | null>(null);
  const [storyTargetId, setStoryTargetId] = useState<string | null>(null);
  const [storyScrollRequestKey, setStoryScrollRequestKey] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyStories, setHistoryStories] = useState<BusinessRequirementStory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [selectedHistoryStoryId, setSelectedHistoryStoryId] = useState<string | null>(null);
  const showCurrentStoryList = true;

  const currentStories = useMemo(
    () =>
      stories.filter(
        (story) =>
          story.is_current !== false &&
          !isSuccessfullyExecutedStory(story, executionProgressByStoryId[story.id])
      ),
    [executionProgressByStoryId, stories]
  );
  const filteredCurrentStories = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return currentStories.filter((story) => {
      if (priorityFilter && story.priority !== priorityFilter) {
        return false;
      }

      if (!matchesImpactScopeFilter(story, scopeFilter)) {
        return false;
      }

      if (!q) {
        return true;
      }

      return [story.title, story.user_story, story.execution_notes ?? ""].join("\n").toLowerCase().includes(q);
    });
  }, [currentStories, keyword, priorityFilter, scopeFilter]);
  const hasExecutingStory = useMemo(
    () =>
      executingStoryId !== null ||
      Object.values(executionProgressByStoryId).some(
        (run) =>
          run &&
          !completedGenerationRunStatuses.has(run.status) &&
          !failedGenerationRunStatuses.has(run.status)
      ),
    [executionProgressByStoryId, executingStoryId]
  );
  const storyVersionById = useMemo(
    () => buildStoryVersionMap(historyStories),
    [historyStories]
  );

  const handleSelectStory = (storyId: string) => {
    setStoryTargetId(storyId);
    setStoryScrollRequestKey((current) => current + 1);
  };

  const pollExecutionRun = async (storyId: string, initialRun: GenerationRun) => {
    let currentRun = initialRun;
    setExecutionProgressByStoryId((current) => ({
      ...current,
      [storyId]: currentRun,
    }));

    if (
      !completedGenerationRunStatuses.has(currentRun.status) &&
      !failedGenerationRunStatuses.has(currentRun.status)
    ) {
      setExecutingStoryId(storyId);
    }

    try {
      for (let attempt = 0; attempt < generationRunMaxPolls; attempt += 1) {
        if (completedGenerationRunStatuses.has(currentRun.status)) {
          break;
        }

        if (failedGenerationRunStatuses.has(currentRun.status)) {
          throw new Error(currentRun.error_message || currentRun.message || "生成分层变更集失败");
        }

        await sleep(generationRunPollIntervalMs);
        currentRun = await getGenerationRun(initialRun.id);
        setExecutionProgressByStoryId((current) => ({
          ...current,
          [storyId]: currentRun,
        }));
      }

      if (!completedGenerationRunStatuses.has(currentRun.status)) {
        throw new Error("生成分层变更集超时，请稍后刷新变更集列表");
      }

      return currentRun;
    } finally {
      setExecutingStoryId((current) => (current === storyId ? null : current));
    }
  };

  const restoreExecutionProgress = async (nextStories: BusinessRequirementStory[]) => {
    const storiesWithExecutionRuns = nextStories.filter(
      (story) => story.execution_generation_run_id
    );

    if (storiesWithExecutionRuns.length === 0) {
      return;
    }

    const restoredRuns = await Promise.all(
      storiesWithExecutionRuns.map(async (story) => {
        try {
          return {
            storyId: story.id,
            run: await getGenerationRun(story.execution_generation_run_id as string),
          };
        } catch {
          return null;
        }
      })
    );

    await Promise.all(
      restoredRuns
        .filter((item): item is { storyId: string; run: GenerationRun } => item !== null)
        .map(async ({ storyId, run }) => {
          try {
            await pollExecutionRun(storyId, run);
          } catch (err) {
            setExecuteError(err instanceof Error ? err.message : "恢复执行进度失败");
          }
        })
    );
  };

  const loadStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const nextStories = await listBusinessStories(projectId);
      setStories(nextStories);
      void restoreExecutionProgress(nextStories);
    } catch (err) {
      setError(getBusinessStoryErrorMessage(err, "加载敏捷业务需求池失败"));
    } finally {
      setLoading(false);
    }
  };

  const replaceStory = (updatedStory: BusinessRequirementStory) => {
    setStories((current) => current.map((story) => (story.id === updatedStory.id ? updatedStory : story)));
  };

  const handlePriorityChange = async (storyId: string, priority: BusinessStoryPriority) => {
    replaceStory(await updateBusinessStory(storyId, { priority }));
  };

  const handleUpdateStory = async (storyId: string, input: UpdateBusinessStoryInput) => {
    const updatedStory = await updateBusinessStory(storyId, input);
    replaceStory(updatedStory);
    return updatedStory;
  };

  const handleOpenDelete = (story: BusinessRequirementStory) => {
    setStoryToDelete(story);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!storyToDelete || deleteLoading) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await deleteBusinessStory(storyToDelete.id);
      setStories((current) => current.filter((story) => story.id !== storyToDelete.id));
      setStoryToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "删除业务故事失败");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExecuteStory = async (story: BusinessRequirementStory) => {
    setExecutingStoryId(story.id);
    setExecuteError(null);
    try {
      const queuedRun = await executeBusinessStory(story.id);
      await pollExecutionRun(story.id, queuedRun);
      await loadStories();
      if (historyOpen) {
        await loadHistoryStories();
      }
    } catch (err) {
      setExecuteError(err instanceof Error ? err.message : "生成分层变更集失败");
    } finally {
      setExecutingStoryId(null);
    }
  };

  const loadHistoryStories = async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const allStories = await listBusinessStories(projectId, { include_history: true });
      const storiesWithExecutionRuns = await Promise.all(
        allStories.map(async (story) => {
          const knownRun = executionProgressByStoryId[story.id];
          if (knownRun || !story.execution_generation_run_id) {
            return { story, run: knownRun };
          }

          try {
            return {
              story,
              run: await getGenerationRun(story.execution_generation_run_id),
            };
          } catch {
            return { story, run: undefined };
          }
        })
      );
      const successfulHistoryStories = sortHistoryStories(
        storiesWithExecutionRuns
          .filter(({ story, run }) => isSuccessfullyExecutedStory(story, run))
          .map(({ story }) => story)
      );
      setHistoryStories(successfulHistoryStories);
      setSelectedHistoryStoryId((current) =>
        current && successfulHistoryStories.some((story) => story.id === current)
          ? current
          : successfulHistoryStories[0]?.id ?? null
      );
    } catch (err) {
      setHistoryError(getBusinessStoryErrorMessage(err, "加载历史执行记录失败"));
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleToggleHistory = () => {
    const nextOpen = !historyOpen;
    setHistoryOpen(nextOpen);
    if (nextOpen && !historyLoading) {
      void loadHistoryStories();
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStories();
    }, 0);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="relative space-y-6 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <div className="space-y-4 lg:min-h-0 lg:flex-1 lg:flex lg:flex-col">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute right-0 top-0 z-10"
          aria-expanded={historyOpen}
          onClick={handleToggleHistory}
        >
          <History className="size-4" aria-hidden="true" />
          历史执行记录
        </Button>
        <div className="flex flex-col gap-1 pt-12 md:flex-row md:flex-wrap md:items-start md:gap-4 md:pt-0 md:pr-44">
          <label className="flex w-fit max-w-full flex-col gap-1.5 text-xs font-medium text-muted-foreground">
            <span>优先级</span>
            <Select
              value={priorityFilter || allFilterValue}
              onValueChange={(value) => {
                setPriorityFilter(value === allFilterValue ? "" : (value as BusinessStoryPriority));
              }}
            >
              <SelectTrigger className="h-8 w-52 rounded-xl border-border px-2 py-1 font-normal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allFilterValue}>全部</SelectItem>
                <SelectItem value="p1_must">P1</SelectItem>
                <SelectItem value="p2_should">P2</SelectItem>
                <SelectItem value="p3_could">P3</SelectItem>
                <SelectItem value="p4_wont">P4</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="flex w-fit max-w-full flex-col gap-1.5 text-xs font-medium text-muted-foreground">
            <span>影响范围</span>
              <Select
              value={scopeFilter || allFilterValue}
              onValueChange={(value) => {
                setScopeFilter(
                  value === allFilterValue
                    ? ""
                    : (value as (typeof businessStoryImpactScopeOptions)[number])
                );
              }}
            >
              <SelectTrigger className="h-8 w-52 rounded-xl border-border px-2 py-1 font-normal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allFilterValue}>全部</SelectItem>
                {businessStoryImpactScopeOptions.map((value) => (
                  <SelectItem key={value} value={value}>
                    {businessStoryImpactScopeLabels[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="flex w-fit max-w-full flex-col gap-1.5 text-xs font-medium text-muted-foreground">
            <span>关键词</span>
            <Input
              className="h-8 w-80 rounded-xl px-2 py-1 font-normal"
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
              }}
              placeholder="搜索标题、用户故事"
            />
          </label>
        </div>
        <div className="grid gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-stretch">
          <StoryIndexPanel
            stories={filteredCurrentStories}
            activeStoryId={storyTargetId}
            onStorySelect={handleSelectStory}
          />
          <div className="min-w-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
            <Card className="lg:flex lg:h-full lg:min-h-0 lg:flex-1 lg:flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PanelTopOpen className="size-5 text-muted-foreground" aria-hidden="true" />
                  需求详情
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-4">
                {executeError ? <ErrorState title="执行失败" message={executeError} /> : null}
                {loading ? <LoadingState label="正在加载敏捷业务需求池..." /> : null}
                {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadStories} /> : null}
                {showCurrentStoryList && !loading && !error ? (
                  <BusinessStoryList
                    stories={filteredCurrentStories}
                    targetStoryId={storyTargetId}
                    scrollRequestKey={storyScrollRequestKey}
                    onUpdateStory={handleUpdateStory}
                    onPriorityChange={handlePriorityChange}
                    onExecuteStory={handleExecuteStory}
                    executingStoryId={executingStoryId}
                    hasExecutingStory={hasExecutingStory}
                    executionProgressByStoryId={executionProgressByStoryId}
                    failedExecutionStatuses={[...failedGenerationRunStatuses]}
                    onDeleteStory={handleOpenDelete}
                  />
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(storyToDelete)}
        title="确认删除业务故事？"
        description={`删除后，“${storyToDelete?.title ?? "该业务故事"}”将从当前列表中移除，此操作不可撤销`}
        confirmText="确认删除"
        cancelText="取消"
        loading={deleteLoading}
        destructive
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onOpenChange={(open) => {
          if (!open) {
            setStoryToDelete(null);
            setDeleteError(null);
          }
        }}
      />
      {historyOpen && typeof document !== "undefined"
        ? createPortal(
            <ExecutionHistoryCard
              stories={historyStories}
              loading={historyLoading}
              error={historyError}
              selectedStoryId={selectedHistoryStoryId}
              storyVersionById={storyVersionById}
              onSelectStory={setSelectedHistoryStoryId}
              onClose={() => setHistoryOpen(false)}
              onRetry={() => {
                void loadHistoryStories();
              }}
            />,
            document.body
          )
        : null}
    </div>
  );
}

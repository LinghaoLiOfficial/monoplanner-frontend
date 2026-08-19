"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Archive, ChartColumn, CircleDot, Flame, ListChecks, PanelTopOpen, Sparkles } from "lucide-react";

import { BusinessStoryList } from "@/components/business-stories/BusinessStoryList";
import { BusinessStoryPriorityBadge, priorityBadgeLabels } from "@/components/business-stories/BusinessStoryPriorityBadge";
import { statusLabels } from "@/components/business-stories/BusinessStoryStatusBadge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import {
  deleteBusinessStory,
  executeBusinessStory,
  listBusinessStories,
  updateBusinessStory,
} from "@/lib/api/business-stories";
import { implementationScopeLabels } from "@/lib/design-asset-labels";
import type { LucideIcon } from "lucide-react";
import type {
  BusinessRequirementStory,
  BusinessStoryPriority,
  BusinessStoryStatus,
  ImplementationScope,
  UpdateBusinessStoryInput,
} from "@/lib/types/business-story";

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

function sortStories(stories: BusinessRequirementStory[]) {
  return [...stories].sort(
    (a, b) =>
      Number(Boolean(b.is_current)) - Number(Boolean(a.is_current)) ||
      (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
      Date.parse(b.updated_at) - Date.parse(a.updated_at)
  );
}

function sortStoriesByPriority(stories: BusinessRequirementStory[]) {
  return [...stories].sort(
    (a, b) =>
      priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority) ||
      Number(Boolean(b.is_current)) - Number(Boolean(a.is_current)) ||
      (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
      Date.parse(b.updated_at) - Date.parse(a.updated_at)
  );
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

const priorityOrder: BusinessStoryPriority[] = ["p1_must", "p2_should", "p3_could", "p4_wont"];

const priorityTileStyles: Record<BusinessStoryPriority, { className: string; icon: LucideIcon; note: string }> = {
  p1_must: {
    className: "border-red-200 text-red-700 dark:border-red-900/60 dark:text-red-300",
    icon: Flame,
    note: "必须完成",
  },
  p2_should: {
    className: "border-amber-200 text-amber-700 dark:border-amber-900/60 dark:text-amber-300",
    icon: Sparkles,
    note: "应该完成",
  },
  p3_could: {
    className: "border-sky-200 text-sky-700 dark:border-sky-900/60 dark:text-sky-300",
    icon: CircleDot,
    note: "可以完成",
  },
  p4_wont: {
    className: "border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400",
    icon: Archive,
    note: "本阶段不做",
  },
};

function PrioritySummaryCard({ stories }: { stories: BusinessRequirementStory[] }) {
  const tiles = [
    {
      key: "total",
      label: "总数",
      count: stories.length,
      className: "border-primary/20 text-primary",
      icon: ChartColumn,
      note: "当前有效故事",
    },
    ...priorityOrder.map((priority) => ({
      key: priority,
      label: priorityBadgeLabels[priority],
      count: stories.filter((story) => story.priority === priority).length,
      ...priorityTileStyles[priority],
    })),
  ];

  return (
    <Card className="lg:flex lg:min-h-0 lg:flex-col">
      <CardContent className="flex flex-wrap gap-2 !p-4">
        {tiles.map((tile) => (
          <div
            key={tile.key}
            className={`relative flex h-22 w-32 flex-none flex-col justify-between rounded-2xl border bg-[repeating-linear-gradient(135deg,transparent_0,transparent_16px,hsl(var(--muted))_17px,hsl(var(--muted))_18px)] bg-background p-2 ${tile.className}`}
          >
            <div className="text-xs font-bold text-current/70">{tile.label}</div>
            <tile.icon className="absolute right-2 top-[45%] size-5 -translate-y-1/2 stroke-[2.5]" aria-hidden="true" />
            <div className="-translate-y-1">
              <div className="text-3xl font-semibold leading-none tracking-normal tabular-nums">{tile.count}</div>
              <div className="mt-1 truncate text-[11px] font-medium text-current/65">{tile.note}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function ProjectBusinessStoriesPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const projectId = params.projectId;
  const [stories, setStories] = useState<BusinessRequirementStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storyToDelete, setStoryToDelete] = useState<BusinessRequirementStory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<BusinessStoryPriority | "">("");
  const [statusFilter, setStatusFilter] = useState<BusinessStoryStatus | "">("");
  const [scopeFilter, setScopeFilter] = useState<ImplementationScope | "">("");
  const [keyword, setKeyword] = useState("");
  const [executingStoryId, setExecutingStoryId] = useState<string | null>(null);
  const [executeError, setExecuteError] = useState<string | null>(null);
  const [storyTargetId, setStoryTargetId] = useState<string | null>(null);
  const [storyScrollRequestKey, setStoryScrollRequestKey] = useState(0);
  const showCurrentStoryList = true;

  const currentStories = useMemo(
    () => sortStories(stories.filter((story) => story.is_current !== false)),
    [stories]
  );
  const indexedStories = useMemo(() => sortStoriesByPriority(currentStories), [currentStories]);
  const filteredCurrentStories = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return sortStoriesByPriority(
      currentStories.filter((story) => {
        if (priorityFilter && story.priority !== priorityFilter) {
          return false;
        }

        if (statusFilter && story.status !== statusFilter) {
          return false;
        }

        if (scopeFilter && story.implementation_scope !== scopeFilter) {
          return false;
        }

        if (!q) {
          return true;
        }

        return [story.title, story.user_story, story.execution_notes ?? ""].join("\n").toLowerCase().includes(q);
      })
    );
  }, [currentStories, keyword, priorityFilter, scopeFilter, statusFilter]);

  const handleSelectStory = (storyId: string) => {
    setPriorityFilter("");
    setStatusFilter("");
    setScopeFilter("");
    setKeyword("");
    setStoryTargetId(storyId);
    setStoryScrollRequestKey((current) => current + 1);
  };

  const loadStories = async () => {
    setLoading(true);
    setError(null);
    try {
      setStories(sortStories(await listBusinessStories(projectId)));
    } catch (err) {
      setError(getBusinessStoryErrorMessage(err, "加载敏捷业务需求池失败"));
    } finally {
      setLoading(false);
    }
  };

  const replaceStory = (updatedStory: BusinessRequirementStory) => {
    setStories((current) =>
      sortStories(current.map((story) => (story.id === updatedStory.id ? updatedStory : story)))
    );
  };

  const handlePriorityChange = async (storyId: string, priority: BusinessStoryPriority) => {
    replaceStory(await updateBusinessStory(storyId, { priority }));
  };

  const handleStatusChange = async (storyId: string, status: BusinessStoryStatus) => {
    replaceStory(await updateBusinessStory(storyId, { status }));
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
      const changeSet = await executeBusinessStory(story.id);
      router.push(`/projects/${projectId}/change-sets?selected=${changeSet.id}`);
    } catch (err) {
      setExecuteError(err instanceof Error ? err.message : "生成分层变更集失败");
    } finally {
      setExecutingStoryId(null);
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
    <div className="space-y-6 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <div className="space-y-4 lg:min-h-0 lg:flex-1 lg:flex lg:flex-col">
        <PrioritySummaryCard stories={currentStories} />
        <div className="grid gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-stretch">
          <StoryIndexPanel
            stories={indexedStories}
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
                <div className="grid gap-3 md:grid-cols-4">
                  <label className="space-y-1 text-xs font-medium text-muted-foreground">
                    优先级
                    <select
                      value={priorityFilter}
                      onChange={(event) => {
                        setPriorityFilter(event.target.value as BusinessStoryPriority | "");
                      }}
                      className="h-10 w-full rounded-2xl border border-border bg-background px-3 text-sm text-foreground"
                    >
                      <option value="">全部</option>
                      <option value="p1_must">P1</option>
                      <option value="p2_should">P2</option>
                      <option value="p3_could">P3</option>
                      <option value="p4_wont">P4</option>
                    </select>
                  </label>
                  <label className="space-y-1 text-xs font-medium text-muted-foreground">
                    状态
                    <select
                      value={statusFilter}
                      onChange={(event) => {
                        setStatusFilter(event.target.value as BusinessStoryStatus | "");
                      }}
                      className="h-10 w-full rounded-2xl border border-border bg-background px-3 text-sm text-foreground"
                    >
                      <option value="">全部</option>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-xs font-medium text-muted-foreground">
                    实现范围
                    <select
                      value={scopeFilter}
                      onChange={(event) => {
                        setScopeFilter(event.target.value as ImplementationScope | "");
                      }}
                      className="h-10 w-full rounded-2xl border border-border bg-background px-3 text-sm text-foreground"
                    >
                      <option value="">全部</option>
                      {Object.entries(implementationScopeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-xs font-medium text-muted-foreground">
                    关键词
                    <Input
                      value={keyword}
                      onChange={(event) => {
                        setKeyword(event.target.value);
                      }}
                      placeholder="搜索标题、用户故事"
                    />
                  </label>
                </div>
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
                    onStatusChange={handleStatusChange}
                    onExecuteStory={handleExecuteStory}
                    executingStoryId={executingStoryId}
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
    </div>
  );
}

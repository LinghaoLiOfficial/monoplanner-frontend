"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  BUSINESS_STORY_PAGE_SIZE,
  BusinessStoryList,
} from "@/components/business-stories/BusinessStoryList";
import { BusinessStoryPriorityBadge } from "@/components/business-stories/BusinessStoryPriorityBadge";
import { statusLabels } from "@/components/business-stories/BusinessStoryStatusBadge";
import {
  FieldDefinitionHeading,
} from "@/components/business-stories/BusinessRequirementFieldDefinition";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import {
  deleteBusinessStory,
  executeBusinessStory,
  listBusinessStories,
  updateBusinessStory,
} from "@/lib/api/business-stories";
import { businessRequirementFieldDefinitionByKey } from "@/lib/business-story-contract";
import { implementationScopeLabels } from "@/lib/design-asset-labels";
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
      return "请先提交用户需求后再生成业务需求故事";
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
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || Date.parse(a.created_at) - Date.parse(b.created_at)
  );
}

const priorityOptions: BusinessStoryPriority[] = ["p1_must", "p2_should", "p3_could", "p4_wont"];
const statusOptions: BusinessStoryStatus[] = [
  "draft",
  "ready",
  "selected",
  "applied",
  "implemented",
  "verified",
  "in_progress",
  "done",
  "deferred",
];

function BusinessStoryOverview({
  stories,
  onSelectStory,
}: {
  stories: BusinessRequirementStory[];
  onSelectStory: (storyId: string) => void;
}) {
  const priorityCounts = useMemo(
    () =>
      priorityOptions.map((priority) => ({
        priority,
        count: stories.filter((story) => story.priority === priority).length,
      })),
    [stories]
  );
  const statusCounts = useMemo(
    () =>
      statusOptions
        .map((status) => ({
          status,
          count: stories.filter((story) => story.status === status).length,
        }))
        .filter((item) => item.count > 0),
    [stories]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-normal">
          <FieldDefinitionHeading
            definition={businessRequirementFieldDefinitionByKey.requirement_overview}
            titleClassName="text-base font-semibold"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <div className="rounded-lg bg-muted/60 px-3 py-2">
            <div className="text-xs text-muted-foreground">故事总数</div>
            <div className="text-lg font-semibold">{stories.length}</div>
          </div>
          <div className="rounded-lg bg-muted/60 px-3 py-2">
            <div className="text-xs text-muted-foreground">当前状态</div>
            <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
              {statusCounts.length > 0
                ? statusCounts.map((item) => (
                    <span key={item.status}>
                      {statusLabels[item.status]} {item.count}
                    </span>
                  ))
                : "暂无状态"}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {priorityCounts.map((item) => (
            <span
              key={item.priority}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
            >
              <BusinessStoryPriorityBadge priority={item.priority} />
              {item.count}
            </span>
          ))}
        </div>
        {stories.length === 0 ? (
          <p className="text-sm leading-7 text-muted-foreground">当前项目还没有业务需求故事</p>
        ) : null}
        {stories.map((story) => (
          <button
            key={story.id}
            type="button"
            onClick={() => onSelectStory(story.id)}
            className="w-full rounded-2xl border border-border/60 bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-muted"
          >
            <span className="flex items-start justify-between gap-3">
              <span className="min-w-0 font-medium leading-6">
                {story.requirement_name ?? story.title}
              </span>
              <BusinessStoryPriorityBadge priority={story.priority} />
            </span>
          </button>
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
  const [targetStoryId, setTargetStoryId] = useState<string | null>(null);
  const [storyScrollRequestKey, setStoryScrollRequestKey] = useState(0);
  const [storyPage, setStoryPage] = useState(1);
  const [priorityFilter, setPriorityFilter] = useState<BusinessStoryPriority | "">("");
  const [statusFilter, setStatusFilter] = useState<BusinessStoryStatus | "">("");
  const [scopeFilter, setScopeFilter] = useState<ImplementationScope | "">("");
  const [keyword, setKeyword] = useState("");
  const [executingStoryId, setExecutingStoryId] = useState<string | null>(null);
  const [executeError, setExecuteError] = useState<string | null>(null);

  const filteredStories = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return stories.filter((story) => {
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

      return [story.title, story.user_story, story.execution_notes ?? ""]
        .join("\n")
        .toLowerCase()
        .includes(q);
    });
  }, [keyword, priorityFilter, scopeFilter, statusFilter, stories]);

  const loadStories = async () => {
    setLoading(true);
    setError(null);
    try {
      setStories(sortStories(await listBusinessStories(projectId)));
    } catch (err) {
      setError(getBusinessStoryErrorMessage(err, "加载业务需求故事失败"));
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
    const updatedStory = await updateBusinessStory(storyId, { priority });
    replaceStory(updatedStory);
  };

  const handleStatusChange = async (storyId: string, status: BusinessStoryStatus) => {
    const updatedStory = await updateBusinessStory(storyId, { status });
    replaceStory(updatedStory);
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

  const handleSelectStory = (storyId: string) => {
    const storyIndex = filteredStories.findIndex((story) => story.id === storyId);
    if (storyIndex !== -1) {
      setStoryPage(Math.floor(storyIndex / BUSINESS_STORY_PAGE_SIZE) + 1);
    }

    setTargetStoryId(storyId);
    setStoryScrollRequestKey((current) => current + 1);
  };

  const handleConfirmDelete = async () => {
    if (!storyToDelete || deleteLoading) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await deleteBusinessStory(storyToDelete.id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "删除业务需求故事失败");
      setDeleteLoading(false);
      return;
    }

    setStories((current) => current.filter((story) => story.id !== storyToDelete.id));
    setStoryToDelete(null);
    setDeleteLoading(false);
  };

  const handleExecuteStory = async (story: BusinessRequirementStory) => {
    setExecutingStoryId(story.id);
    setExecuteError(null);
    try {
      const changeSet = await executeBusinessStory(story.id);
      router.push(`/projects/${projectId}/change-sets?selected=${changeSet.id}`);
    } catch (err) {
      setExecuteError(err instanceof Error ? err.message : "执行业务需求切片失败");
    } finally {
      setExecutingStoryId(null);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <FieldDefinitionHeading
            definition={businessRequirementFieldDefinitionByKey.agile_business_requirements}
            titleClassName="text-3xl font-semibold tracking-tight"
          />
        </div>
        <Button asChild variant="outline">
          <Link href={`/projects/${projectId}`}>返回工作台</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <BusinessStoryOverview
          stories={stories}
          onSelectStory={handleSelectStory}
        />

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="leading-normal">
                  <FieldDefinitionHeading
                    definition={businessRequirementFieldDefinitionByKey.business_requirement_pool}
                    titleClassName="text-base font-semibold"
                  />
                </CardTitle>
              </div>
            <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => void loadStories()}>
                  刷新
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-4">
              <label className="space-y-1 text-xs font-medium text-muted-foreground">
                优先级
                <select
                  value={priorityFilter}
                  onChange={(event) => {
                    setPriorityFilter(event.target.value as BusinessStoryPriority | "");
                    setStoryPage(1);
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
                    setStoryPage(1);
                  }}
                  className="h-10 w-full rounded-2xl border border-border bg-background px-3 text-sm text-foreground"
                >
                  <option value="">全部</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs font-medium text-muted-foreground">
                实现范围
                <select
                  value={scopeFilter}
                  onChange={(event) => {
                    setScopeFilter(event.target.value as ImplementationScope | "");
                    setStoryPage(1);
                  }}
                  className="h-10 w-full rounded-2xl border border-border bg-background px-3 text-sm text-foreground"
                >
                  <option value="">全部</option>
                  {Object.entries(implementationScopeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs font-medium text-muted-foreground">
                关键词
                <Input
                  value={keyword}
                  onChange={(event) => {
                    setKeyword(event.target.value);
                    setStoryPage(1);
                  }}
                  placeholder="搜索标题、用户故事"
                />
              </label>
            </div>
            {executeError ? <ErrorState title="执行失败" message={executeError} /> : null}
            {loading ? <LoadingState label="正在加载业务需求故事..." /> : null}
            {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadStories} /> : null}
            {!loading && !error ? (
              <BusinessStoryList
                stories={filteredStories}
                page={storyPage}
                targetStoryId={targetStoryId}
                scrollRequestKey={storyScrollRequestKey}
                onPageChange={setStoryPage}
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

      <ConfirmDialog
        open={Boolean(storyToDelete)}
        title="确认删除业务需求故事？"
        description={`删除后，“${storyToDelete?.title ?? "该业务需求故事"}”将从业务需求故事列表中移除，此操作不可撤销`}
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

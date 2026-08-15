"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BusinessStoryList } from "@/components/business-stories/BusinessStoryList";
import { BusinessStoryPriorityBadge } from "@/components/business-stories/BusinessStoryPriorityBadge";
import { BusinessStoryStatusBadge, statusLabels } from "@/components/business-stories/BusinessStoryStatusBadge";
import { FieldDefinitionHeading } from "@/components/business-stories/BusinessRequirementFieldDefinition";
import { AffectedLayerBadge } from "@/components/business-stories/AffectedLayerBadge";
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

function StorySummaryCard({
  title,
  stories,
}: {
  title: string;
  stories: BusinessRequirementStory[];
}) {
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
        <CardTitle>{title}</CardTitle>
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
  const [storyPage, setStoryPage] = useState(1);
  const [priorityFilter, setPriorityFilter] = useState<BusinessStoryPriority | "">("");
  const [statusFilter, setStatusFilter] = useState<BusinessStoryStatus | "">("");
  const [scopeFilter, setScopeFilter] = useState<ImplementationScope | "">("");
  const [keyword, setKeyword] = useState("");
  const [executingStoryId, setExecutingStoryId] = useState<string | null>(null);
  const [executeError, setExecuteError] = useState<string | null>(null);

  const currentStories = useMemo(
    () => sortStories(stories.filter((story) => story.is_current !== false)),
    [stories]
  );
  const historicalStories = useMemo(
    () => sortStories(stories.filter((story) => story.is_current === false)),
    [stories]
  );

  const filteredCurrentStories = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return currentStories.filter((story) => {
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
    });
  }, [currentStories, keyword, priorityFilter, scopeFilter, statusFilter]);

  const loadStories = async () => {
    setLoading(true);
    setError(null);
    try {
      setStories(sortStories(await listBusinessStories(projectId)));
    } catch (err) {
      setError(getBusinessStoryErrorMessage(err, "加载业务故事池失败"));
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <FieldDefinitionHeading
            definition={businessRequirementFieldDefinitionByKey.agile_business_requirements}
            titleClassName="text-3xl font-semibold tracking-tight"
          />
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            当前业务故事池只展示有效故事；历史记录单独保留，用于追踪原始需求到已应用变更集的演进。
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/projects/${projectId}`}>返回</Link>
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <StorySummaryCard title="当前有效故事池" stories={currentStories} />
        <StorySummaryCard title="历史追踪" stories={historicalStories} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>当前有效故事池</CardTitle>
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
                    setStoryPage(1);
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
                    setStoryPage(1);
                  }}
                  placeholder="搜索标题、用户故事"
                />
              </label>
            </div>
            {executeError ? <ErrorState title="执行失败" message={executeError} /> : null}
            {loading ? <LoadingState label="正在加载业务故事池..." /> : null}
            {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadStories} /> : null}
            {!loading && !error ? (
              <BusinessStoryList
                stories={filteredCurrentStories}
                page={storyPage}
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

        <Card>
          <CardHeader>
            <CardTitle>历史追踪</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {historicalStories.length === 0 ? (
              <p className="text-sm leading-7 text-muted-foreground">暂无历史故事记录</p>
            ) : (
              historicalStories.map((story) => (
                <section key={story.id} className="rounded-2xl border border-border/60 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{story.requirement_name ?? story.title}</span>
                    <BusinessStoryPriorityBadge priority={story.priority} />
                    <BusinessStoryStatusBadge status={story.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {story.affected_layers.map((layer) => (
                      <AffectedLayerBadge key={layer} layer={layer} />
                    ))}
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{story.user_story}</p>
                  {story.applied_at ? (
                    <p className="mt-2 text-xs text-muted-foreground">已应用时间：{new Date(story.applied_at).toLocaleString("zh-CN")}</p>
                  ) : null}
                </section>
              ))
            )}
          </CardContent>
        </Card>
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

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Power, PowerOff } from "lucide-react";

import {
  BUSINESS_STORY_PAGE_SIZE,
  BusinessStoryList,
} from "@/components/business-stories/BusinessStoryList";
import { BusinessStoryPriorityBadge } from "@/components/business-stories/BusinessStoryPriorityBadge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ProjectWorkspaceNav } from "@/components/project/ProjectWorkspaceNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError } from "@/lib/api/client";
import {
  deleteBusinessStory,
  listBusinessStories,
  updateBusinessStory,
} from "@/lib/api/business-stories";
import type {
  BusinessRequirementStory,
  BusinessStoryPriority,
  BusinessStoryStatus,
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
    (a, b) => a.sort_order - b.sort_order || Date.parse(a.created_at) - Date.parse(b.created_at)
  );
}

function BusinessStoryOverview({
  stories,
  onSelectStory,
}: {
  stories: BusinessRequirementStory[];
  onSelectStory: (storyId: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>需求总览</CardTitle>
        <CardDescription>按当前顺序查看全部业务需求故事标题</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
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
              <span className="min-w-0 font-medium leading-6">{story.title}</span>
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
  const [autoModeEnabled, setAutoModeEnabled] = useState(false);
  const [confirmAutoModeOpen, setConfirmAutoModeOpen] = useState(false);

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
    const storyIndex = stories.findIndex((story) => story.id === storyId);
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

  const handleAutoModeClick = () => {
    if (autoModeEnabled) {
      setAutoModeEnabled(false);
      return;
    }

    setConfirmAutoModeOpen(true);
  };

  const handleConfirmAutoMode = () => {
    setAutoModeEnabled(true);
    setConfirmAutoModeOpen(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="space-y-6 pb-12">
      <ProjectWorkspaceNav projectId={projectId} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">敏捷业务需求</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            将用户需求拆解为按优先级组织的垂直业务需求故事。
          </p>
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
                <CardTitle>业务需求池</CardTitle>
                <CardDescription>查看由用户需求拆解出的业务故事，并维护优先级与交付状态</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={autoModeEnabled ? "destructive" : "outline"}
                  onClick={handleAutoModeClick}
                >
                  {autoModeEnabled ? <PowerOff className="size-4" /> : <Power className="size-4" />}
                  {autoModeEnabled ? "自动模式已启用" : "启用自动模式"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? <LoadingState label="正在加载业务需求故事..." /> : null}
            {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadStories} /> : null}
            {!loading && !error ? (
              <BusinessStoryList
                stories={stories}
                page={storyPage}
                targetStoryId={targetStoryId}
                scrollRequestKey={storyScrollRequestKey}
                onPageChange={setStoryPage}
                onUpdateStory={handleUpdateStory}
                onPriorityChange={handlePriorityChange}
                onStatusChange={handleStatusChange}
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

      <ConfirmDialog
        open={confirmAutoModeOpen}
        title="确认启用自动模式？"
        description="启用后，业务需求池将进入自动模式。当前版本仅在前端记录该模式状态，不会立即改动已有业务需求故事。"
        confirmText="确认启用"
        cancelText="取消"
        onConfirm={handleConfirmAutoMode}
        onOpenChange={setConfirmAutoModeOpen}
      />
    </div>
  );
}

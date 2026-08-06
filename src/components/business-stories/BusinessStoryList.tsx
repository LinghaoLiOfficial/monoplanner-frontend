"use client";

import { ListChecks } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import { BusinessStoryCard } from "@/components/business-stories/BusinessStoryCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/ui/pagination";
import type {
  BusinessRequirementStory,
  BusinessStoryPriority,
  BusinessStoryStatus,
  UpdateBusinessStoryInput,
} from "@/lib/types/business-story";

export const BUSINESS_STORY_PAGE_SIZE = 5;

export function BusinessStoryList({
  stories,
  page,
  targetStoryId,
  scrollRequestKey,
  onPageChange,
  onUpdateStory,
  onPriorityChange,
  onStatusChange,
  onExecuteStory,
  executingStoryId,
  onDeleteStory,
}: {
  stories: BusinessRequirementStory[];
  page: number;
  targetStoryId?: string | null;
  scrollRequestKey?: number;
  onPageChange: (page: number) => void;
  onUpdateStory: (storyId: string, input: UpdateBusinessStoryInput) => Promise<BusinessRequirementStory>;
  onPriorityChange: (storyId: string, priority: BusinessStoryPriority) => Promise<void>;
  onStatusChange: (storyId: string, status: BusinessStoryStatus) => Promise<void>;
  onExecuteStory?: (story: BusinessRequirementStory) => void;
  executingStoryId?: string | null;
  onDeleteStory?: (story: BusinessRequirementStory) => void;
}) {
  const listScrollRef = useRef<HTMLDivElement | null>(null);
  const storyRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const totalPages = Math.ceil(stories.length / BUSINESS_STORY_PAGE_SIZE);
  const visiblePage = totalPages > 0 ? Math.min(page, totalPages) : 1;
  const pagedStories = useMemo(
    () =>
      stories.slice(
        (visiblePage - 1) * BUSINESS_STORY_PAGE_SIZE,
        visiblePage * BUSINESS_STORY_PAGE_SIZE
      ),
    [stories, visiblePage]
  );

  const handlePageChange = (nextPage: number) => {
    listScrollRef.current?.scrollTo({ top: 0 });
    onPageChange(nextPage);
  };

  useEffect(() => {
    if (!targetStoryId) {
      return;
    }

    const container = listScrollRef.current;
    const target = storyRefs.current[targetStoryId];
    if (!container || !target) {
      return;
    }

    const containerTop = container.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    const nextTop = container.scrollTop + targetTop - containerTop - 12;

    container.scrollTo({
      top: Math.max(0, nextTop),
      behavior: "smooth",
    });
  }, [pagedStories, scrollRequestKey, targetStoryId, visiblePage]);

  if (stories.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="当前项目还没有业务需求故事"
        description="从用户需求生成业务需求故事后，会在这里按优先级展示垂直业务切片"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div ref={listScrollRef} className="max-h-[calc(100vh-220px)] space-y-4 overflow-y-auto pr-2">
        {pagedStories.map((story) => (
          <div
            key={story.id}
            ref={(element) => {
              storyRefs.current[story.id] = element;
            }}
          >
            <BusinessStoryCard
              story={story}
              onUpdateStory={onUpdateStory}
              onPriorityChange={onPriorityChange}
              onStatusChange={onStatusChange}
              onExecute={onExecuteStory}
              executing={executingStoryId === story.id}
              onDelete={onDeleteStory}
            />
          </div>
        ))}
      </div>
      <Pagination page={visiblePage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}

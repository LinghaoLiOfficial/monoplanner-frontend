"use client";

import { ListChecks } from "lucide-react";
import { useEffect, useRef } from "react";

import { BusinessStoryCard } from "@/components/business-stories/BusinessStoryCard";
import { EmptyState } from "@/components/common/EmptyState";
import type {
  BusinessRequirementStory,
  BusinessStoryPriority,
  UpdateBusinessStoryInput,
} from "@/lib/types/business-story";
import type { GenerationRun } from "@/lib/types/generation-run";

export function BusinessStoryList({
  stories,
  targetStoryId,
  scrollRequestKey,
  onUpdateStory,
  onPriorityChange,
  onExecuteStory,
  executingStoryId,
  hasExecutingStory,
  executionProgressByStoryId,
  failedExecutionStatuses = [],
  onDeleteStory,
}: {
  stories: BusinessRequirementStory[];
  targetStoryId?: string | null;
  scrollRequestKey?: number;
  onUpdateStory: (storyId: string, input: UpdateBusinessStoryInput) => Promise<BusinessRequirementStory>;
  onPriorityChange: (storyId: string, priority: BusinessStoryPriority) => Promise<void>;
  onExecuteStory?: (story: BusinessRequirementStory) => void;
  executingStoryId?: string | null;
  hasExecutingStory?: boolean;
  executionProgressByStoryId?: Record<string, GenerationRun | undefined>;
  failedExecutionStatuses?: string[];
  onDeleteStory?: (story: BusinessRequirementStory) => void;
}) {
  const storyRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!targetStoryId) {
      return;
    }

    const target = storyRefs.current[targetStoryId];
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [scrollRequestKey, stories, targetStoryId]);

  if (stories.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="当前项目还没有敏捷业务需求"
        description="从原始需求生成业务故事后，会在这里按优先级展示当前有效敏捷业务需求池"
      />
    );
  }

  return (
    <div className="space-y-4">
      {stories.map((story) => (
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
            onExecute={onExecuteStory}
            executing={executingStoryId === story.id}
            executionBlocked={Boolean(hasExecutingStory && executingStoryId !== story.id)}
            executionFailed={failedExecutionStatuses.includes(
              executionProgressByStoryId?.[story.id]?.status ?? ""
            )}
            executionProgress={executionProgressByStoryId?.[story.id]}
            onDelete={onDeleteStory}
          />
        </div>
      ))}
    </div>
  );
}

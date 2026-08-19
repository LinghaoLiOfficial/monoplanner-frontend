"use client";

import { MessageSquareText, RotateCcw, Triangle } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  getRequirementProgressStatus,
  getRequirementProgressStatusLabel,
  stripTrailingProgressPunctuation,
} from "@/lib/requirement-progress";
import { cn } from "@/lib/utils";
import type {
  BusinessStoryGenerationProgress,
  Requirement,
  RequirementProgressStatus,
} from "@/lib/types/requirement";

const PAGE_SIZE = 5;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function summarize(text: string) {
  return text.length > 160 ? `${text.slice(0, 160)}...` : text;
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getStatusBadgeClassName(status: RequirementProgressStatus) {
  if (status === "success") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300";
  }

  if (status === "failed") {
    return "";
  }

  return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300";
}

function getGenerationMessage(
  requirement: Requirement,
  generation: BusinessStoryGenerationProgress | null | undefined,
  status: RequirementProgressStatus
) {
  const backendText = requirement.progress_text || requirement.progress_label || generation?.message;

  if (backendText) {
    return stripTrailingProgressPunctuation(backendText);
  }

  if (status === "failed") {
    const errorMessage = generation?.error_message || "请稍后重试";

    return stripTrailingProgressPunctuation(`更新失败：${errorMessage}`);
  }

  if (status === "success") {
    return "已完成业务需求故事更新";
  }

  return "正在更新业务需求故事";
}

function getProgressValue(generation: BusinessStoryGenerationProgress | null | undefined) {
  if (!generation) {
    return 0;
  }

  return clampProgress(generation.progress);
}

function RequirementGenerationProgress({
  requirement,
  status,
}: {
  requirement: Requirement;
  status: RequirementProgressStatus;
}) {
  const generation = requirement.business_story_generation;
  const progress = getProgressValue(generation);
  const isWarning = status === "failed";

  return (
    <div className="mt-4 border-t border-border/60 pt-4">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span
          className={cn(
            "leading-5",
            isWarning ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {getGenerationMessage(requirement, generation, status)}
        </span>
        <span className="shrink-0 tabular-nums text-muted-foreground">{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isWarning ? "bg-destructive" : status === "success" ? "bg-emerald-500" : "bg-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function canRetryRequirement(status: RequirementProgressStatus) {
  return status === "success" || status === "failed";
}

export function RequirementList({
  requirements,
  onRetryBusinessStoryGeneration,
}: {
  requirements: Requirement[];
  onRetryBusinessStoryGeneration?: (requirementId: string) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRequirementIds, setExpandedRequirementIds] = useState<Set<string>>(() => new Set());
  const totalPages = Math.ceil(requirements.length / PAGE_SIZE);
  const visiblePage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const pagedRequirements = useMemo(
    () => requirements.slice((visiblePage - 1) * PAGE_SIZE, visiblePage * PAGE_SIZE),
    [requirements, visiblePage]
  );

  const toggleRequirement = (requirementId: string) => {
    setExpandedRequirementIds((current) => {
      const next = new Set(current);

      if (next.has(requirementId)) {
        next.delete(requirementId);
      } else {
        next.add(requirementId);
      }

      return next;
    });
  };

  if (requirements.length === 0) {
    return (
      <EmptyState
        icon={MessageSquareText}
        title="暂无需求历史"
      />
    );
  }

  return (
    <div className="space-y-3">
      {pagedRequirements.map((requirement) => {
        const expanded = expandedRequirementIds.has(requirement.id);
        const status = getRequirementProgressStatus(requirement);
        const showRetryBusinessStoryGeneration = Boolean(onRetryBusinessStoryGeneration);
        const canRetryBusinessStoryGeneration =
          showRetryBusinessStoryGeneration && canRetryRequirement(status);

        return (
          <Card
            key={requirement.id}
            className={cn(
              "transition-colors hover:border-primary/50 hover:bg-muted/40 hover:shadow-sm"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={status === "failed" ? "destructive" : "outline"}
                    className={getStatusBadgeClassName(status)}
                  >
                    {getRequirementProgressStatusLabel(status)}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(requirement.created_at)}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {expanded ? requirement.raw_text : summarize(requirement.raw_text)}
              </p>
              <div className="mt-4 flex justify-end gap-2">
                {showRetryBusinessStoryGeneration ? (
                  <Button
                    type="button"
                    variant="default"
                    disabled={!canRetryBusinessStoryGeneration}
                    onClick={() => {
                      if (!canRetryBusinessStoryGeneration) {
                        return;
                      }

                      onRetryBusinessStoryGeneration?.(requirement.id);
                    }}
                    className="h-7 gap-1.5 px-3 text-xs"
                  >
                    <RotateCcw className="size-3" />
                    重试
                  </Button>
                ) : null}
                <Button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => toggleRequirement(requirement.id)}
                  className="h-7 gap-1.5 px-3 text-xs"
                >
                  <Triangle
                    className={cn("size-3 fill-current stroke-current", expanded ? "" : "rotate-180")}
                  />
                  {expanded ? "收起" : "展开"}
                </Button>
              </div>
              <RequirementGenerationProgress
                requirement={requirement}
                status={status}
              />
            </CardContent>
          </Card>
        );
      })}
      <Pagination page={visiblePage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}

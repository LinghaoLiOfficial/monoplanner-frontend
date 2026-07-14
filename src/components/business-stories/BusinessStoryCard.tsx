"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  BusinessStoryPriorityBadge,
  priorityBadgeLabels,
  priorityLabels,
} from "@/components/business-stories/BusinessStoryPriorityBadge";
import { BusinessStoryStatusBadge, statusLabels } from "@/components/business-stories/BusinessStoryStatusBadge";
import { InlineEditableList } from "@/components/business-stories/InlineEditableList";
import { InlineEditableText } from "@/components/business-stories/InlineEditableText";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  BusinessRequirementStory,
  BusinessStoryPriority,
  BusinessStoryStatus,
  DataRule,
  UpdateBusinessStoryInput,
} from "@/lib/types/business-story";

const priorities = Object.keys(priorityLabels) as BusinessStoryPriority[];
const statuses = Object.keys(statusLabels) as BusinessStoryStatus[];
const storyTextBlockClassName =
  "cursor-text rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm leading-7 text-muted-foreground transition-colors hover:bg-muted/50";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StorySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      {children}
    </section>
  );
}

function formatDataRulesForEditing(dataRules: DataRule[]): string {
  return dataRules
    .map((item) => (item.field ? `${item.field}：${item.rule}` : item.rule))
    .join("\n");
}

function parseDataRulesFromText(text: string): DataRule[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const colonIndex = line.indexOf(":");
      const chineseColonIndex = line.indexOf("：");
      const separatorIndex =
        colonIndex === -1
          ? chineseColonIndex
          : chineseColonIndex === -1
            ? colonIndex
            : Math.min(colonIndex, chineseColonIndex);

      if (separatorIndex > 0) {
        return {
          field: line.slice(0, separatorIndex).trim(),
          rule: line.slice(separatorIndex + 1).trim(),
        };
      }

      return { rule: line };
    })
    .filter((item) => item.rule);
}

function InlineEditableDataRules({
  value,
  disabled,
  onSave,
}: {
  value: DataRule[];
  disabled?: boolean;
  onSave: (nextValue: DataRule[]) => Promise<void> | void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(formatDataRulesForEditing(value));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cancellingRef = useRef(false);

  useEffect(() => {
    if (editing) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }
  }, [editing]);

  const save = async () => {
    if (cancellingRef.current) {
      cancellingRef.current = false;
      return;
    }

    const nextValue = parseDataRulesFromText(draft);
    if (JSON.stringify(nextValue) === JSON.stringify(value)) {
      setDraft(formatDataRulesForEditing(value));
      setEditing(false);
      setError(null);
      return;
    }

    if (saving) {
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(nextValue);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败，请稍后重试。");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = () => {
    if (disabled) {
      return;
    }

    setDraft(formatDataRulesForEditing(value));
    setError(null);
    setEditing(true);
  };

  if (editing) {
    return (
      <div className="space-y-2">
        <Textarea
          ref={textareaRef}
          aria-label="编辑数据规则"
          placeholder="title：必填，1～100 个字符"
          value={draft}
          disabled={disabled || saving}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => void save()}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              cancellingRef.current = true;
              setDraft(formatDataRulesForEditing(value));
              setError(null);
              setEditing(false);
            }
          }}
        />
        {saving ? <p className="text-xs text-muted-foreground">保存中...</p> : null}
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    );
  }

  if (value.length > 0) {
    return (
      <ul
        className={cn(storyTextBlockClassName, "space-y-2")}
        title="双击编辑"
        onDoubleClick={startEditing}
      >
        {value.map((rule, index) => (
          <li key={`${rule.field ?? "rule"}-${index}`}>
            {rule.field ? <span className="font-medium text-foreground">{rule.field}：</span> : null}
            {rule.rule}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p
      className={storyTextBlockClassName}
      title="双击编辑"
      onDoubleClick={startEditing}
    >
      暂无数据规则
    </p>
  );
}

function InlineSelect<T extends string>({
  label,
  value,
  options,
  labels,
  disabled,
  className,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  labels: Record<T, string>;
  disabled: boolean;
  className?: string;
  onChange: (value: T) => void;
}) {
  return (
    <label className={cn("flex flex-col gap-1 text-xs font-medium text-muted-foreground", className)}>
      {label}
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as T)}
        className={cn(
          "h-9 rounded-full border border-border bg-background px-3 text-sm text-foreground shadow-xs outline-none transition-colors",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option]}
          </option>
        ))}
      </select>
    </label>
  );
}

export function BusinessStoryCard({
  story,
  onUpdateStory,
  onPriorityChange,
  onStatusChange,
  onDelete,
}: {
  story: BusinessRequirementStory;
  onUpdateStory: (storyId: string, input: UpdateBusinessStoryInput) => Promise<BusinessRequirementStory>;
  onPriorityChange: (storyId: string, priority: BusinessStoryPriority) => Promise<void>;
  onStatusChange: (storyId: string, status: BusinessStoryStatus) => Promise<void>;
  onDelete?: (story: BusinessRequirementStory) => void;
}) {
  const [updatingField, setUpdatingField] = useState<"priority" | "status" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePriorityChange = async (priority: BusinessStoryPriority) => {
    if (priority === story.priority) {
      return;
    }

    setUpdatingField("priority");
    setError(null);
    try {
      await onPriorityChange(story.id, priority);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新优先级失败");
    } finally {
      setUpdatingField(null);
    }
  };

  const handleStatusChange = async (status: BusinessStoryStatus) => {
    if (status === story.status) {
      return;
    }

    setUpdatingField("status");
    setError(null);
    try {
      await onStatusChange(story.id, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新状态失败");
    } finally {
      setUpdatingField(null);
    }
  };

  const handleFieldSave = async (input: UpdateBusinessStoryInput) => {
    await onUpdateStory(story.id, input);
  };

  return (
    <Card className="relative">
      {onDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label={`删除业务需求故事：${story.title}`}
          onClick={() => onDelete(story)}
        >
          <X className="size-4" />
        </Button>
      ) : null}
      <CardHeader className="pb-4 pr-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold leading-7">{story.title}</h2>
              <BusinessStoryPriorityBadge priority={story.priority} />
              <BusinessStoryStatusBadge status={story.status} />
            </div>
            <p className="text-xs text-muted-foreground">创建于 {formatDate(story.created_at)}</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <InlineSelect
              label="优先级"
              value={story.priority}
              options={priorities}
              labels={priorityBadgeLabels}
              disabled={updatingField !== null}
              className="w-24"
              onChange={handlePriorityChange}
            />
            <InlineSelect
              label="状态"
              value={story.status}
              options={statuses}
              labels={statusLabels}
              disabled={updatingField !== null}
              className="w-28"
              onChange={handleStatusChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {error ? <ErrorState title="更新失败" message={error} /> : null}

        {story.vertical_slice_note ? (
          <p className="text-sm font-medium leading-7 text-[oklch(0.42_0.06_55)] dark:text-[oklch(0.82_0.08_65)]">
            {story.vertical_slice_note}
          </p>
        ) : null}

        <StorySection title="用户故事">
          <InlineEditableText
            value={story.user_story}
            ariaLabel="编辑用户故事"
            placeholder="请输入用户故事"
            className={storyTextBlockClassName}
            onSave={(userStory) => handleFieldSave({ user_story: userStory })}
          />
        </StorySection>

        <StorySection title="业务范围">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <h4 className="text-sm font-medium">包含</h4>
              <InlineEditableList
                value={story.business_scope.included}
                ariaLabel="编辑业务范围包含"
                placeholder="每行输入一个包含范围"
                emptyText="暂无包含范围"
                listClassName="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"
                emptyClassName="mt-3 text-sm text-muted-foreground"
                onSave={(included) =>
                  handleFieldSave({
                    business_scope: {
                      included,
                      excluded: story.business_scope.excluded,
                    },
                  })
                }
              />
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <h4 className="text-sm font-medium">不包含</h4>
              <InlineEditableList
                value={story.business_scope.excluded}
                ariaLabel="编辑业务范围不包含"
                placeholder="每行输入一个不包含范围"
                emptyText="暂无排除范围"
                listClassName="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"
                emptyClassName="mt-3 text-sm text-muted-foreground"
                onSave={(excluded) =>
                  handleFieldSave({
                    business_scope: {
                      included: story.business_scope.included,
                      excluded,
                    },
                  })
                }
              />
            </div>
          </div>
        </StorySection>

        <StorySection title="数据规则">
          <InlineEditableDataRules
            value={story.data_rules}
            onSave={(dataRules) => handleFieldSave({ data_rules: dataRules })}
          />
        </StorySection>

        <StorySection title="验收标准">
          <InlineEditableList
            value={story.acceptance_criteria}
            ariaLabel="编辑验收标准"
            ordered
            placeholder="每行输入一条验收标准"
            emptyText="暂无验收标准"
            listClassName={cn(storyTextBlockClassName, "list-decimal space-y-2 pl-9")}
            emptyClassName={storyTextBlockClassName}
            onSave={(acceptanceCriteria) =>
              handleFieldSave({ acceptance_criteria: acceptanceCriteria })
            }
          />
        </StorySection>
      </CardContent>
    </Card>
  );
}

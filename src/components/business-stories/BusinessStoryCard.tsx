"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  AffectedLayerBadge,
} from "@/components/business-stories/AffectedLayerBadge";
import { FieldDefinitionHeading } from "@/components/business-stories/BusinessRequirementFieldDefinition";
import {
  BusinessStoryPriorityBadge,
  priorityBadgeLabels,
  priorityLabels,
} from "@/components/business-stories/BusinessStoryPriorityBadge";
import { BusinessStoryStatusBadge, statusLabels } from "@/components/business-stories/BusinessStoryStatusBadge";
import { ImplementationScopeBadge } from "@/components/business-stories/ImplementationScopeBadge";
import { InlineEditableList } from "@/components/business-stories/InlineEditableList";
import { InlineEditableText } from "@/components/business-stories/InlineEditableText";
import { ErrorState } from "@/components/common/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { businessRequirementFieldDefinitionByKey } from "@/lib/business-story-contract";
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
  definition,
  showMeaning = true,
  children,
}: {
  title?: string;
  definition?: Parameters<typeof FieldDefinitionHeading>[0]["definition"];
  showMeaning?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      {definition ? (
        <FieldDefinitionHeading
          definition={definition}
          showMeaning={showMeaning}
          titleClassName="text-sm font-medium"
        />
      ) : (
        <h3 className="text-sm font-medium">{title}</h3>
      )}
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
  onExecute,
  executing,
  onDelete,
}: {
  story: BusinessRequirementStory;
  onUpdateStory: (storyId: string, input: UpdateBusinessStoryInput) => Promise<BusinessRequirementStory>;
  onPriorityChange: (storyId: string, priority: BusinessStoryPriority) => Promise<void>;
  onStatusChange: (storyId: string, status: BusinessStoryStatus) => Promise<void>;
  onExecute?: (story: BusinessRequirementStory) => void;
  executing?: boolean;
  onDelete?: (story: BusinessRequirementStory) => void;
}) {
  const [updatingField, setUpdatingField] = useState<"priority" | "status" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requirementName = story.requirement_name ?? story.title;
  const impactScope = story.impact_scope ?? {
    implementation_scope: story.implementation_scope,
    affected_layers: story.affected_layers,
  };
  const includedScope = story.included_scope ?? story.business_scope.included;
  const excludedScope = story.excluded_scope ?? story.business_scope.excluded;
  const executionNote = story.execution_note ?? story.execution_notes ?? "";

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
            <FieldDefinitionHeading
              definition={businessRequirementFieldDefinitionByKey.business_requirement_story}
              titleClassName="text-sm font-medium text-muted-foreground"
            />
            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-0 space-y-1">
                <FieldDefinitionHeading
                  definition={businessRequirementFieldDefinitionByKey.requirement_name}
                  titleClassName="text-xs font-medium text-muted-foreground"
                />
                <InlineEditableText
                  value={requirementName}
                  ariaLabel="编辑需求名称"
                  placeholder="请输入需求名称"
                  minRows={1}
                  className="cursor-text text-xl font-semibold leading-7 transition-colors hover:text-primary"
                  onSave={(title) => handleFieldSave({ title })}
                />
              </div>
              <BusinessStoryPriorityBadge priority={story.priority} />
              <ImplementationScopeBadge scope={impactScope.implementation_scope} />
              <BusinessStoryStatusBadge status={story.status} />
            </div>
            <p className="text-xs text-muted-foreground">创建于 {formatDate(story.created_at)}</p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {story.is_current ? <Badge>当前有效</Badge> : <Badge variant="secondary">历史版本</Badge>}
              {story.applied_at ? <span>已应用于 {formatDate(story.applied_at)}</span> : null}
            </div>
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
            {onExecute ? (
              <Button
                type="button"
                size="sm"
                className="self-end"
                disabled={executing}
                onClick={() => onExecute(story)}
              >
                {executing ? "执行中..." : "执行该需求切片"}
              </Button>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {error ? <ErrorState title="更新失败" message={error} /> : null}

        <StorySection definition={businessRequirementFieldDefinitionByKey.impact_scope}>
          <div className="flex flex-wrap gap-2">
            <ImplementationScopeBadge scope={impactScope.implementation_scope} />
            {impactScope.affected_layers.length > 0 ? (
              impactScope.affected_layers.map((layer) => (
                <AffectedLayerBadge key={layer} layer={layer} />
              ))
            ) : (
              <span className="text-sm leading-7 text-muted-foreground">暂无影响层</span>
            )}
          </div>
        </StorySection>

        {story.vertical_slice_note ? (
          <p className="text-sm font-medium leading-7 text-[oklch(0.42_0.06_55)] dark:text-[oklch(0.82_0.08_65)]">
            {story.vertical_slice_note}
          </p>
        ) : null}

        <StorySection definition={businessRequirementFieldDefinitionByKey.user_story}>
          <InlineEditableText
            value={story.user_story}
            ariaLabel="编辑用户故事"
            placeholder="请输入用户故事"
            className={storyTextBlockClassName}
            onSave={(userStory) => handleFieldSave({ user_story: userStory })}
          />
        </StorySection>

        <StorySection definition={businessRequirementFieldDefinitionByKey.business_scope}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <FieldDefinitionHeading
                definition={businessRequirementFieldDefinitionByKey.included_scope}
                titleClassName="text-sm font-medium"
              />
              <InlineEditableList
                value={includedScope}
                ariaLabel="编辑业务范围包含"
                placeholder="每行输入一个包含范围"
                emptyText="暂无包含范围"
                listClassName="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"
                emptyClassName="mt-3 text-sm text-muted-foreground"
                onSave={(included) =>
                  handleFieldSave({
                    business_scope: {
                      included,
                      excluded: excludedScope,
                    },
                  })
                }
              />
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <FieldDefinitionHeading
                definition={businessRequirementFieldDefinitionByKey.excluded_scope}
                titleClassName="text-sm font-medium"
              />
              <InlineEditableList
                value={excludedScope}
                ariaLabel="编辑业务范围不包含"
                placeholder="每行输入一个不包含范围"
                emptyText="暂无排除范围"
                listClassName="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"
                emptyClassName="mt-3 text-sm text-muted-foreground"
                onSave={(excluded) =>
                  handleFieldSave({
                    business_scope: {
                      included: includedScope,
                      excluded,
                    },
                  })
                }
              />
            </div>
          </div>
        </StorySection>

        <StorySection definition={businessRequirementFieldDefinitionByKey.execution_note}>
          <InlineEditableText
            value={executionNote}
            ariaLabel="编辑执行说明"
            placeholder="请输入执行说明"
            className={storyTextBlockClassName}
            emptyText="暂无执行说明"
            onSave={(executionNotes) => handleFieldSave({ execution_notes: executionNotes || null })}
          />
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

"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import {
  AffectedLayerBadge,
} from "@/components/business-stories/AffectedLayerBadge";
import { FieldDefinitionHeading } from "@/components/business-stories/BusinessRequirementFieldDefinition";
import {
  BusinessStoryPriorityBadge,
  priorityBadgeLabels,
  priorityLabels,
} from "@/components/business-stories/BusinessStoryPriorityBadge";
import { ImplementationScopeBadge } from "@/components/business-stories/ImplementationScopeBadge";
import { InlineEditableList } from "@/components/business-stories/InlineEditableList";
import { InlineEditableText } from "@/components/business-stories/InlineEditableText";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FieldHint } from "@/components/ui/field-hint";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { businessRequirementFieldDefinitionByKey } from "@/lib/business-story-contract";
import { cn } from "@/lib/utils";
import type {
  BusinessRequirementStory,
  BusinessStoryPriority,
  DataRule,
  UpdateBusinessStoryInput,
} from "@/lib/types/business-story";
import type { GenerationRun } from "@/lib/types/generation-run";

const priorities = Object.keys(priorityLabels) as BusinessStoryPriority[];
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

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function BusinessStoryExecutionProgress({ run }: { run?: GenerationRun }) {
  if (!run) {
    return null;
  }

  const progress = clampProgress(run.progress);
  const isWarning = ["failed", "error", "cancelled"].includes(run.status);
  const message =
    run.message ||
    (isWarning ? run.error_message || "变更集生成失败" : "正在生成分层变更集");

  return (
    <div className="mt-4 border-t border-border/60 pt-4">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className={cn("leading-5", isWarning ? "text-destructive" : "text-muted-foreground")}>
          {message.replace(/[。.…]+$/g, "")}
        </span>
        <span className="shrink-0 tabular-nums text-muted-foreground">{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isWarning ? "bg-destructive" : run.status === "completed" ? "bg-emerald-500" : "bg-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
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
        title={disabled ? undefined : "双击编辑"}
        onDoubleClick={disabled ? undefined : startEditing}
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
      title={disabled ? undefined : "双击编辑"}
      onDoubleClick={disabled ? undefined : startEditing}
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
  const labelId = useId();

  return (
    <div className={cn("flex flex-col gap-1 text-xs font-medium text-muted-foreground", className)}>
      <span id={labelId}>{label}</span>
      <Select
        value={value}
        disabled={disabled}
        onValueChange={(nextValue) => onChange(nextValue as T)}
      >
        <SelectTrigger aria-labelledby={labelId} className="h-9 rounded-full border-border shadow-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {labels[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function BusinessStoryCard({
  story,
  onUpdateStory,
  onPriorityChange,
  onExecute,
  executing,
  executionBlocked,
  executionFailed,
  executionProgress,
  onDelete,
  readOnly = false,
}: {
  story: BusinessRequirementStory;
  onUpdateStory: (storyId: string, input: UpdateBusinessStoryInput) => Promise<BusinessRequirementStory>;
  onPriorityChange: (storyId: string, priority: BusinessStoryPriority) => Promise<void>;
  onExecute?: (story: BusinessRequirementStory) => void;
  executing?: boolean;
  executionBlocked?: boolean;
  executionFailed?: boolean;
  executionProgress?: GenerationRun;
  onDelete?: (story: BusinessRequirementStory) => void;
  readOnly?: boolean;
}) {
  const [updatingField, setUpdatingField] = useState<"priority" | null>(null);
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
      <CardHeader className="pb-14 pr-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex min-w-0 items-start gap-1.5">
                <InlineEditableText
                  value={requirementName}
                  ariaLabel="编辑需求名称"
                  placeholder="请输入需求名称"
                  minRows={1}
                  disabled={readOnly}
                  className="min-w-0 cursor-text text-xl font-semibold leading-7 transition-colors hover:text-primary"
                  onSave={(title) => handleFieldSave({ title })}
                />
                <FieldHint
                  label={businessRequirementFieldDefinitionByKey.requirement_name.name}
                  hint={businessRequirementFieldDefinitionByKey.requirement_name.meaning}
                  showLabel={false}
                  tooltipAlign="center"
                  className="mt-1 shrink-0"
                />
              </div>
              <BusinessStoryPriorityBadge priority={story.priority} />
            </div>
            {story.vertical_slice_note ? (
              <p className="pt-2 text-sm font-medium leading-7 text-[oklch(0.42_0.06_55)] dark:text-[oklch(0.82_0.08_65)]">
                {story.vertical_slice_note}
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">创建于 {formatDate(story.created_at)}</p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {story.applied_at ? <span>已应用于 {formatDate(story.applied_at)}</span> : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <InlineSelect
              label="优先级"
              value={story.priority}
              options={priorities}
              labels={priorityBadgeLabels}
              disabled={readOnly || updatingField !== null}
              className="w-24"
              onChange={handlePriorityChange}
            />
            {onExecute ? (
              <Button
                type="button"
                size="sm"
                className="ml-2 self-end"
                disabled={executing || executionBlocked}
                title={executionBlocked ? "已有其他需求正在执行，请等待完成" : undefined}
                onClick={() => onExecute(story)}
              >
                {executing ? "执行中..." : executionFailed ? "重试" : "执行"}
              </Button>
            ) : null}
          </div>
        </div>
        <BusinessStoryExecutionProgress run={executionProgress} />
      </CardHeader>
      <CardContent className="space-y-5">
        {error ? <ErrorState title="更新失败" message={error} /> : null}

        <StorySection
          definition={businessRequirementFieldDefinitionByKey.impact_scope}
          showMeaning
        >
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

        <StorySection definition={businessRequirementFieldDefinitionByKey.user_story}>
          <InlineEditableText
            value={story.user_story}
            ariaLabel="编辑用户故事"
            placeholder="请输入用户故事"
            disabled={readOnly}
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
                showMeaning={false}
              />
              <InlineEditableList
                value={includedScope}
                ariaLabel="编辑业务范围包含"
                placeholder="每行输入一个包含范围"
                emptyText="暂无包含范围"
                listClassName="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"
                emptyClassName="mt-3 text-sm text-muted-foreground"
                disabled={readOnly}
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
                showMeaning={false}
              />
              <InlineEditableList
                value={excludedScope}
                ariaLabel="编辑业务范围不包含"
                placeholder="每行输入一个不包含范围"
                emptyText="暂无排除范围"
                listClassName="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"
                emptyClassName="mt-3 text-sm text-muted-foreground"
                disabled={readOnly}
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
            disabled={readOnly}
            onSave={(executionNotes) => handleFieldSave({ execution_notes: executionNotes || null })}
          />
        </StorySection>

        <StorySection definition={businessRequirementFieldDefinitionByKey.data_rules}>
          <InlineEditableDataRules
            value={story.data_rules}
            disabled={readOnly}
            onSave={(dataRules) => handleFieldSave({ data_rules: dataRules })}
          />
        </StorySection>

        <StorySection definition={businessRequirementFieldDefinitionByKey.acceptance_criteria}>
          <InlineEditableList
            value={story.acceptance_criteria}
            ariaLabel="编辑验收标准"
            ordered
            placeholder="每行输入一条验收标准"
            emptyText="暂无验收标准"
            listClassName={cn(storyTextBlockClassName, "list-decimal space-y-2 pl-9")}
            emptyClassName={storyTextBlockClassName}
            disabled={readOnly}
            onSave={(acceptanceCriteria) =>
              handleFieldSave({ acceptance_criteria: acceptanceCriteria })
            }
          />
        </StorySection>
      </CardContent>
    </Card>
  );
}

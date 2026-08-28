"use client";

import { FormEvent, useState } from "react";
import { ArrowUp } from "lucide-react";

import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Requirement } from "@/lib/types/requirement";
import { cn } from "@/lib/utils";

type RequirementEditorProps = {
  onSave: (rawText: string) => Promise<Requirement>;
  compact?: boolean;
  title?: string;
  hideLabel?: boolean;
  submitButton?: "text" | "icon";
  disabled?: boolean;
};

export function RequirementEditor({
  onSave,
  compact = false,
  title = "需求输入",
  hideLabel = false,
  submitButton = "text",
  disabled = false,
}: RequirementEditorProps) {
  const [rawText, setRawText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputDisabled = disabled || saving;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (disabled) {
      return;
    }

    if (!rawText.trim()) {
      setError("请输入自然语言业务需求");
      return;
    }

    setSaving(true);
    try {
      await onSave(rawText.trim());
      setRawText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存需求失败，请稍后重试");
    } finally {
      setSaving(false);
    }
  };

  const content = (
    <form className={cn(compact ? "space-y-2" : "space-y-4")} onSubmit={handleSubmit}>
      <div className="space-y-2">
        {hideLabel ? null : <Label htmlFor="requirement-raw-text">自然语言业务需求</Label>}
        {submitButton === "icon" ? (
          <div
            className={cn(
              "flex flex-col rounded-[1.5rem] border border-input bg-secondary/60 shadow-xs transition-all focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
              compact ? "gap-2 p-2" : "gap-3 p-3"
            )}
          >
            <Textarea
              id="requirement-raw-text"
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              placeholder="描述你希望 LLM 理解的任何需求、功能、流程、架构、约束或技术上下文，无论是单个功能还是多个模块"
              disabled={inputDisabled}
              className={cn(
                compact ? "min-h-20 py-2 leading-6" : "min-h-44",
                "resize-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0"
              )}
            />
            <Button
              type="submit"
              size="icon"
              disabled={inputDisabled}
              aria-label="保存需求"
              className="self-end"
            >
              <ArrowUp className="size-5 stroke-[3]" aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <Textarea
            id="requirement-raw-text"
            value={rawText}
            onChange={(event) => setRawText(event.target.value)}
            placeholder="描述你希望 LLM 理解的任何需求、功能、流程、架构、约束或技术上下文，无论是单个功能还是多个模块"
            disabled={inputDisabled}
            className={compact ? "min-h-20" : "min-h-44"}
          />
        )}
      </div>
      {error ? <ErrorState message={error} /> : null}
      {submitButton === "icon" ? (
        null
      ) : (
        <Button type="submit" disabled={inputDisabled}>
          {saving ? "正在保存..." : "保存需求"}
        </Button>
      )}
    </form>
  );

  if (compact) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>保存原始业务需求，后续由后端生成敏捷业务需求池条目</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}

"use client";

import { FormEvent, useState } from "react";

import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Requirement } from "@/lib/types/requirement";

type RequirementEditorProps = {
  onSave: (rawText: string) => Promise<Requirement>;
  compact?: boolean;
};

export function RequirementEditor({ onSave, compact = false }: RequirementEditorProps) {
  const [rawText, setRawText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!rawText.trim()) {
      setError("请输入自然语言业务需求。");
      return;
    }

    setSaving(true);
    try {
      await onSave(rawText.trim());
      setRawText("");
      setSuccess("需求已保存。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存需求失败，请稍后重试。");
    } finally {
      setSaving(false);
    }
  };

  const content = (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="requirement-raw-text">自然语言业务需求</Label>
        <Textarea
          id="requirement-raw-text"
          value={rawText}
          onChange={(event) => setRawText(event.target.value)}
          placeholder="描述业务目标、核心流程、角色、数据对象或你希望 Codex 理解的开发上下文。"
          disabled={saving}
          className="min-h-44"
        />
      </div>
      {error ? <ErrorState message={error} /> : null}
      {success ? <p className="text-sm text-muted-foreground">{success}</p> : null}
      <Button type="submit" disabled={saving}>
        {saving ? "正在保存..." : "保存需求"}
      </Button>
    </form>
  );

  if (compact) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>需求输入</CardTitle>
        <CardDescription>保存原始业务需求，后续由后端占位接口生成 blueprint 草案。</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}

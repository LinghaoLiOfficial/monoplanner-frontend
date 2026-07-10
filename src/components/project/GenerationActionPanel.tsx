"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, FileJson, PlayCircle } from "lucide-react";

import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateApiContract } from "@/lib/api/api-contracts";
import { getConsistencyCheck } from "@/lib/api/consistency";
import { generateContextPacks } from "@/lib/api/context-packs";
import { generateDbModel } from "@/lib/api/db-models";

type ActionKey = "api-contract" | "db-model" | "prompts" | "consistency";

type ActionState = {
  loading: boolean;
  error: string | null;
  success: string | null;
};

const initialState: Record<ActionKey, ActionState> = {
  "api-contract": { loading: false, error: null, success: null },
  "db-model": { loading: false, error: null, success: null },
  prompts: { loading: false, error: null, success: null },
  consistency: { loading: false, error: null, success: null },
};

const actions: Array<{
  key: ActionKey;
  title: string;
  description: string;
  buttonLabel: string;
  loadingLabel: string;
  successLabel: string;
  href: string;
  viewLabel: string;
}> = [
  {
    key: "api-contract",
    title: "API 契约草案",
    description: "从最新 Blueprint 生成接口资源、endpoint 和 schema 草案",
    buttonLabel: "生成 API 契约草案",
    loadingLabel: "正在生成 API 契约...",
    successLabel: "API 契约草案已生成",
    href: "api-contract",
    viewLabel: "查看 API 契约",
  },
  {
    key: "db-model",
    title: "数据库模型草案",
    description: "生成实体、字段、关系、索引与迁移说明",
    buttonLabel: "生成数据库模型草案",
    loadingLabel: "正在生成数据库模型...",
    successLabel: "数据库模型草案已生成",
    href: "db-model",
    viewLabel: "查看数据库模型",
  },
  {
    key: "prompts",
    title: "Context Packs",
    description: "生成面向前端、后端和联调角色的 Codex Prompt",
    buttonLabel: "生成 Context Packs",
    loadingLabel: "正在生成 Context Packs...",
    successLabel: "Context Packs 已生成",
    href: "prompts",
    viewLabel: "查看指令集合",
  },
  {
    key: "consistency",
    title: "一致性检查",
    description: "检查 Blueprint、契约、模型和 Prompt Pack 之间的一致性",
    buttonLabel: "运行一致性检查",
    loadingLabel: "正在检查...",
    successLabel: "一致性检查已完成",
    href: "consistency",
    viewLabel: "查看检查结果",
  },
];

export function GenerationActionPanel({
  projectId,
  hasBlueprint,
  onGenerated,
}: {
  projectId: string;
  hasBlueprint: boolean;
  onGenerated?: () => Promise<void> | void;
}) {
  const [states, setStates] = useState(initialState);

  const setActionState = (key: ActionKey, patch: Partial<ActionState>) => {
    setStates((current) => ({
      ...current,
      [key]: { ...current[key], ...patch },
    }));
  };

  const runAction = async (key: ActionKey) => {
    setActionState(key, { loading: true, error: null, success: null });

    try {
      if (key === "api-contract") {
        await generateApiContract(projectId);
      } else if (key === "db-model") {
        await generateDbModel(projectId);
      } else if (key === "prompts") {
        await generateContextPacks(projectId);
      } else {
        await getConsistencyCheck(projectId);
      }

      const action = actions.find((item) => item.key === key);
      setActionState(key, { success: action?.successLabel ?? "操作已完成" });
      await onGenerated?.();
    } catch (err) {
      setActionState(key, {
        error: err instanceof Error ? err.message : "操作失败，请稍后重试",
      });
    } finally {
      setActionState(key, { loading: false });
    }
  };

  if (!hasBlueprint) {
    return (
      <EmptyState
        icon={FileJson}
        title="先生成 Project Blueprint"
        description="API 契约、数据库模型、Context Packs 和一致性检查都需要基于已有 Blueprint"
        action={
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}/blueprint`}>查看蓝图</Link>
          </Button>
        }
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>第二批生成操作</CardTitle>
            <CardDescription>按产物独立触发后端占位生成接口，成功后进入对应页面查看</CardDescription>
          </div>
          <Badge variant="outline">Blueprint ready</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {actions.map((action) => {
          const state = states[action.key];

          return (
            <div key={action.key} className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex size-9 items-center justify-center rounded-full bg-secondary">
                  {state.success ? <CheckCircle2 className="size-4" /> : <PlayCircle className="size-4" />}
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{action.description}</p>
                  </div>
                  {state.error ? <ErrorState message={state.error} /> : null}
                  {state.success ? <p className="text-sm text-muted-foreground">{state.success}</p> : null}
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" onClick={() => void runAction(action.key)} disabled={state.loading}>
                      {state.loading ? action.loadingLabel : action.buttonLabel}
                    </Button>
                    {state.success ? (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/projects/${projectId}/${action.href}`}>{action.viewLabel}</Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

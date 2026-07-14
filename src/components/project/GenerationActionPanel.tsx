"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, FileJson, Loader2, PlayCircle } from "lucide-react";

import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateApiContract } from "@/lib/api/api-contracts";
import { generateProjectBlueprint } from "@/lib/api/blueprints";
import { generateBusinessStories } from "@/lib/api/business-stories";
import { getConsistencyCheck } from "@/lib/api/consistency";
import { generateContextPacks } from "@/lib/api/context-packs";
import { generateDbModel } from "@/lib/api/db-models";
import { getGenerationErrorMessage } from "@/lib/api/generation-errors";

type ActionKey = "business-stories" | "blueprint" | "api-contract" | "db-model" | "prompts" | "consistency";

type ActionState = {
  loading: boolean;
  error: string | null;
  success: string | null;
};

const initialState: Record<ActionKey, ActionState> = {
  "business-stories": { loading: false, error: null, success: null },
  blueprint: { loading: false, error: null, success: null },
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
  requiresBlueprint?: boolean;
}> = [
  {
    key: "business-stories",
    title: "业务需求故事",
    description: "基于用户需求生成并保存业务需求故事",
    buttonLabel: "生成业务需求故事",
    loadingLabel: "正在生成业务需求故事...",
    successLabel: "业务需求故事已生成并保存",
    href: "business-stories",
    viewLabel: "查看业务需求池",
  },
  {
    key: "blueprint",
    title: "项目蓝图",
    description: "基于用户需求和业务需求池生成并保存项目蓝图",
    buttonLabel: "生成蓝图",
    loadingLabel: "正在生成蓝图...",
    successLabel: "蓝图已生成并保存",
    href: "blueprint",
    viewLabel: "查看蓝图",
  },
  {
    key: "api-contract",
    title: "API 契约草案",
    description: "基于最新蓝图调用大模型生成接口路径、请求体、响应体和错误模型",
    buttonLabel: "生成 API 契约",
    loadingLabel: "正在生成 API 契约...",
    successLabel: "API 契约已生成并保存",
    href: "api-contract",
    viewLabel: "查看 API 契约",
    requiresBlueprint: true,
  },
  {
    key: "db-model",
    title: "数据库模型草案",
    description: "基于蓝图和 API 契约调用大模型生成实体、字段、关系、索引与迁移说明",
    buttonLabel: "生成数据库模型",
    loadingLabel: "正在生成数据库模型...",
    successLabel: "数据库模型已生成并保存",
    href: "db-model",
    viewLabel: "查看数据库模型",
    requiresBlueprint: true,
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
    requiresBlueprint: true,
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
    requiresBlueprint: true,
  },
];

export function GenerationActionPanel({
  projectId,
  hasBlueprint,
  isTechStackConfigured,
  onGenerated,
}: {
  projectId: string;
  hasBlueprint: boolean;
  isTechStackConfigured: boolean;
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
      if (key === "prompts") {
        await generateContextPacks(projectId);
      } else if (key === "business-stories") {
        await generateBusinessStories(projectId, { requirement_id: null, overwrite: false });
      } else if (key === "blueprint") {
        if (!isTechStackConfigured) {
          throw new Error("请先在项目蓝图页完成技术栈首次配置");
        }
        await generateProjectBlueprint(projectId);
      } else if (key === "api-contract") {
        await generateApiContract(projectId);
      } else if (key === "db-model") {
        await generateDbModel(projectId);
      } else {
        await getConsistencyCheck(projectId);
      }

      const action = actions.find((item) => item.key === key);
      setActionState(key, { success: action?.successLabel ?? "操作已完成" });
      await onGenerated?.();
    } catch (err) {
      setActionState(key, {
        error:
          key === "api-contract"
            ? getGenerationErrorMessage(err, "API 契约")
            : key === "db-model"
              ? getGenerationErrorMessage(err, "数据库模型")
              : key === "blueprint"
                ? getGenerationErrorMessage(err, "蓝图")
                : key === "business-stories"
                  ? getGenerationErrorMessage(err, "业务需求故事")
              : err instanceof Error
                ? err.message
                : "操作失败，请稍后重试",
      });
    } finally {
      setActionState(key, { loading: false });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>第二批生成操作</CardTitle>
            <CardDescription>按产物独立触发后端生成接口，成功后进入对应页面查看</CardDescription>
          </div>
          <Badge variant="outline">{hasBlueprint ? "Blueprint ready" : "Blueprint required"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {!isTechStackConfigured ? (
          <div className="md:col-span-2">
            <EmptyState
              icon={FileJson}
              title="先配置技术栈"
              description="项目蓝图生成前需要完成前端和后端技术栈首次配置，保存后不可修改"
              action={
                <Button asChild variant="outline">
                  <Link href={`/projects/${projectId}/blueprint`}>配置技术栈</Link>
                </Button>
              }
            />
          </div>
        ) : null}
        {isTechStackConfigured && !hasBlueprint ? (
          <div className="md:col-span-2">
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
          </div>
        ) : null}
        {actions.map((action) => {
          const state = states[action.key];
          const disabled = Boolean((action.key === "blueprint" && !isTechStackConfigured) || (action.requiresBlueprint && !hasBlueprint));

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
                  <p className="text-sm leading-6 text-muted-foreground">
                    后端正在调用大模型并保存结果，生成可能需要一些时间
                  </p>
                  <Button type="button" size="sm" onClick={() => void runAction(action.key)} disabled={state.loading || disabled}>
                    {state.loading ? <Loader2 className="size-4 animate-spin" /> : null}
                    {state.loading ? action.loadingLabel : action.buttonLabel}
                  </Button>
                  <div className="flex flex-wrap gap-2">
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

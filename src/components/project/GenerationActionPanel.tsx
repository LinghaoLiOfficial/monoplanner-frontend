"use client";

import Link from "next/link";
import { FileJson, ListChecks, Settings, Workflow } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  {
    icon: Settings,
    title: "完善项目配置",
    description: "维护项目名称、描述、前后端技术栈和全局约束。",
    href: "configuration",
    buttonLabel: "打开项目配置",
  },
  {
    icon: ListChecks,
    title: "梳理需求编排",
    description: "录入原始需求并整理成可执行的敏捷业务需求。",
    href: "business-requirements",
    buttonLabel: "查看敏捷业务需求",
  },
  {
    icon: FileJson,
    title: "查看工程实现",
    description: "查看前端工程实现、API 契约、后端工程实现与数据库模型。",
    href: "frontend-implementation",
    buttonLabel: "查看前端工程实现",
  },
  {
    icon: Workflow,
    title: "查看交付资产",
    description: "查看前后端 Codex 指令集合、验收清单和版本差异。",
    href: "delivery",
    buttonLabel: "查看交付 / 指令集合",
  },
];

export function GenerationActionPanel({
  projectId,
  hasBlueprint,
  isTechStackConfigured,
}: {
  projectId: string;
  hasBlueprint: boolean;
  isTechStackConfigured: boolean;
  onGenerated?: () => Promise<void> | void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>上下文编排流程</CardTitle>
            <CardDescription>从项目配置、需求编排到前后端工程实现与交付资产的主流程</CardDescription>
          </div>
          <Badge variant="outline">{hasBlueprint ? "蓝图就绪" : "蓝图待生成"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {!isTechStackConfigured ? (
          <div className="md:col-span-2">
            <EmptyState
              icon={FileJson}
              title="先配置项目"
              description="项目进入编排流程前需要完成前端和后端技术栈配置"
              action={
                <Button asChild variant="outline">
                  <Link href={`/projects/${projectId}/configuration`}>配置项目</Link>
                </Button>
              }
            />
          </div>
        ) : null}
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <div key={action.href} className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex size-9 items-center justify-center rounded-full bg-secondary">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{action.description}</p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/projects/${projectId}/${action.href}`}>{action.buttonLabel}</Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

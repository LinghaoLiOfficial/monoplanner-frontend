"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ImplementationScopeBadge } from "@/components/business-stories/ImplementationScopeBadge";
import { CopyButton } from "@/components/common/CopyButton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { JsonViewer } from "@/components/common/JsonViewer";
import { LoadingState } from "@/components/common/LoadingState";
import { sortAssetsByVersion, VersionList } from "@/components/design-assets/VersionList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listPromptPacks } from "@/lib/api/prompt-packs";
import type { PromptBlock as PromptBlockType, PromptPack } from "@/lib/types/prompt-pack";

function PromptNeededBadge({ needed }: { needed: boolean }) {
  return <Badge variant={needed ? "default" : "outline"}>{needed ? "需要修改" : "无需修改"}</Badge>;
}

function PromptBlock({ title, prompt }: { title: string; prompt?: PromptBlockType }) {
  if (!prompt?.needed) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>{title}</CardTitle>
            <PromptNeededBadge needed={false} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">本批次无需{title.includes("前端") ? "前端" : "后端"}修改</p>
        </CardContent>
      </Card>
    );
  }

  const body = prompt.body ?? prompt.prompt ?? "";

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>{prompt.title ?? title}</CardTitle>
            <CardDescription>{title}</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PromptNeededBadge needed />
            <CopyButton value={body} label="复制提示词" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <pre className="max-h-[520px] overflow-auto rounded-2xl border border-border/60 bg-muted/50 p-4 whitespace-pre-wrap text-sm leading-7">
          {body}
        </pre>
        <div className="grid gap-4 md:grid-cols-3">
          <PromptList title="影响文件" items={prompt.affected_files} />
          <PromptList title="不要修改" items={prompt.do_not_modify} />
          <PromptList title="验证步骤" items={prompt.verification_steps} />
        </div>
      </CardContent>
    </Card>
  );
}

function PromptList({ title, items }: { title: string; items?: string[] }) {
  return (
    <section className="rounded-2xl border border-border/60 p-4">
      <h3 className="text-sm font-medium">{title}</h3>
      {items?.length ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">暂无</p>
      )}
    </section>
  );
}

function textFromUnknown(value: unknown): string {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => textFromUnknown(item))
      .filter(Boolean)
      .join("\n");
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function getUXUIBasis(content: PromptPack["content"]) {
  const diffSummary = content.diff_summary;
  const candidates: string[] = [];

  if (typeof diffSummary === "string") {
    candidates.push(diffSummary);
  } else if (diffSummary && typeof diffSummary === "object") {
    candidates.push(textFromUnknown(diffSummary.added));
    candidates.push(textFromUnknown(diffSummary.modified));
  }

  candidates.push(content.frontend_prompt?.body ?? content.frontend_prompt?.prompt ?? "");

  const uxuiText = candidates
    .map((item) => item.trim())
    .filter((item) => item && /UX|UI|用户|交互|视觉|组件|布局|样式|状态|可访问性/i.test(item))
    .join("\n\n");

  return uxuiText;
}

function UXUIBasisCard({ content }: { content: PromptPack["content"] }) {
  const basis = getUXUIBasis(content);

  if (!basis) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>UX/UI 设计依据</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="max-h-80 overflow-auto rounded-2xl border border-border/60 bg-muted/50 p-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
          {basis}
        </pre>
      </CardContent>
    </Card>
  );
}

export default function PromptsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [packs, setPacks] = useState<PromptPack[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortedPacks = useMemo(() => sortAssetsByVersion(packs), [packs]);
  const selectedPack = sortedPacks.find((pack) => pack.id === selectedId) ?? sortedPacks[0] ?? null;
  const content = selectedPack?.content;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = sortAssetsByVersion(await listPromptPacks(projectId));
      setPacks(data);
      setSelectedId((current) => current ?? data[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载指令集合失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">交付 / 指令集合</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            查看应用变更集后生成的前端与后端 Codex 提示词、差异摘要和验收清单。
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/projects/${projectId}/change-sets`}>查看变更集</Link>
        </Button>
      </div>

      {loading ? <LoadingState label="正在加载交付 / 指令集合..." /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadData} /> : null}
      {!loading && !error && sortedPacks.length === 0 ? (
        <EmptyState title="暂无交付 / 指令集合" description="应用变更集后，系统会生成对应批次的前后端提示词。" />
      ) : null}
      {!loading && !error && selectedPack && content ? (
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <VersionList assets={sortedPacks} selectedId={selectedPack.id} onSelect={setSelectedId} title="批次列表" description="选择一个 Prompt Pack 批次" />
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{selectedPack.title}</CardTitle>
                    <CardDescription>{selectedPack.summary}</CardDescription>
                  </div>
                  {content.implementation_scope ? <ImplementationScopeBadge scope={content.implementation_scope} /> : null}
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <section>
                  <h3 className="text-sm font-medium">批次摘要</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{content.batch_summary ?? "暂无批次摘要"}</p>
                </section>
                <section>
                  <h3 className="text-sm font-medium">差异摘要</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                    {textFromUnknown(content.diff_summary) || "暂无差异摘要"}
                  </p>
                </section>
                <PromptList title="执行顺序" items={content.execution_order} />
                <PromptList title="验收清单" items={content.acceptance_checklist} />
                <PromptList title="回滚说明" items={content.rollback_notes} />
              </CardContent>
            </Card>
            <UXUIBasisCard content={content} />
            <PromptBlock title="前端提示词" prompt={content.frontend_prompt} />
            <PromptBlock title="后端提示词" prompt={content.backend_prompt} />
            <JsonViewer title="Prompt Pack JSON" data={content} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

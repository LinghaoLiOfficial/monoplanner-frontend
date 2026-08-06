"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AffectedLayerBadge } from "@/components/business-stories/AffectedLayerBadge";
import { ImplementationScopeBadge } from "@/components/business-stories/ImplementationScopeBadge";
import { ChangeSetStatusBadge } from "@/components/change-sets/ChangeSetStatusBadge";
import { ErrorState } from "@/components/common/ErrorState";
import { JsonViewer } from "@/components/common/JsonViewer";
import { LoadingState } from "@/components/common/LoadingState";
import { ModuleChangeViewer } from "@/components/design-assets/ModuleChangeViewer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { applyChangeSet, discardChangeSet, listChangeSets, regenerateChangeSet } from "@/lib/api/change-sets";
import { getGenerationRun } from "@/lib/api/generation-runs";
import { formatDateTime } from "@/lib/design-asset-labels";
import { cn } from "@/lib/utils";
import type { ChangeSet } from "@/lib/types/change-set";

const GENERATION_RUN_POLL_INTERVAL_MS = 2000;
const GENERATION_RUN_MAX_POLLS = 180;
const COMPLETED_RUN_STATUSES = new Set(["completed", "succeeded", "success"]);
const FAILED_RUN_STATUSES = new Set(["failed", "error", "cancelled"]);

function sortChangeSets(changeSets: ChangeSet[]) {
  return [...changeSets].sort(
    (a, b) => b.version - a.version || Date.parse(b.created_at) - Date.parse(a.created_at)
  );
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export default function ChangeSetsPage() {
  const params = useParams<{ projectId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = params.projectId;
  const [changeSets, setChangeSets] = useState<ChangeSet[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("selected"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<"apply" | "regenerate" | "discard" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sortedChangeSets = useMemo(() => sortChangeSets(changeSets), [changeSets]);
  const selectedChangeSet = sortedChangeSets.find((item) => item.id === selectedId) ?? sortedChangeSets[0] ?? null;

  const waitForGenerationRun = async (runId: string) => {
    for (let attempt = 0; attempt < GENERATION_RUN_MAX_POLLS; attempt += 1) {
      const run = await getGenerationRun(runId);

      if (COMPLETED_RUN_STATUSES.has(run.status)) {
        return run;
      }

      if (FAILED_RUN_STATUSES.has(run.status)) {
        throw new Error(run.error_message || run.message || "后台任务执行失败");
      }

      await sleep(GENERATION_RUN_POLL_INTERVAL_MS);
    }

    throw new Error("后台任务执行超时，请稍后刷新变更集列表");
  };

  const loadChangeSets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = sortChangeSets(await listChangeSets(projectId));
      setChangeSets(data);
      setSelectedId((current) => current ?? data[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载变更集失败");
    } finally {
      setLoading(false);
    }
  };

  const replaceChangeSet = (changeSet: ChangeSet) => {
    setChangeSets((current) => sortChangeSets(current.map((item) => (item.id === changeSet.id ? changeSet : item))));
    setSelectedId(changeSet.id);
  };

  const handleApply = async () => {
    if (!selectedChangeSet) {
      return;
    }

    setActionLoading("apply");
    setActionError(null);
    setSuccess(null);
    try {
      const run = await applyChangeSet(selectedChangeSet.id);
      await waitForGenerationRun(run.id);
      await loadChangeSets();
      setSuccess("变更集已应用，相关设计资产与指令集合已更新。");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "应用变更集失败");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRegenerate = async () => {
    if (!selectedChangeSet) {
      return;
    }

    setActionLoading("regenerate");
    setActionError(null);
    setSuccess(null);
    try {
      const run = await regenerateChangeSet(selectedChangeSet.id);
      await waitForGenerationRun(run.id);
      setSelectedId(null);
      await loadChangeSets();
      setSuccess("变更集已重新生成。");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "重新生成变更集失败");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDiscard = async () => {
    if (!selectedChangeSet) {
      return;
    }

    setActionLoading("discard");
    setActionError(null);
    setSuccess(null);
    try {
      replaceChangeSet(await discardChangeSet(selectedChangeSet.id));
      setSuccess("变更集已放弃。");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "放弃变更集失败");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadChangeSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">变更集</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            查看业务故事执行生成的变更影响，确认后应用到前端、API、后端、数据库、蓝图和指令集合资产。
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/projects/${projectId}/business-requirements`}>返回敏捷业务需求</Link>
        </Button>
      </div>

      {loading ? <LoadingState label="正在加载变更集..." /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadChangeSets} /> : null}
      {!loading && !error ? (
        <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>变更集列表</CardTitle>
              <CardDescription>按版本查看最近生成的变更集</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {sortedChangeSets.length === 0 ? (
                <p className="text-sm leading-6 text-muted-foreground">暂无变更集，请先执行一个业务需求切片。</p>
              ) : null}
              {sortedChangeSets.map((changeSet) => (
                <button
                  key={changeSet.id}
                  type="button"
                  onClick={() => setSelectedId(changeSet.id)}
                  className={cn(
                    "w-full rounded-2xl border border-border/60 bg-background px-4 py-3 text-left transition-colors hover:bg-muted",
                    selectedChangeSet?.id === changeSet.id && "border-foreground bg-muted"
                  )}
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">v{changeSet.version}</span>
                    <ChangeSetStatusBadge status={changeSet.status} />
                  </span>
                  <span className="mt-2 block text-sm font-medium">{changeSet.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{formatDateTime(changeSet.created_at)}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {selectedChangeSet ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle>{selectedChangeSet.title}</CardTitle>
                        <ChangeSetStatusBadge status={selectedChangeSet.status} />
                      </div>
                      <CardDescription className="mt-2">{selectedChangeSet.impact_summary}</CardDescription>
                    </div>
                    <ImplementationScopeBadge scope={selectedChangeSet.implementation_scope} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {actionError ? <ErrorState title="操作失败" message={actionError} /> : null}
                  {success ? (
                    <Alert>
                      <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
                        <span>{success}</span>
                        <Button type="button" size="sm" onClick={() => router.push(`/projects/${projectId}/delivery`)}>
                          查看交付 / 指令集合
                        </Button>
                      </AlertDescription>
                    </Alert>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {selectedChangeSet.affected_layers.map((layer) => (
                      <AffectedLayerBadge key={layer} layer={layer} />
                    ))}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <section className="rounded-2xl border border-border/60 p-4">
                      <h3 className="text-sm font-medium">风险</h3>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                        {(selectedChangeSet.risks.length ? selectedChangeSet.risks : ["暂无风险说明"]).map((risk, index) => (
                          <li key={index}>{risk}</li>
                        ))}
                      </ul>
                    </section>
                    <section className="rounded-2xl border border-border/60 p-4">
                      <h3 className="text-sm font-medium">待确认问题</h3>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                        {(selectedChangeSet.open_questions.length ? selectedChangeSet.open_questions : ["暂无待确认问题"]).map((question, index) => (
                          <li key={index}>{question}</li>
                        ))}
                      </ul>
                    </section>
                  </div>
                  <section className="rounded-2xl border border-border/60 p-4">
                    <h3 className="text-sm font-medium">推荐提示词策略</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      前端：{selectedChangeSet.recommended_prompt_strategy.generate_frontend_prompt ? "需要" : "不需要"}；
                      后端：{selectedChangeSet.recommended_prompt_strategy.generate_backend_prompt ? "需要" : "不需要"}。
                      {selectedChangeSet.recommended_prompt_strategy.reason}
                    </p>
                  </section>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" onClick={() => void handleApply()} disabled={Boolean(actionLoading) || selectedChangeSet.status === "applied"}>
                      {actionLoading === "apply" ? "应用中..." : "应用变更集"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => void handleRegenerate()} disabled={Boolean(actionLoading) || selectedChangeSet.status === "applied"}>
                      {actionLoading === "regenerate" ? "重新生成中..." : "重新生成"}
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => void handleDiscard()} disabled={Boolean(actionLoading) || selectedChangeSet.status === "applied" || selectedChangeSet.status === "discarded"}>
                      {actionLoading === "discard" ? "放弃中..." : "放弃"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <ModuleChangeViewer moduleChanges={selectedChangeSet.module_changes} />
              <JsonViewer title="变更集 JSON" data={selectedChangeSet.content ?? selectedChangeSet} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

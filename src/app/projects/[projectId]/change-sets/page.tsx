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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { applyChangeSet, discardChangeSet, listChangeSets, regenerateChangeSet } from "@/lib/api/change-sets";
import { getGenerationRun } from "@/lib/api/generation-runs";
import { affectedLayerLabels, formatDateTime } from "@/lib/design-asset-labels";
import { cn } from "@/lib/utils";
import type { AffectedLayer } from "@/lib/types/business-story";
import type { ChangeSet } from "@/lib/types/change-set";

const GENERATION_RUN_POLL_INTERVAL_MS = 2000;
const GENERATION_RUN_MAX_POLLS = 180;
const COMPLETED_RUN_STATUSES = new Set(["completed", "succeeded", "success"]);
const FAILED_RUN_STATUSES = new Set(["failed", "error", "cancelled"]);

function sortChangeSets(changeSets: ChangeSet[]) {
  return [...changeSets].sort(
    (a, b) =>
      Number(Boolean(b.is_current)) - Number(Boolean(a.is_current)) ||
      Number(Boolean(b.applied_at)) - Number(Boolean(a.applied_at)) ||
      b.version - a.version ||
      Date.parse(b.created_at) - Date.parse(a.created_at)
  );
}

function getLayerKey(changeSet: ChangeSet) {
  return changeSet.layer ?? changeSet.affected_layers[0] ?? "uncategorized";
}

function getLayerLabel(layerKey: string) {
  return affectedLayerLabels[layerKey as AffectedLayer] ?? layerKey;
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function ChangeSetBatchSection({
  layerKey,
  changeSets,
  selectedId,
  onSelect,
}: {
  layerKey: string;
  changeSets: ChangeSet[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl border border-border/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{getLayerLabel(layerKey)}</h3>
          <p className="text-xs text-muted-foreground">批次内按当前有效版本和历史版本分层展示</p>
        </div>
        <Badge variant="outline">{changeSets.length} 个版本</Badge>
      </div>
      <div className="space-y-2">
        {changeSets.map((changeSet) => {
          const active = selectedId === changeSet.id;

          return (
            <button
              key={changeSet.id}
              type="button"
              onClick={() => onSelect(changeSet.id)}
              className={cn(
                "w-full rounded-2xl border border-border/60 bg-background px-4 py-3 text-left transition-colors hover:bg-muted",
                active && "border-foreground bg-muted"
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">v{changeSet.version}</span>
                <ChangeSetStatusBadge status={changeSet.status} />
                {changeSet.is_current ? <Badge>当前有效</Badge> : null}
                {changeSet.applied_at ? <Badge variant="secondary">已应用</Badge> : null}
              </div>
              <div className="mt-2 text-sm font-medium">{changeSet.title}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {changeSet.batch_id ? <span>批次 {changeSet.batch_id}</span> : <span>单独生成</span>}
                <span>{formatDateTime(changeSet.created_at)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
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
  const groupedChangeSets = useMemo(() => {
    const groups = new Map<string, ChangeSet[]>();

    for (const changeSet of sortedChangeSets) {
      const key = getLayerKey(changeSet);
      const existing = groups.get(key) ?? [];
      existing.push(changeSet);
      groups.set(key, existing);
    }

    return [...groups.entries()];
  }, [sortedChangeSets]);

  const selectedChangeSet =
    sortedChangeSets.find((item) => item.id === selectedId) ??
    sortedChangeSets.find((item) => item.is_current && item.status !== "applied") ??
    sortedChangeSets[0] ??
    null;

  const currentLayerCount = useMemo(
    () => new Set(sortedChangeSets.filter((item) => item.is_current !== false).map((item) => getLayerKey(item))).size,
    [sortedChangeSets]
  );

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
      setSelectedId((current) => current ?? data.find((item) => item.is_current && item.status !== "applied")?.id ?? data[0]?.id ?? null);
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

  const canMutate = Boolean(selectedChangeSet && selectedChangeSet.is_current !== false && selectedChangeSet.status !== "applied" && selectedChangeSet.status !== "discarded");

  const handleApply = async () => {
    if (!selectedChangeSet || !canMutate) {
      return;
    }

    setActionLoading("apply");
    setActionError(null);
    setSuccess(null);
    try {
      const run = await applyChangeSet(selectedChangeSet.id);
      await waitForGenerationRun(run.id);
      await loadChangeSets();
      setSuccess("变更集已应用，相关版本资产与指令集合已更新。");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "应用变更集失败");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRegenerate = async () => {
    if (!selectedChangeSet || !canMutate) {
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
    if (!selectedChangeSet || !canMutate) {
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
    const timer = window.setTimeout(() => {
      void loadChangeSets();
    }, 0);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">分层变更集</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            按 layer 和 batch_id 查看变更集，已应用的版本会退回历史，不再作为默认有效项。
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/projects/${projectId}/business-requirements`}>返回业务故事池</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="py-5">
            <div className="text-xs text-muted-foreground">分层数</div>
            <div className="mt-2 text-2xl font-semibold">{currentLayerCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <div className="text-xs text-muted-foreground">当前有效</div>
            <div className="mt-2 text-2xl font-semibold">{sortedChangeSets.filter((item) => item.is_current !== false).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <div className="text-xs text-muted-foreground">已应用</div>
            <div className="mt-2 text-2xl font-semibold">{sortedChangeSets.filter((item) => item.applied_at).length}</div>
          </CardContent>
        </Card>
      </div>

      {loading ? <LoadingState label="正在加载变更集..." /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadChangeSets} /> : null}
      {!loading && !error ? (
        <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>按层查看</CardTitle>
              <CardDescription>每个层单独列出当前有效版本和历史版本</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupedChangeSets.length === 0 ? (
                <p className="text-sm leading-6 text-muted-foreground">暂无变更集，请先从业务故事池生成。</p>
              ) : null}
              {groupedChangeSets.map(([layerKey, items]) => (
                <ChangeSetBatchSection
                  key={layerKey}
                  layerKey={layerKey}
                  changeSets={items}
                  selectedId={selectedChangeSet?.id ?? null}
                  onSelect={setSelectedId}
                />
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
                        {selectedChangeSet.is_current ? <Badge>当前有效</Badge> : <Badge variant="secondary">历史版本</Badge>}
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
                          查看指令集合
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
                      <h3 className="text-sm font-medium">批次信息</h3>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {selectedChangeSet.batch_id ? `batch_id：${selectedChangeSet.batch_id}` : "暂无 batch_id"}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {selectedChangeSet.layer ? `layer：${selectedChangeSet.layer}` : "暂无 layer"}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {selectedChangeSet.applied_at ? `applied_at：${formatDateTime(selectedChangeSet.applied_at)}` : "尚未应用"}
                      </p>
                    </section>
                    <section className="rounded-2xl border border-border/60 p-4">
                      <h3 className="text-sm font-medium">推荐提示词策略</h3>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        前端：{selectedChangeSet.recommended_prompt_strategy.generate_frontend_prompt ? "需要" : "不需要"}；
                        后端：{selectedChangeSet.recommended_prompt_strategy.generate_backend_prompt ? "需要" : "不需要"}。
                        {selectedChangeSet.recommended_prompt_strategy.reason}
                      </p>
                    </section>
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
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" onClick={() => void handleApply()} disabled={Boolean(actionLoading) || !canMutate}>
                      {actionLoading === "apply" ? "应用中..." : "应用变更集"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => void handleRegenerate()} disabled={Boolean(actionLoading) || !canMutate}>
                      {actionLoading === "regenerate" ? "重新生成中..." : "重新生成"}
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => void handleDiscard()} disabled={Boolean(actionLoading) || !canMutate}>
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

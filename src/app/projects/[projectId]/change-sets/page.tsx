"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { FileJson, History, Layers3, List, X } from "lucide-react";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ModuleChangeViewer } from "@/components/design-assets/ModuleChangeViewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  applyChangeSet,
  applyChangeSetBatch,
  listActiveChangeSetApplicationRuns,
  listChangeSets,
} from "@/lib/api/change-sets";
import { listBusinessStories } from "@/lib/api/business-stories";
import { getGenerationRun } from "@/lib/api/generation-runs";
import { affectedLayerLabels, formatDateTime } from "@/lib/design-asset-labels";
import { cn } from "@/lib/utils";
import type { ModuleChangeGroup } from "@/lib/types/design-asset";
import type { ChangeSet } from "@/lib/types/change-set";
import type { GenerationRun } from "@/lib/types/generation-run";

const GENERATION_RUN_POLL_INTERVAL_MS = 2000;
const GENERATION_RUN_MAX_POLLS = 180;
const COMPLETED_RUN_STATUSES = new Set(["completed", "succeeded", "success"]);
const FAILED_RUN_STATUSES = new Set(["failed", "error", "cancelled"]);
const ASSET_LAYER_ORDER = [
  "ux_design",
  "ui_design",
  "frontend_implementation",
  "frontend_pages",
  "api_contract",
  "backend_implementation",
  "backend_services",
  "db_model",
  "database_model",
  "database_models",
];

type ChangeSetBatch = {
  key: string;
  batchId: string | null;
  changeSets: ChangeSet[];
  representative: ChangeSet;
};

function sleep(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function ChangeSetApplicationProgress({ run }: { run: GenerationRun }) {
  const progress = clampProgress(run.progress);
  const isWarning = FAILED_RUN_STATUSES.has(run.status);
  const message =
    run.message ||
    (isWarning ? run.error_message || "应用变更集失败" : "正在应用变更集");

  return (
    <div className="mt-3 border-t border-border/60 pt-3">
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
            isWarning
              ? "bg-destructive"
              : COMPLETED_RUN_STATUSES.has(run.status)
                ? "bg-emerald-500"
                : "bg-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

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

function getLayerLabel(changeSet: ChangeSet) {
  const layerKey = getLayerKey(changeSet);
  return affectedLayerLabels[layerKey as keyof typeof affectedLayerLabels] ?? layerKey;
}

function getBatchKey(changeSet: ChangeSet) {
  return changeSet.batch_id ?? changeSet.id;
}

function isAppliedChangeSet(changeSet: ChangeSet) {
  return Boolean(changeSet.applied_at) || changeSet.status === "applied";
}

function isCurrentChangeSet(changeSet: ChangeSet) {
  return changeSet.is_current !== false && !isAppliedChangeSet(changeSet);
}

function sortCurrentChangeSets(changeSets: ChangeSet[]) {
  return [...changeSets].sort(
    (a, b) =>
      ASSET_LAYER_ORDER.indexOf(getLayerKey(a)) - ASSET_LAYER_ORDER.indexOf(getLayerKey(b)) ||
      b.version - a.version ||
      Date.parse(b.created_at) - Date.parse(a.created_at)
  );
}

function groupChangeSetsByBatch(changeSets: ChangeSet[]) {
  const grouped = new Map<string, ChangeSetBatch>();

  for (const changeSet of changeSets) {
    const key = getBatchKey(changeSet);
    const existing = grouped.get(key);
    if (existing) {
      existing.changeSets.push(changeSet);
      existing.changeSets = sortCurrentChangeSets(existing.changeSets);
      existing.representative = existing.changeSets[0];
    } else {
      grouped.set(key, {
        key,
        batchId: changeSet.batch_id ?? null,
        changeSets: [changeSet],
        representative: changeSet,
      });
    }
  }

  return [...grouped.values()].sort(
    (a, b) =>
      Date.parse(b.representative.created_at) - Date.parse(a.representative.created_at) ||
      b.representative.version - a.representative.version
  );
}

function getBatchVersionLabel(batch: ChangeSetBatch, assetVersionByChangeSetId: Map<string, number>) {
  const versions = Array.from(
    new Set(batch.changeSets.map((changeSet) => assetVersionByChangeSetId.get(changeSet.id) ?? changeSet.version))
  ).sort((a, b) => a - b);

  if (versions.length === 0) {
    return `v${batch.representative.version}`;
  }

  return versions.length === 1 ? `v${versions[0]}` : `v${versions[0]}-${versions[versions.length - 1]}`;
}

function canApplyBatch(batch: ChangeSetBatch | null) {
  return Boolean(
    batch?.changeSets.some(
      (changeSet) =>
        changeSet.is_current !== false &&
        ["draft", "ready", "failed"].includes(changeSet.status)
    )
  );
}

function buildAssetVersionMap(changeSets: ChangeSet[]) {
  const orderedByLayerAge = [...changeSets].sort(
    (a, b) =>
      Date.parse(a.created_at) - Date.parse(b.created_at) ||
      a.version - b.version
  );
  const layerCounts = new Map<string, number>();
  const versions = new Map<string, number>();

  for (const changeSet of orderedByLayerAge) {
    const layerKey = getLayerKey(changeSet);
    const nextVersion = (layerCounts.get(layerKey) ?? 0) + 1;
    layerCounts.set(layerKey, nextVersion);
    versions.set(changeSet.id, nextVersion);
  }

  return versions;
}

function sanitizeModuleChangeGroup(group: ModuleChangeGroup | undefined) {
  return {
    added: group?.added ?? [],
    modified: group?.modified ?? [],
    removed: group?.removed ?? [],
  };
}

function sanitizeModuleChanges(moduleChanges: ChangeSet["module_changes"]) {
  return Object.fromEntries(
    Object.entries(moduleChanges).map(([moduleKey, group]) => [
      moduleKey,
      sanitizeModuleChangeGroup(group as ModuleChangeGroup | undefined),
    ])
  );
}

function ChangeSetAssetList({
  batches,
  selectedChangeSetId,
  assetVersionByChangeSetId,
  onSelect,
  emptyText,
}: {
  batches: ChangeSetBatch[];
  selectedChangeSetId: string | null;
  assetVersionByChangeSetId: Map<string, number>;
  onSelect: (changeSetId: string) => void;
  emptyText: string;
}) {
  if (batches.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{emptyText}</p>;
  }

  return batches.flatMap((batch) =>
    batch.changeSets.map((changeSet) => {
      const active = selectedChangeSetId === changeSet.id;
      const assetVersion = assetVersionByChangeSetId.get(changeSet.id) ?? changeSet.version;

      return (
        <button
          key={changeSet.id}
          type="button"
          onClick={() => onSelect(changeSet.id)}
          className={cn(
            "w-full rounded-md border border-border/60 bg-background px-3 py-2 text-left transition-colors hover:bg-muted",
            active && "border-foreground bg-muted"
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-normal text-foreground/80">{getLayerLabel(changeSet)}</span>
            <Badge variant="outline">v{assetVersion}</Badge>
          </div>
        </button>
      );
    })
  );
}

function ChangeSetDetailPanel({
  changeSet,
  assetVersionByChangeSetId,
  applyError,
}: {
  changeSet: ChangeSet | null;
  assetVersionByChangeSetId: Map<string, number>;
  applyError?: string | null;
}) {
  const moduleChanges = changeSet ? sanitizeModuleChanges(changeSet.module_changes) : {};

  if (!changeSet) {
    return <p className="text-sm leading-6 text-muted-foreground">暂无资产详情。</p>;
  }

  return (
    <>
      <p className="pt-4 text-sm font-medium leading-6 text-[oklch(0.42_0.06_55)] dark:text-[oklch(0.82_0.08_65)]">
        {changeSet.impact_summary}
      </p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>创建于 {formatDateTime(changeSet.created_at)}</span>
        {changeSet.applied_at ? <span>应用于 {formatDateTime(changeSet.applied_at)}</span> : null}
      </div>
      {applyError ? <ErrorState title="应用失败" message={applyError} /> : null}
      <div className="mt-16">
        <ModuleChangeViewer
          moduleChanges={moduleChanges}
          version={assetVersionByChangeSetId.get(changeSet.id) ?? changeSet.version}
        />
      </div>
    </>
  );
}

function ApplicationHistoryCard({
  batches,
  loading,
  error,
  assetVersionByChangeSetId,
  selectedBatchKey,
  selectedChangeSetId,
  onSelectBatch,
  onSelectChangeSet,
  onClose,
  onRetry,
}: {
  batches: ChangeSetBatch[];
  loading: boolean;
  error: string | null;
  assetVersionByChangeSetId: Map<string, number>;
  selectedBatchKey: string | null;
  selectedChangeSetId: string | null;
  onSelectBatch: (batch: ChangeSetBatch) => void;
  onSelectChangeSet: (changeSetId: string) => void;
  onClose: () => void;
  onRetry: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [dragPointerId, setDragPointerId] = useState<number | null>(null);
  const [floatingPosition, setFloatingPosition] = useState<{ left: number; top: number } | null>(null);
  const selectedBatch = batches.find((batch) => batch.key === selectedBatchKey) ?? batches[0] ?? null;
  const selectedChangeSet =
    selectedBatch?.changeSets.find((changeSet) => changeSet.id === selectedChangeSetId) ??
    selectedBatch?.changeSets[0] ??
    null;

  const constrainFloatingPosition = (left: number, top: number) => {
    const rect = cardRef.current?.getBoundingClientRect();
    const margin = 8;
    const maxLeft = Math.max(margin, window.innerWidth - (rect?.width ?? 0) - margin);
    const maxTop = Math.max(margin, window.innerHeight - (rect?.height ?? 0) - margin);

    return {
      left: Math.min(Math.max(left, margin), maxLeft),
      top: Math.min(Math.max(top, margin), maxTop),
    };
  };

  const handleDragStart = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button")) {
      return;
    }

    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    setFloatingPosition({ left: rect.left, top: rect.top });
    setDragPointerId(event.pointerId);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handleDragMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragPointerId !== event.pointerId) {
      return;
    }

    setFloatingPosition(
      constrainFloatingPosition(
        event.clientX - dragOffsetRef.current.x,
        event.clientY - dragOffsetRef.current.y
      )
    );
  };

  const handleDragEnd = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragPointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragPointerId(null);
  };

  return (
    <Card
      ref={cardRef}
      className={cn(
        "fixed z-40 flex h-[min(38rem,calc(100vh-6rem))] max-h-[calc(100vh-6rem)] w-[min(72rem,calc(100vw-2rem))] flex-col shadow-xl lg:h-[min(42rem,calc(100vh-8rem))] lg:max-h-[calc(100vh-8rem)] lg:w-[min(82rem,calc(100vw-4rem))]",
        floatingPosition ? "" : "left-1/2 top-20 -translate-x-1/2 lg:top-24"
      )}
      style={
        floatingPosition
          ? {
              left: floatingPosition.left,
              top: floatingPosition.top,
            }
          : undefined
      }
    >
      <CardHeader
        className={cn(
          "flex-row items-start justify-between gap-4 border-b border-border/60 select-none",
          dragPointerId === null ? "cursor-grab" : "cursor-grabbing"
        )}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
      >
        <div className="flex min-w-0 items-center gap-2">
          <History className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <CardTitle>历史应用记录</CardTitle>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          aria-label="关闭历史应用记录"
          title="关闭历史应用记录"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto p-4 lg:overflow-hidden">
        {loading ? (
          <div className="flex h-full min-h-48 items-center justify-center text-sm text-muted-foreground">
            正在加载历史应用记录...
          </div>
        ) : null}
        {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={onRetry} /> : null}
        {!loading && !error && batches.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">暂无成功应用记录</p>
        ) : null}
        {!loading && !error && batches.length > 0 ? (
          <div className="grid gap-4 lg:h-full lg:min-h-0 lg:grid-cols-[180px_220px_minmax(0,1fr)] lg:items-stretch">
            <section className="min-h-0 space-y-3 lg:overflow-hidden">
              <div className="flex items-center gap-2">
                <List className="size-5 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-base font-semibold">记录列表</h3>
              </div>
              <div className="space-y-2 lg:h-[calc(100%-2.5rem)] lg:overflow-y-auto lg:pr-2">
                {batches.map((batch) => {
                  const active = selectedBatch?.key === batch.key;

                  return (
                    <button
                      key={batch.key}
                      type="button"
                      onClick={() => onSelectBatch(batch)}
                      className={cn(
                        "w-full rounded-lg border border-border/70 bg-muted/20 p-3 text-left transition-colors hover:bg-muted",
                        active && "border-foreground bg-muted"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline">{getBatchVersionLabel(batch, assetVersionByChangeSetId)}</Badge>
                      </div>
                      <div className="mt-3 text-xs leading-5 text-muted-foreground">
                        {formatDateTime(batch.representative.applied_at ?? batch.representative.created_at)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="min-h-0 space-y-3 lg:overflow-hidden">
              <div className="flex items-center gap-2">
                <Layers3 className="size-5 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-base font-semibold">方案资产</h3>
              </div>
              <div className="space-y-2 lg:h-[calc(100%-2.5rem)] lg:overflow-y-auto lg:pr-2">
                <ChangeSetAssetList
                  batches={selectedBatch ? [selectedBatch] : []}
                  selectedChangeSetId={selectedChangeSet?.id ?? null}
                  assetVersionByChangeSetId={assetVersionByChangeSetId}
                  onSelect={onSelectChangeSet}
                  emptyText="暂无历史方案资产。"
                />
              </div>
            </section>

            <section className="min-h-0 space-y-3 lg:overflow-hidden">
              <div className="flex items-center gap-2">
                <FileJson className="size-5 text-muted-foreground" aria-hidden="true" />
                <h3 className="min-w-0 break-words text-base font-semibold">
                  {selectedChangeSet ? selectedChangeSet.title : "资产详情"}
                </h3>
              </div>
              <div className="space-y-4 lg:h-[calc(100%-2.5rem)] lg:overflow-y-auto lg:pr-2">
                <ChangeSetDetailPanel
                  changeSet={selectedChangeSet}
                  assetVersionByChangeSetId={assetVersionByChangeSetId}
                />
              </div>
            </section>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function ChangeSetsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [changeSets, setChangeSets] = useState<ChangeSet[]>([]);
  const [selectedChangeSetId, setSelectedChangeSetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingBatchKey, setApplyingBatchKey] = useState<string | null>(null);
  const [applicationProgress, setApplicationProgress] = useState<GenerationRun | null>(null);
  const [applicationProgressBatchKey, setApplicationProgressBatchKey] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyChangeSets, setHistoryChangeSets] = useState<ChangeSet[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [selectedHistoryBatchKey, setSelectedHistoryBatchKey] = useState<string | null>(null);
  const [selectedHistoryChangeSetId, setSelectedHistoryChangeSetId] = useState<string | null>(null);
  const wasWatchingStoryExecutionRef = useRef(false);

  const sortedChangeSets = useMemo(() => sortChangeSets(changeSets), [changeSets]);
  const currentChangeSets = useMemo(
    () => sortCurrentChangeSets(sortedChangeSets.filter(isCurrentChangeSet)),
    [sortedChangeSets]
  );
  const currentBatches = useMemo(
    () => groupChangeSetsByBatch(currentChangeSets),
    [currentChangeSets]
  );
  const historyBatches = useMemo(
    () => groupChangeSetsByBatch(historyChangeSets),
    [historyChangeSets]
  );
  const knownChangeSets = useMemo(() => {
    const byId = new Map<string, ChangeSet>();
    for (const changeSet of [...changeSets, ...historyChangeSets]) {
      byId.set(changeSet.id, changeSet);
    }
    return [...byId.values()];
  }, [changeSets, historyChangeSets]);
  const assetVersionByChangeSetId = useMemo(() => buildAssetVersionMap(knownChangeSets), [knownChangeSets]);
  const selectedChangeSet =
    currentChangeSets.find((changeSet) => changeSet.id === selectedChangeSetId) ??
    currentChangeSets[0] ??
    null;
  const selectedBatch =
    currentBatches.find((batch) => batch.key === (selectedChangeSet ? getBatchKey(selectedChangeSet) : null)) ??
    currentBatches[0] ??
    null;
  const selectedCanApply = canApplyBatch(selectedBatch);

  const loadChangeSets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = sortChangeSets(await listChangeSets(projectId));
      const currentData = sortCurrentChangeSets(data.filter(isCurrentChangeSet));
      setChangeSets(data);
      setSelectedChangeSetId((current) =>
        current && currentData.some((changeSet) => changeSet.id === current)
          ? current
          : currentData[0]?.id ?? null
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载变更集失败");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshChangeSets = async () => {
    try {
      const data = sortChangeSets(await listChangeSets(projectId));
      const currentData = sortCurrentChangeSets(data.filter(isCurrentChangeSet));
      setChangeSets(data);
      setSelectedChangeSetId((current) =>
        current && currentData.some((changeSet) => changeSet.id === current)
          ? current
          : currentData[0]?.id ?? null
      );
    } catch {
      // Keep the current view usable during background refresh; the next poll retries.
    }
  };

  const loadApplicationHistory = async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const data = sortChangeSets(await listChangeSets(projectId));
      const history = data.filter(isAppliedChangeSet);
      setHistoryChangeSets(history);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : "加载历史应用记录失败");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleToggleHistory = () => {
    const nextOpen = !historyOpen;
    setHistoryOpen(nextOpen);
    if (nextOpen && !historyLoading) {
      void loadApplicationHistory();
    }
  };

  const handleSelectHistoryBatch = (batch: ChangeSetBatch) => {
    setSelectedHistoryBatchKey(batch.key);
    setSelectedHistoryChangeSetId(batch.changeSets[0]?.id ?? null);
  };

  const pollApplyRun = async (initialRun: GenerationRun) => {
    let currentRun = initialRun;
    setApplicationProgress(currentRun);

    for (let attempt = 0; attempt < GENERATION_RUN_MAX_POLLS; attempt += 1) {
      if (COMPLETED_RUN_STATUSES.has(currentRun.status)) {
        return currentRun;
      }

      if (FAILED_RUN_STATUSES.has(currentRun.status)) {
        throw new Error(currentRun.error_message || currentRun.message || "应用变更集失败");
      }

      await sleep(GENERATION_RUN_POLL_INTERVAL_MS);
      currentRun = await getGenerationRun(initialRun.id);
      setApplicationProgress(currentRun);
    }

    throw new Error("应用变更集超时，请稍后刷新变更集列表");
  };

  const handleApplySelectedBatch = async () => {
    if (!selectedBatch || !selectedCanApply) {
      return;
    }

    setApplyingBatchKey(selectedBatch.key);
    setApplicationProgressBatchKey(selectedBatch.key);
    setApplicationProgress(null);
    setApplyError(null);
    try {
      const queuedRun = selectedBatch.batchId
        ? await applyChangeSetBatch(projectId, selectedBatch.batchId)
        : await applyChangeSet(selectedBatch.representative.id);
      await pollApplyRun(queuedRun);
      await loadChangeSets();
      if (historyOpen) {
        await loadApplicationHistory();
      }
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : "应用变更集失败");
    } finally {
      setApplyingBatchKey(null);
    }
  };

  const restoreApplicationProgress = async (availableChangeSets: ChangeSet[]) => {
    try {
      const runs = await listActiveChangeSetApplicationRuns(projectId);
      const activeRun = runs[0];

      if (!activeRun) {
        return;
      }

      const changeSetId =
        typeof activeRun.queue_payload?.change_set_id === "string"
          ? activeRun.queue_payload.change_set_id
          : typeof activeRun.input_snapshot?.change_set_id === "string"
            ? activeRun.input_snapshot.change_set_id
            : null;
      const relatedChangeSet = availableChangeSets.find((changeSet) => changeSet.id === changeSetId);
      const batchKey =
        (relatedChangeSet ? getBatchKey(relatedChangeSet) : null) ??
        (typeof activeRun.queue_payload?.batch_id === "string"
          ? activeRun.queue_payload.batch_id
          : typeof activeRun.input_snapshot?.batch_id === "string"
            ? activeRun.input_snapshot.batch_id
            : changeSetId);

      setApplicationProgressBatchKey(batchKey);
      setApplyingBatchKey(batchKey);
      await pollApplyRun(activeRun);
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : "恢复应用进度失败");
      setApplyingBatchKey(null);
    }
  };

  const refreshStoryExecutionState = async () => {
    try {
      const stories = await listBusinessStories(projectId);
      const executionRunIds = stories
        .map((story) => story.execution_generation_run_id)
        .filter((runId): runId is string => Boolean(runId));

      if (executionRunIds.length === 0) {
        if (wasWatchingStoryExecutionRef.current) {
          await refreshChangeSets();
        }
        wasWatchingStoryExecutionRef.current = false;
        return;
      }

      const runs = await Promise.all(
        executionRunIds.map(async (runId) => {
          try {
            return await getGenerationRun(runId);
          } catch {
            return null;
          }
        })
      );
      const hasActiveRun = runs.some(
        (run): run is GenerationRun =>
          run !== null && !COMPLETED_RUN_STATUSES.has(run.status) && !FAILED_RUN_STATUSES.has(run.status)
      );

      if (hasActiveRun || wasWatchingStoryExecutionRef.current) {
        await refreshChangeSets();
      }
      wasWatchingStoryExecutionRef.current = hasActiveRun;
    } catch {
      wasWatchingStoryExecutionRef.current = false;
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void (async () => {
        const loadedChangeSets = await loadChangeSets();
        await restoreApplicationProgress(loadedChangeSets ?? []);
      })();
    }, 0);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    let disposed = false;

    const poll = async () => {
      if (disposed) {
        return;
      }

      await refreshStoryExecutionState();
    };

    void poll();
    const timer = window.setInterval(() => {
      void poll();
    }, GENERATION_RUN_POLL_INTERVAL_MS);

    return () => {
      disposed = true;
      window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="relative space-y-6 lg:flex lg:h-full lg:min-h-0 lg:flex-1 lg:flex-col">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-expanded={historyOpen}
          onClick={handleToggleHistory}
        >
          <History className="size-4" aria-hidden="true" />
          历史应用记录
        </Button>
      </div>
      {loading ? <LoadingState label="正在加载变更集..." /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadChangeSets} /> : null}
      {!loading && !error ? (
        <div className="grid gap-4 lg:h-0 lg:min-h-0 lg:flex-1 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-stretch">
          <Card className="lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:overflow-hidden">
            <CardHeader className="gap-4">
              <CardTitle className="flex items-center gap-2">
                <Layers3 className="size-5 text-muted-foreground" aria-hidden="true" />
                方案资产
              </CardTitle>
              {selectedBatch ? (
                <div className="pt-3 pb-8">
                  <Button
                    type="button"
                    size="sm"
                    className="w-full"
                    disabled={!selectedCanApply || applyingBatchKey === selectedBatch.key}
                    onClick={() => void handleApplySelectedBatch()}
                  >
                    {applyingBatchKey === selectedBatch.key ? "应用中..." : "应用"}
                  </Button>
                  {applicationProgressBatchKey === selectedBatch.key && applicationProgress ? (
                    <ChangeSetApplicationProgress run={applicationProgress} />
                  ) : null}
                </div>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-4">
              <ChangeSetAssetList
                batches={currentBatches}
                selectedChangeSetId={selectedChangeSet?.id ?? null}
                assetVersionByChangeSetId={assetVersionByChangeSetId}
                onSelect={setSelectedChangeSetId}
                emptyText="暂无方案资产，请先从敏捷业务需求池生成变更集。"
              />
            </CardContent>
          </Card>

          <Card className="lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:overflow-hidden">
            <CardHeader className="gap-4 pb-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <CardTitle className="flex min-w-0 items-center gap-2">
                  <FileJson className="size-5 text-muted-foreground" aria-hidden="true" />
                  <span className="min-w-0 break-words">
                    {selectedChangeSet ? selectedChangeSet.title : "资产详情"}
                  </span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-4">
              <ChangeSetDetailPanel
                changeSet={selectedChangeSet}
                assetVersionByChangeSetId={assetVersionByChangeSetId}
                applyError={applyError}
              />
            </CardContent>
          </Card>
        </div>
      ) : null}
      {historyOpen && typeof document !== "undefined"
        ? createPortal(
            <ApplicationHistoryCard
              batches={historyBatches}
              loading={historyLoading}
              error={historyError}
              assetVersionByChangeSetId={assetVersionByChangeSetId}
              selectedBatchKey={selectedHistoryBatchKey}
              selectedChangeSetId={selectedHistoryChangeSetId}
              onSelectBatch={handleSelectHistoryBatch}
              onSelectChangeSet={setSelectedHistoryChangeSetId}
              onClose={() => setHistoryOpen(false)}
              onRetry={() => {
                void loadApplicationHistory();
              }}
            />,
            document.body
          )
        : null}
    </div>
  );
}

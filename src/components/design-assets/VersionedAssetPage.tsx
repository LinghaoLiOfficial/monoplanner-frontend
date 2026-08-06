"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import { AssetHeader } from "@/components/design-assets/AssetHeader";
import { DiffSummary } from "@/components/design-assets/DiffSummary";
import { sortAssetsByVersion, VersionList } from "@/components/design-assets/VersionList";
import type { VersionedDesignAsset } from "@/lib/types/design-asset";

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function VersionedAssetPage<TAsset extends VersionedDesignAsset>({
  title,
  description,
  emptyDescription,
  sections,
  listAssets,
  action,
  renderContent,
}: {
  title: string;
  description: string;
  emptyDescription?: string;
  sections: Array<{ key: string; title: string }>;
  listAssets: (projectId: string) => Promise<TAsset[]>;
  action?: ReactNode;
  renderContent?: (asset: TAsset, content: Record<string, unknown>, sections: Array<{ key: string; title: string }>) => ReactNode;
}) {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [assets, setAssets] = useState<TAsset[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortedAssets = useMemo(() => sortAssetsByVersion(assets), [assets]);
  const selectedAsset = sortedAssets.find((asset) => asset.id === selectedId) ?? sortedAssets[0] ?? null;

  const loadAssets = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = sortAssetsByVersion(await listAssets(projectId));
      setAssets(data);
      setSelectedId((current) => current ?? data[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : `加载${title}失败`);
    } finally {
      if (!options?.silent) {
        setLoading(false);
      }
    }
  }, [listAssets, projectId, title]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAssets();
    const interval = window.setInterval(() => {
      void loadAssets({ silent: true });
    }, 3000);

    return () => window.clearInterval(interval);
  }, [loadAssets]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {action}
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}`}>返回工作台</Link>
          </Button>
        </div>
      </div>

      {loading ? <LoadingState label={`正在加载${title}...`} /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadAssets} /> : null}
      {!loading && !error ? (
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <VersionList assets={sortedAssets} selectedId={selectedAsset?.id ?? null} onSelect={setSelectedId} />
          <div className="space-y-4">
            <AssetHeader
              asset={selectedAsset}
              emptyTitle={`暂无${title}版本`}
              emptyDescription={emptyDescription}
            />
            {selectedAsset ? (
              <>
                {renderContent ? (
                  renderContent(selectedAsset, asRecord(selectedAsset.content), sections)
                ) : (
                  <AssetContentSections content={asRecord(selectedAsset.content)} sections={sections} />
                )}
                <DiffSummary diff={selectedAsset.diff_from_previous ?? asRecord(selectedAsset.content).diff} />
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

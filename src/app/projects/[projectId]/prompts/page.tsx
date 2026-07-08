"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ContextPackList } from "@/components/prompts/ContextPackList";
import { ContextPackViewer } from "@/components/prompts/ContextPackViewer";
import { ProjectWorkspaceNav } from "@/components/project/ProjectWorkspaceNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectBlueprints } from "@/lib/api/blueprints";
import { generateContextPacks, listContextPacks } from "@/lib/api/context-packs";
import type { ContextPack } from "@/lib/types/context-pack";

function sortPacks(packs: ContextPack[]) {
  return [...packs].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) || a.role.localeCompare(b.role));
}

export default function PromptsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [packs, setPacks] = useState<ContextPack[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasBlueprint, setHasBlueprint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sortedPacks = useMemo(() => sortPacks(packs), [packs]);
  const selectedPack = sortedPacks.find((pack) => pack.id === selectedId) ?? sortedPacks[0] ?? null;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [blueprints, packData] = await Promise.all([
        getProjectBlueprints(projectId),
        listContextPacks(projectId),
      ]);
      const sorted = sortPacks(packData);
      setHasBlueprint(blueprints.length > 0);
      setPacks(sorted);
      setSelectedId(sorted[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载 Context Packs 失败。");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateError(null);
    setSuccess(null);
    try {
      await generateContextPacks(projectId);
      await loadData();
      setSuccess("Context Packs 已生成。");
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "生成 Context Packs 失败。");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="space-y-6 pb-12">
      <ProjectWorkspaceNav projectId={projectId} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Context Packs</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Context Packs / Codex Prompts</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            查看不同工程角色的 Codex prompt_text，复制或导出 Markdown。
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/projects/${projectId}`}>返回工作台</Link>
        </Button>
      </div>

      {loading ? <LoadingState label="正在加载 Context Packs..." /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadData} /> : null}
      {!loading && !error && !hasBlueprint ? (
        <EmptyState
          icon={FileText}
          title="先生成 Project Blueprint"
          description="Context Packs 需要基于已有 Blueprint 生成。"
          action={<Button asChild><Link href={`/projects/${projectId}/blueprint`}>前往蓝图页</Link></Button>}
        />
      ) : null}
      {!loading && !error && hasBlueprint ? (
        <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Pack 列表</CardTitle>
              <CardDescription>选择角色查看 prompt_text 和 JSON 内容。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {generateError ? <ErrorState message={generateError} /> : null}
              {success ? <p className="text-sm text-muted-foreground">{success}</p> : null}
              <Button type="button" size="sm" onClick={handleGenerate} disabled={generating}>
                {generating ? "正在生成..." : "生成 Context Packs"}
              </Button>
              <ContextPackList packs={sortedPacks} selectedId={selectedPack?.id ?? null} onSelect={setSelectedId} />
            </CardContent>
          </Card>
          <ContextPackViewer pack={selectedPack} />
        </div>
      ) : null}
    </div>
  );
}

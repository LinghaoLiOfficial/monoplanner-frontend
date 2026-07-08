"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BlueprintViewer } from "@/components/blueprint/BlueprintViewer";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ProjectWorkspaceNav } from "@/components/project/ProjectWorkspaceNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateProjectBlueprint, getProjectBlueprints } from "@/lib/api/blueprints";
import type { ProjectBlueprint } from "@/lib/types/blueprint";

function sortBlueprints(blueprints: ProjectBlueprint[]) {
  return [...blueprints].sort((a, b) => b.version - a.version || Date.parse(b.created_at) - Date.parse(a.created_at));
}

export default function ProjectBlueprintPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [blueprints, setBlueprints] = useState<ProjectBlueprint[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const sortedBlueprints = useMemo(() => sortBlueprints(blueprints), [blueprints]);
  const selectedBlueprint = sortedBlueprints.find((blueprint) => blueprint.id === selectedId) ?? sortedBlueprints[0] ?? null;

  const loadBlueprints = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectBlueprints(projectId);
      const sorted = sortBlueprints(data);
      setBlueprints(sorted);
      setSelectedId(sorted[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载 blueprint 失败。");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      await generateProjectBlueprint(projectId);
      await loadBlueprints();
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "生成 blueprint 草案失败。");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadBlueprints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="space-y-6 pb-12">
      <ProjectWorkspaceNav projectId={projectId} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Blueprints</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Project Blueprint</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            查看该项目的所有 blueprint 版本，默认展示最新版本。
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/projects/${projectId}`}>返回工作台</Link>
        </Button>
      </div>

      {loading ? <LoadingState label="正在加载 blueprint..." /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadBlueprints} /> : null}
      {!loading && !error ? (
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>版本列表</CardTitle>
              <CardDescription>选择一个版本查看 JSON 内容。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {generateError ? <ErrorState message={generateError} /> : null}
              <Button type="button" size="sm" onClick={handleGenerate} disabled={generating}>
                {generating ? "正在生成..." : "生成蓝图草案"}
              </Button>
              {sortedBlueprints.length === 0 ? (
                <p className="text-sm leading-7 text-muted-foreground">当前项目还没有 blueprint。</p>
              ) : null}
              {sortedBlueprints.map((blueprint) => (
                <button
                  key={blueprint.id}
                  type="button"
                  onClick={() => setSelectedId(blueprint.id)}
                  className="flex w-full items-center justify-between rounded-2xl border border-border/60 bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-muted"
                >
                  <span className="font-medium">{blueprint.title}</span>
                  <Badge variant={blueprint.id === selectedBlueprint?.id ? "default" : "secondary"}>
                    v{blueprint.version}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>
          <BlueprintViewer blueprint={selectedBlueprint} />
        </div>
      ) : null}
    </div>
  );
}

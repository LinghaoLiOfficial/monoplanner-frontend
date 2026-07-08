"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Database } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { DbModelViewer } from "@/components/db-model/DbModelViewer";
import { ProjectWorkspaceNav } from "@/components/project/ProjectWorkspaceNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectBlueprints } from "@/lib/api/blueprints";
import { generateDbModel, listDbModels } from "@/lib/api/db-models";
import type { DbModelDraft } from "@/lib/types/db-model";

function sortModels(models: DbModelDraft[]) {
  return [...models].sort((a, b) => b.version - a.version || Date.parse(b.created_at) - Date.parse(a.created_at));
}

export default function DbModelPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [models, setModels] = useState<DbModelDraft[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasBlueprint, setHasBlueprint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sortedModels = useMemo(() => sortModels(models), [models]);
  const selectedModel = sortedModels.find((model) => model.id === selectedId) ?? sortedModels[0] ?? null;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [blueprints, modelData] = await Promise.all([
        getProjectBlueprints(projectId),
        listDbModels(projectId),
      ]);
      const sorted = sortModels(modelData);
      setHasBlueprint(blueprints.length > 0);
      setModels(sorted);
      setSelectedId(sorted[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载数据库模型失败。");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateError(null);
    setSuccess(null);
    try {
      await generateDbModel(projectId);
      await loadData();
      setSuccess("数据库模型草案已生成。");
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "生成数据库模型草案失败。");
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
          <p className="text-sm text-muted-foreground">Database Model</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">数据库模型草案</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            查看实体、字段、关系、索引和迁移说明草案。
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/projects/${projectId}`}>返回工作台</Link>
        </Button>
      </div>

      {loading ? <LoadingState label="正在加载数据库模型..." /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadData} /> : null}
      {!loading && !error && !hasBlueprint ? (
        <EmptyState
          icon={Database}
          title="先生成 Project Blueprint"
          description="数据库模型草案需要基于已有 Blueprint 生成。"
          action={<Button asChild><Link href={`/projects/${projectId}/blueprint`}>前往蓝图页</Link></Button>}
        />
      ) : null}
      {!loading && !error && hasBlueprint ? (
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>模型版本</CardTitle>
              <CardDescription>默认展示最新版本。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {generateError ? <ErrorState message={generateError} /> : null}
              {success ? <p className="text-sm text-muted-foreground">{success}</p> : null}
              <Button type="button" size="sm" onClick={handleGenerate} disabled={generating}>
                {generating ? "正在生成..." : "生成数据库模型草案"}
              </Button>
              {sortedModels.length === 0 ? <p className="text-sm leading-7 text-muted-foreground">当前项目还没有 DB model。</p> : null}
              {sortedModels.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedId(model.id)}
                  className="flex w-full items-center justify-between rounded-2xl border border-border/60 bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-muted"
                >
                  <span className="font-medium">{model.title}</span>
                  <Badge variant={model.id === selectedModel?.id ? "default" : "secondary"}>v{model.version}</Badge>
                </button>
              ))}
            </CardContent>
          </Card>
          <DbModelViewer model={selectedModel} />
        </div>
      ) : null}
    </div>
  );
}

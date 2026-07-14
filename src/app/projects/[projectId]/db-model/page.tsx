"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Database } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { SavedGenerationPanel } from "@/components/common/SavedGenerationPanel";
import { DbModelViewer } from "@/components/db-model/DbModelViewer";
import { ProjectWorkspaceNav } from "@/components/project/ProjectWorkspaceNav";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { listApiContracts } from "@/lib/api/api-contracts";
import { getProjectBlueprints } from "@/lib/api/blueprints";
import { generateDbModel, listDbModels } from "@/lib/api/db-models";
import { getGenerationErrorMessage } from "@/lib/api/generation-errors";
import type { DbModelDraft } from "@/lib/types/db-model";

function sortModels(models: DbModelDraft[]) {
  return [...models].sort((a, b) => b.version - a.version || Date.parse(b.created_at) - Date.parse(a.created_at));
}

export default function DbModelPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [models, setModels] = useState<DbModelDraft[]>([]);
  const [hasBlueprint, setHasBlueprint] = useState(false);
  const [hasApiContract, setHasApiContract] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortedModels = useMemo(() => sortModels(models), [models]);
  const selectedModel = sortedModels[0] ?? null;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [blueprints, modelData] = await Promise.all([
        getProjectBlueprints(projectId),
        listDbModels(projectId),
      ]);
      const contracts = blueprints.length > 0 ? await listApiContracts(projectId).catch(() => []) : [];
      const sorted = sortModels(modelData);
      setHasBlueprint(blueprints.length > 0);
      setHasApiContract(contracts.length > 0);
      setModels(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载数据库模型失败");
    } finally {
      setLoading(false);
    }
  };

  const refreshModels = async () => {
    const modelData = await listDbModels(projectId);
    setModels(sortModels(modelData));
  };

  const handleGenerateModel = async () => {
    await generateDbModel(projectId);
    await refreshModels();
    setError(null);
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
          <h1 className="text-3xl font-semibold tracking-tight">数据库模型草案</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            数据库模型会基于项目蓝图和 API 契约生成，用于约定实体、字段、关系、索引和迁移注意事项。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}`}>返回工作台</Link>
          </Button>
        </div>
      </div>

      {!loading && !error && hasBlueprint && !hasApiContract ? (
        <Alert>
          <AlertDescription>
            建议先生成 API 契约，数据库模型会更容易与接口字段保持一致。
          </AlertDescription>
        </Alert>
      ) : null}

      <SavedGenerationPanel
        buttonLabel="生成数据库模型"
        loadingLabel="正在生成数据库模型，请稍候..."
        successLabel="数据库模型已生成。"
        description="后端会流式读取大模型输出，并在完成后保存为数据库模型。后端正在调用大模型并保存结果，生成可能需要一些时间。"
        disabled={!hasBlueprint}
        onGenerate={handleGenerateModel}
        formatError={(err) => getGenerationErrorMessage(err, "数据库模型")}
      />
      {loading ? <LoadingState label="正在加载数据库模型..." /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadData} /> : null}
      {!loading && !error && !hasBlueprint ? (
        <EmptyState
          icon={Database}
          title="先生成 Project Blueprint"
          description="请先生成项目蓝图，再生成数据库模型。"
          action={<Button asChild><Link href={`/projects/${projectId}/blueprint`}>前往蓝图页</Link></Button>}
        />
      ) : null}
      {!loading && !error && hasBlueprint ? (
        <DbModelViewer model={selectedModel} />
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Code2 } from "lucide-react";

import { ApiContractViewer } from "@/components/contract/ApiContractViewer";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { SavedGenerationPanel } from "@/components/common/SavedGenerationPanel";
import { ProjectWorkspaceNav } from "@/components/project/ProjectWorkspaceNav";
import { Button } from "@/components/ui/button";
import { generateApiContract, listApiContracts } from "@/lib/api/api-contracts";
import { getProjectBlueprints } from "@/lib/api/blueprints";
import { getGenerationErrorMessage } from "@/lib/api/generation-errors";
import type { ApiContractDraft } from "@/lib/types/api-contract";

function sortContracts(contracts: ApiContractDraft[]) {
  return [...contracts].sort((a, b) => b.version - a.version || Date.parse(b.created_at) - Date.parse(a.created_at));
}

export default function ApiContractPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [contracts, setContracts] = useState<ApiContractDraft[]>([]);
  const [hasBlueprint, setHasBlueprint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortedContracts = useMemo(() => sortContracts(contracts), [contracts]);
  const selectedContract = sortedContracts[0] ?? null;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [blueprints, contractData] = await Promise.all([
        getProjectBlueprints(projectId),
        listApiContracts(projectId),
      ]);
      const sorted = sortContracts(contractData);
      setHasBlueprint(blueprints.length > 0);
      setContracts(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载 API 契约失败");
    } finally {
      setLoading(false);
    }
  };

  const refreshContracts = async () => {
    const contractData = await listApiContracts(projectId);
    setContracts(sortContracts(contractData));
  };

  const handleGenerateContract = async () => {
    await generateApiContract(projectId);
    await refreshContracts();
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
          <h1 className="text-3xl font-semibold tracking-tight">API 契约草案</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            API 契约会基于项目蓝图生成，用于约定前端与后端之间的接口路径、请求体、响应体和错误模型。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}`}>返回工作台</Link>
          </Button>
        </div>
      </div>

      <SavedGenerationPanel
        buttonLabel="生成 API 契约"
        loadingLabel="正在生成 API 契约，请稍候..."
        successLabel="API 契约已生成。"
        description="后端会流式读取大模型输出，并在完成后保存为 API 契约。后端正在调用大模型并保存结果，生成可能需要一些时间。"
        disabled={!hasBlueprint}
        onGenerate={handleGenerateContract}
        formatError={(err) => getGenerationErrorMessage(err, "API 契约")}
      />
      {loading ? <LoadingState label="正在加载 API 契约..." /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadData} /> : null}
      {!loading && !error && !hasBlueprint ? (
        <EmptyState
          icon={Code2}
          title="先生成 Project Blueprint"
          description="请先生成项目蓝图，再生成 API 契约。"
          action={<Button asChild><Link href={`/projects/${projectId}/blueprint`}>前往蓝图页</Link></Button>}
        />
      ) : null}
      {!loading && !error && hasBlueprint ? (
        <ApiContractViewer contract={selectedContract} />
      ) : null}
    </div>
  );
}

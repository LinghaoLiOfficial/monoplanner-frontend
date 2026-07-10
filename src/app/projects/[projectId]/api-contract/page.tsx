"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Code2 } from "lucide-react";

import { ApiContractViewer } from "@/components/contract/ApiContractViewer";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ProjectWorkspaceNav } from "@/components/project/ProjectWorkspaceNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateApiContract, listApiContracts } from "@/lib/api/api-contracts";
import { getProjectBlueprints } from "@/lib/api/blueprints";
import type { ApiContractDraft } from "@/lib/types/api-contract";

function sortContracts(contracts: ApiContractDraft[]) {
  return [...contracts].sort((a, b) => b.version - a.version || Date.parse(b.created_at) - Date.parse(a.created_at));
}

export default function ApiContractPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [contracts, setContracts] = useState<ApiContractDraft[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasBlueprint, setHasBlueprint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sortedContracts = useMemo(() => sortContracts(contracts), [contracts]);
  const selectedContract = sortedContracts.find((contract) => contract.id === selectedId) ?? sortedContracts[0] ?? null;

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
      setSelectedId(sorted[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载 API 契约失败");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateError(null);
    setSuccess(null);
    try {
      await generateApiContract(projectId);
      await loadData();
      setSuccess("API 契约草案已生成");
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "生成 API 契约草案失败");
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
          <h1 className="text-3xl font-semibold tracking-tight">API 契约草案</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            基于 Project Blueprint 查看和生成接口资源、endpoint、schema 草案
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/projects/${projectId}`}>返回工作台</Link>
        </Button>
      </div>

      {loading ? <LoadingState label="正在加载 API 契约..." /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadData} /> : null}
      {!loading && !error && !hasBlueprint ? (
        <EmptyState
          icon={Code2}
          title="先生成 Project Blueprint"
          description="API 契约草案需要基于已有 Blueprint 生成"
          action={<Button asChild><Link href={`/projects/${projectId}/blueprint`}>前往蓝图页</Link></Button>}
        />
      ) : null}
      {!loading && !error && hasBlueprint ? (
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>契约版本</CardTitle>
              <CardDescription>默认展示最新版本</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {generateError ? <ErrorState message={generateError} /> : null}
              {success ? <p className="text-sm text-muted-foreground">{success}</p> : null}
              <Button type="button" size="sm" onClick={handleGenerate} disabled={generating}>
                {generating ? "正在生成..." : "生成 API 契约草案"}
              </Button>
              {sortedContracts.length === 0 ? <p className="text-sm leading-7 text-muted-foreground">当前项目还没有 API contract</p> : null}
              {sortedContracts.map((contract) => (
                <button
                  key={contract.id}
                  type="button"
                  onClick={() => setSelectedId(contract.id)}
                  className="flex w-full items-center justify-between rounded-2xl border border-border/60 bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-muted"
                >
                  <span className="font-medium">{contract.title}</span>
                  <Badge variant={contract.id === selectedContract?.id ? "default" : "secondary"}>v{contract.version}</Badge>
                </button>
              ))}
            </CardContent>
          </Card>
          <ApiContractViewer contract={selectedContract} />
        </div>
      ) : null}
    </div>
  );
}

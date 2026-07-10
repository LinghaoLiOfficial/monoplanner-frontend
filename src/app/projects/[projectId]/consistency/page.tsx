"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ConsistencyCheckPanel } from "@/components/consistency/ConsistencyCheckPanel";
import { ProjectWorkspaceNav } from "@/components/project/ProjectWorkspaceNav";
import { Button } from "@/components/ui/button";
import { getProjectBlueprints } from "@/lib/api/blueprints";
import { getConsistencyCheck } from "@/lib/api/consistency";
import type { ConsistencyCheck } from "@/lib/types/consistency";

export default function ConsistencyPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [check, setCheck] = useState<ConsistencyCheck | null>(null);
  const [hasBlueprint, setHasBlueprint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const blueprints = await getProjectBlueprints(projectId);
      setHasBlueprint(blueprints.length > 0);
      if (blueprints.length > 0) {
        setCheck(await getConsistencyCheck(projectId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载一致性检查失败");
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async () => {
    setChecking(true);
    setError(null);
    try {
      setCheck(await getConsistencyCheck(projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "运行一致性检查失败");
    } finally {
      setChecking(false);
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
          <h1 className="text-3xl font-semibold tracking-tight">一致性检查</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            检查 Blueprint、API 契约、数据库模型和 Context Packs 的一致性
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleCheck} disabled={checking || !hasBlueprint}>
            {checking ? "正在检查..." : "重新检查"}
          </Button>
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}`}>返回工作台</Link>
          </Button>
        </div>
      </div>

      {loading ? <LoadingState label="正在加载一致性检查..." /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadData} /> : null}
      {!loading && !error && !hasBlueprint ? (
        <EmptyState
          icon={ShieldCheck}
          title="先生成 Project Blueprint"
          description="一致性检查需要基于已有 Blueprint 运行"
          action={<Button asChild><Link href={`/projects/${projectId}/blueprint`}>前往蓝图页</Link></Button>}
        />
      ) : null}
      {!loading && !error && hasBlueprint ? <ConsistencyCheckPanel check={check} /> : null}
    </div>
  );
}

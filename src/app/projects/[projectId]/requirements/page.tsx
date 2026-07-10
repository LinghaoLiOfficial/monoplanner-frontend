"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ProjectWorkspaceNav } from "@/components/project/ProjectWorkspaceNav";
import { RequirementEditor } from "@/components/requirement/RequirementEditor";
import { RequirementList } from "@/components/requirement/RequirementList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createProjectRequirement, getProjectRequirements } from "@/lib/api/requirements";
import type { Requirement } from "@/lib/types/requirement";

export default function ProjectRequirementsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequirements = async () => {
    setLoading(true);
    setError(null);
    try {
      setRequirements(await getProjectRequirements(projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载需求历史失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRequirement = async (rawText: string) => {
    const requirement = await createProjectRequirement(projectId, {
      raw_text: rawText,
      language: "zh-CN",
      source_type: "manual",
    });
    await loadRequirements();
    return requirement;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRequirements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="space-y-6 pb-12">
      <ProjectWorkspaceNav projectId={projectId} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">原始用户需求</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            查看当前项目的需求记录，也可以继续追加新的自然语言需求
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/projects/${projectId}`}>返回工作台</Link>
        </Button>
      </div>

      <div className="space-y-4">
        <RequirementEditor title="新用户需求" hideLabel submitButton="icon" onSave={handleSaveRequirement} />
        <Card>
          <CardHeader>
            <CardTitle>用户需求历史</CardTitle>
            <CardDescription>每条需求展示文本摘要、语言、来源和创建时间</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <LoadingState label="正在加载需求..." /> : null}
            {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadRequirements} /> : null}
            {!loading && !error ? <RequirementList requirements={requirements} /> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

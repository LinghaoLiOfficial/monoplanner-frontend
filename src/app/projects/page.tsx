"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ProjectList } from "@/components/project/ProjectList";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/lib/api/projects";
import type { Project } from "@/lib/types/project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      setProjects(await getProjects());
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载项目列表失败。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProjects();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Projects</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">项目列表</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            管理业务项目，进入工作台录入需求并生成 Project Blueprint JSON 草案。
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">新建项目</Link>
        </Button>
      </div>

      {loading ? <LoadingState label="正在加载项目列表..." /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadProjects} /> : null}
      {!loading && !error ? <ProjectList projects={projects} /> : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ProjectList } from "@/components/project/ProjectList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteProject, listProjects } from "@/lib/api/projects";
import type { Project } from "@/lib/types/project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadProjects = useCallback(async (keyword: string) => {
    setLoading(true);
    setError(null);
    try {
      setProjects(await listProjects(keyword));
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载我的项目失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProjects(search);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [loadProjects, search]);

  const handleOpenDelete = (project: Project) => {
    setProjectToDelete(project);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete || deleteLoading) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await deleteProject(projectToDelete.id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "删除项目失败");
      setDeleteLoading(false);
      return;
    }

    setProjectToDelete(null);
    setDeleteLoading(false);
    await loadProjects(search);
  };

  const trimmedSearch = search.trim();
  const hasSearch = trimmedSearch.length > 0;
  const loadingLabel = hasSearch ? "正在搜索项目..." : "正在加载我的项目...";

  return (
    <div className="mt-5 space-y-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">我的项目</h1>
        </div>
        <div className="flex w-full flex-wrap items-start gap-3 sm:w-auto">
          <div className="w-full sm:w-72">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="搜索项目名称..."
              aria-label="搜索项目名称"
            />
            {loading && hasSearch ? (
              <p className="mt-2 text-sm text-muted-foreground">正在搜索...</p>
            ) : null}
          </div>
          <Button asChild>
            <Link href="/projects/new">新建项目</Link>
          </Button>
        </div>
      </div>

      {loading ? <LoadingState label={loadingLabel} /> : null}
      {!loading && error ? (
        <ErrorState
          message={error}
          actionLabel="重新加载"
          onAction={() => void loadProjects(search)}
        />
      ) : null}
      {!loading && !error ? (
        <ProjectList
          projects={projects}
          hasSearch={hasSearch}
          onDeleteProject={handleOpenDelete}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(projectToDelete)}
        title="确认删除项目？"
        description="删除后，该项目的需求、蓝图、API 契约、数据库模型和 Context Packs 都会被一并删除此操作不可撤销"
        confirmText="确认删除"
        cancelText="取消"
        loading={deleteLoading}
        destructive
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onOpenChange={(open) => {
          if (!open) {
            setProjectToDelete(null);
            setDeleteError(null);
          }
        }}
      />
    </div>
  );
}

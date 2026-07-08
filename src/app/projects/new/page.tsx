"use client";

import { useRouter } from "next/navigation";

import { ProjectForm } from "@/components/project/ProjectForm";
import { createProject } from "@/lib/api/projects";
import type { CreateProjectPayload } from "@/lib/types/project";

export default function NewProjectPage() {
  const router = useRouter();

  const handleSubmit = async (payload: CreateProjectPayload) => {
    const project = await createProject(payload);
    router.push(`/projects/${project.id}`);
    return project;
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="text-sm text-muted-foreground">New Project</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">创建项目</h1>
      </div>
      <ProjectForm onSubmit={handleSubmit} />
    </div>
  );
}

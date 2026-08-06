"use client";

import { useParams } from "next/navigation";
import type { ReactNode } from "react";

import { ProjectWorkspaceShell } from "@/components/project/ProjectWorkspaceShell";

export default function ProjectDetailLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ projectId: string }>();

  return <ProjectWorkspaceShell projectId={params.projectId}>{children}</ProjectWorkspaceShell>;
}

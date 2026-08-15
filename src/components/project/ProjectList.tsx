import { FolderPlus } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/common/EmptyState";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types/project";

type ProjectListProps = {
  projects: Project[];
  hasSearch?: boolean;
  onDeleteProject?: (project: Project) => void;
};

export function ProjectList({
  projects,
  hasSearch = false,
  onDeleteProject,
}: ProjectListProps) {
  if (projects.length === 0) {
    if (hasSearch) {
      return <EmptyState title="无匹配项目" />;
    }

    return (
      <EmptyState
        icon={FolderPlus}
        title="还没有项目"
        description="还没有项目，创建第一个项目开始编排你的web全栈程序"
        action={
          <Button asChild>
            <Link href="/projects/new">创建第一个项目</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={onDeleteProject}
        />
      ))}
    </div>
  );
}

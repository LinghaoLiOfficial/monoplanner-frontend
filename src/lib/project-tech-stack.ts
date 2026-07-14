import type { Project } from "@/lib/types/project";

type ProjectTechStackFields = Pick<Project, "target_stacks_configured">;

export function isProjectTechStackConfigured(project: ProjectTechStackFields) {
  return project.target_stacks_configured;
}

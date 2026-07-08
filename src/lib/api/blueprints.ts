import { apiRequest } from "@/lib/api/client";
import type { ProjectBlueprint } from "@/lib/types/blueprint";

export function generateProjectBlueprint(projectId: string) {
  return apiRequest<ProjectBlueprint>(`/projects/${projectId}/generate/blueprint`, {
    method: "POST",
  });
}

export function getProjectBlueprints(projectId: string) {
  return apiRequest<ProjectBlueprint[]>(`/projects/${projectId}/blueprints`);
}

export function getBlueprint(blueprintId: string) {
  return apiRequest<ProjectBlueprint>(`/blueprints/${blueprintId}`);
}

import { apiRequest } from "@/lib/api/client";
import { streamPost } from "@/lib/api/streaming";
import type { ProjectBlueprint } from "@/lib/types/blueprint";
import type { StreamEvent } from "@/lib/types/streaming";

export function generateProjectBlueprint(projectId: string) {
  return apiRequest<ProjectBlueprint>(`/projects/${projectId}/generate/blueprint`, {
    method: "POST",
  });
}

export function streamGenerateProjectBlueprint(
  projectId: string,
  {
    onEvent,
    signal,
  }: {
    onEvent: (event: StreamEvent) => void;
    signal?: AbortSignal;
  }
) {
  return streamPost({
    path: `/projects/${projectId}/generate/blueprint/stream`,
    onEvent,
    signal,
  });
}

export function getProjectBlueprints(projectId: string) {
  return apiRequest<ProjectBlueprint[]>(`/projects/${projectId}/blueprints`);
}

export function getBlueprint(blueprintId: string) {
  return apiRequest<ProjectBlueprint>(`/blueprints/${blueprintId}`);
}

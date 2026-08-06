import { apiRequest } from "@/lib/api/client";
import type { FrontendPageStructure } from "@/lib/types/frontend-page-structure";

export function listFrontendPageStructures(projectId: string) {
  return apiRequest<FrontendPageStructure[]>(`/projects/${projectId}/frontend-page-structures`);
}

export function getFrontendPageStructure(id: string) {
  return apiRequest<FrontendPageStructure>(`/frontend-page-structures/${id}`);
}

export function updateFrontendPageStructure(id: string, input: Partial<FrontendPageStructure>) {
  return apiRequest<FrontendPageStructure>(`/frontend-page-structures/${id}`, {
    method: "PATCH",
    body: input,
  });
}

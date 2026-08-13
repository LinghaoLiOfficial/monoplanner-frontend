import { apiRequest } from "@/lib/api/client";
import type { FrontendPageStructure } from "@/lib/types/frontend-page-structure";
import type { FrontendImplementation } from "@/lib/types/frontend-implementation";

export function listFrontendImplementationVersions(projectId: string) {
  return apiRequest<FrontendImplementation[]>(`/projects/${projectId}/frontend-implementations`);
}

export function listFrontendPageStructures(projectId: string) {
  return listFrontendImplementationVersions(projectId);
}

export function listFrontendImplementations(projectId: string) {
  return listFrontendImplementationVersions(projectId);
}

export function getFrontendImplementationVersion(id: string) {
  return apiRequest<FrontendImplementation>(`/frontend-implementations/${id}`);
}

export function getFrontendPageStructure(id: string) {
  return apiRequest<FrontendPageStructure>(`/frontend-page-structures/${id}`);
}

export function getFrontendImplementation(id: string) {
  return getFrontendImplementationVersion(id);
}

export function updateFrontendPageStructure(id: string, input: Partial<FrontendPageStructure>) {
  return apiRequest<FrontendPageStructure>(`/frontend-page-structures/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function updateFrontendImplementationVersion(id: string, input: Partial<FrontendImplementation>) {
  return apiRequest<FrontendImplementation>(`/frontend-implementations/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function updateFrontendImplementation(id: string, input: Partial<FrontendImplementation>) {
  return updateFrontendImplementationVersion(id, input);
}

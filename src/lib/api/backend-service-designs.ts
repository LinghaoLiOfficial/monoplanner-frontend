import { apiRequest } from "@/lib/api/client";
import type { BackendImplementation } from "@/lib/types/backend-implementation";
import type { BackendServiceDesign } from "@/lib/types/backend-service-design";

export function listBackendImplementationVersions(projectId: string) {
  return apiRequest<BackendImplementation[]>(`/projects/${projectId}/backend-implementations`);
}

export function listBackendServiceDesigns(projectId: string) {
  return listBackendImplementationVersions(projectId);
}

export function listBackendImplementations(projectId: string) {
  return listBackendImplementationVersions(projectId);
}

export function getBackendImplementationVersion(id: string) {
  return apiRequest<BackendImplementation>(`/backend-implementations/${id}`);
}

export function getBackendServiceDesign(id: string) {
  return getBackendImplementationVersion(id);
}

export function getBackendImplementation(id: string) {
  return getBackendImplementationVersion(id);
}

export function updateBackendServiceDesign(id: string, input: Partial<BackendServiceDesign>) {
  return apiRequest<BackendServiceDesign>(`/backend-service-designs/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function updateBackendImplementationVersion(id: string, input: Partial<BackendImplementation>) {
  return apiRequest<BackendImplementation>(`/backend-implementations/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function updateBackendImplementation(id: string, input: Partial<BackendImplementation>) {
  return updateBackendImplementationVersion(id, input);
}

import { apiRequest } from "@/lib/api/client";
import type { BackendServiceDesign } from "@/lib/types/backend-service-design";

export function listBackendServiceDesigns(projectId: string) {
  return apiRequest<BackendServiceDesign[]>(`/projects/${projectId}/backend-service-designs`);
}

export function getBackendServiceDesign(id: string) {
  return apiRequest<BackendServiceDesign>(`/backend-service-designs/${id}`);
}

export function updateBackendServiceDesign(id: string, input: Partial<BackendServiceDesign>) {
  return apiRequest<BackendServiceDesign>(`/backend-service-designs/${id}`, {
    method: "PATCH",
    body: input,
  });
}

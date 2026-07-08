import { apiRequest } from "@/lib/api/client";
import type { CreateRequirementPayload, Requirement } from "@/lib/types/requirement";

export function getProjectRequirements(projectId: string) {
  return apiRequest<Requirement[]>(`/projects/${projectId}/requirements`);
}

export function createProjectRequirement(projectId: string, payload: CreateRequirementPayload) {
  return apiRequest<Requirement>(`/projects/${projectId}/requirements`, {
    method: "POST",
    body: payload,
  });
}

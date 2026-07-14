import { apiRequest } from "@/lib/api/client";
import type {
  BusinessStoryGenerationProgress,
  CreateRequirementPayload,
  Requirement,
} from "@/lib/types/requirement";

export function getProjectRequirements(projectId: string) {
  return apiRequest<Requirement[]>(`/projects/${projectId}/requirements`);
}

export function createProjectRequirement(projectId: string, payload: CreateRequirementPayload) {
  return apiRequest<Requirement>(`/projects/${projectId}/requirements`, {
    method: "POST",
    body: payload,
  });
}

export function getRequirementBusinessStoryGeneration(requirementId: string) {
  return apiRequest<BusinessStoryGenerationProgress | null>(
    `/requirements/${requirementId}/business-story-generation`
  );
}

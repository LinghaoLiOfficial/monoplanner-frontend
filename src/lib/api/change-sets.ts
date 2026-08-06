import { apiRequest } from "@/lib/api/client";
import type { ChangeSet } from "@/lib/types/change-set";
import type { GenerationRun } from "@/lib/types/generation-run";

export function listChangeSets(projectId: string) {
  return apiRequest<ChangeSet[]>(`/projects/${projectId}/change-sets`);
}

export function getChangeSet(changeSetId: string) {
  return apiRequest<ChangeSet>(`/change-sets/${changeSetId}`);
}

export function applyChangeSet(changeSetId: string) {
  return apiRequest<GenerationRun>(`/change-sets/${changeSetId}/apply`, {
    method: "POST",
  });
}

export function discardChangeSet(changeSetId: string) {
  return apiRequest<ChangeSet>(`/change-sets/${changeSetId}/discard`, {
    method: "POST",
  });
}

export function regenerateChangeSet(changeSetId: string) {
  return apiRequest<GenerationRun>(`/change-sets/${changeSetId}/regenerate`, {
    method: "POST",
  });
}

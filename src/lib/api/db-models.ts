import { apiRequest } from "@/lib/api/client";
import type { DbModelDraft } from "@/lib/types/db-model";

export function generateDbModel(projectId: string) {
  return apiRequest<DbModelDraft>(`/projects/${projectId}/generate/db-model`, {
    method: "POST",
  });
}

export function listDbModels(projectId: string) {
  return apiRequest<DbModelDraft[]>(`/projects/${projectId}/db-models`);
}

export function getDbModel(dbModelId: string) {
  return apiRequest<DbModelDraft>(`/db-models/${dbModelId}`);
}

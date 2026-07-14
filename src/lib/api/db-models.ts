import { apiRequest } from "@/lib/api/client";
import { streamPost } from "@/lib/api/streaming";
import type { DbModelDraft } from "@/lib/types/db-model";
import type { StreamEvent } from "@/lib/types/streaming";

export function generateDbModel(projectId: string) {
  return apiRequest<DbModelDraft>(`/projects/${projectId}/generate/db-model`, {
    method: "POST",
  });
}

export function streamGenerateDbModel(
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
    path: `/projects/${projectId}/generate/db-model/stream`,
    onEvent,
    signal,
  });
}

export function listDbModels(projectId: string) {
  return apiRequest<DbModelDraft[]>(`/projects/${projectId}/db-models`);
}

export function getDbModel(dbModelId: string) {
  return apiRequest<DbModelDraft>(`/db-models/${dbModelId}`);
}

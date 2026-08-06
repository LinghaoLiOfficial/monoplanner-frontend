import { apiRequest } from "@/lib/api/client";
import type { PromptPack } from "@/lib/types/prompt-pack";

export function listPromptPacks(projectId: string) {
  return apiRequest<PromptPack[]>(`/projects/${projectId}/prompt-packs`);
}

export function getPromptPack(id: string) {
  return apiRequest<PromptPack>(`/prompt-packs/${id}`);
}

export function updatePromptPack(id: string, input: Partial<PromptPack>) {
  return apiRequest<PromptPack>(`/prompt-packs/${id}`, {
    method: "PATCH",
    body: input,
  });
}

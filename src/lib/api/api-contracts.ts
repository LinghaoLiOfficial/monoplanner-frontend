import { apiRequest } from "@/lib/api/client";
import { streamPost } from "@/lib/api/streaming";
import type { ApiContractDraft } from "@/lib/types/api-contract";
import type { StreamEvent } from "@/lib/types/streaming";

export function generateApiContract(projectId: string) {
  return apiRequest<ApiContractDraft>(`/projects/${projectId}/generate/api-contract`, {
    method: "POST",
  });
}

export function streamGenerateApiContract(
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
    path: `/projects/${projectId}/generate/api-contract/stream`,
    onEvent,
    signal,
  });
}

export function listApiContracts(projectId: string) {
  return apiRequest<ApiContractDraft[]>(`/projects/${projectId}/api-contracts`);
}

export function getApiContract(apiContractId: string) {
  return apiRequest<ApiContractDraft>(`/api-contracts/${apiContractId}`);
}

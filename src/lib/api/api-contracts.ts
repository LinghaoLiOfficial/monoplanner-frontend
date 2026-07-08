import { apiRequest } from "@/lib/api/client";
import type { ApiContractDraft } from "@/lib/types/api-contract";

export function generateApiContract(projectId: string) {
  return apiRequest<ApiContractDraft>(`/projects/${projectId}/generate/api-contract`, {
    method: "POST",
  });
}

export function listApiContracts(projectId: string) {
  return apiRequest<ApiContractDraft[]>(`/projects/${projectId}/api-contracts`);
}

export function getApiContract(apiContractId: string) {
  return apiRequest<ApiContractDraft>(`/api-contracts/${apiContractId}`);
}

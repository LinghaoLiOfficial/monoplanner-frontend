import { apiRequest } from "@/lib/api/client";
import type { UXDesign } from "@/lib/types/ux-design";

type UpdateDesignAssetInput = {
  title?: string;
  summary?: string | null;
  content?: unknown;
};

export function listUXDesigns(projectId: string) {
  return apiRequest<UXDesign[]>(`/projects/${projectId}/ux-designs`);
}

export function getUXDesign(uxDesignId: string) {
  return apiRequest<UXDesign>(`/ux-designs/${uxDesignId}`);
}

export function updateUXDesign(uxDesignId: string, input: UpdateDesignAssetInput) {
  return apiRequest<UXDesign>(`/ux-designs/${uxDesignId}`, {
    method: "PATCH",
    body: input,
  });
}

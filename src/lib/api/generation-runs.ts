import { apiRequest } from "@/lib/api/client";
import type { GenerationRun } from "@/lib/types/generation-run";

export function getGenerationRun(runId: string) {
  return apiRequest<GenerationRun>(`/generation-runs/${runId}`);
}

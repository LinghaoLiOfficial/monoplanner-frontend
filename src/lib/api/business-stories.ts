import { apiRequest } from "@/lib/api/client";
import type {
  BusinessRequirementStory,
  BusinessStoryPriority,
  BusinessStoryStatus,
  GenerateBusinessStoriesInput,
  GenerateBusinessStoriesResponse,
  ImplementationScope,
  UpdateBusinessStoryInput,
} from "@/lib/types/business-story";
import type { GenerationRun } from "@/lib/types/generation-run";

type BusinessStoryFilters = {
  priority?: BusinessStoryPriority;
  status?: BusinessStoryStatus;
  implementation_scope?: ImplementationScope;
  q?: string;
  include_history?: boolean;
};

export function generateBusinessStories(
  projectId: string,
  input: GenerateBusinessStoriesInput = {}
) {
  const body: GenerateBusinessStoriesInput = {
    overwrite: input.overwrite ?? false,
  };

  if ("requirement_id" in input) {
    body.requirement_id = input.requirement_id;
  }

  return apiRequest<GenerateBusinessStoriesResponse>(
    `/projects/${projectId}/generate/business-stories`,
    {
      method: "POST",
      body,
    }
  );
}

export function listBusinessStories(projectId: string, filters?: BusinessStoryFilters) {
  return apiRequest<BusinessRequirementStory[]>(
    `/projects/${projectId}/business-stories`,
    {
      query: filters,
    }
  );
}

export function getBusinessStory(storyId: string) {
  return apiRequest<BusinessRequirementStory>(`/business-stories/${storyId}`);
}

export function updateBusinessStory(
  storyId: string,
  input: UpdateBusinessStoryInput
) {
  return apiRequest<BusinessRequirementStory>(`/business-stories/${storyId}`, {
    method: "PATCH",
    body: input,
  });
}

export function deleteBusinessStory(storyId: string) {
  return apiRequest<void>(`/business-stories/${storyId}`, {
    method: "DELETE",
  });
}

export function selectBusinessStory(storyId: string) {
  return apiRequest<BusinessRequirementStory>(`/business-stories/${storyId}/select`, {
    method: "POST",
  });
}

export function executeBusinessStory(storyId: string) {
  return apiRequest<GenerationRun>(`/business-stories/${storyId}/execute`, {
    method: "POST",
  });
}

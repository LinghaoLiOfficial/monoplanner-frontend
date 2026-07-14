import { apiRequest } from "@/lib/api/client";
import { streamPost } from "@/lib/api/streaming";
import type {
  BusinessRequirementStory,
  BusinessStoryPriority,
  BusinessStoryStatus,
  GenerateBusinessStoriesInput,
  GenerateBusinessStoriesResponse,
  UpdateBusinessStoryInput,
} from "@/lib/types/business-story";
import type { StreamEvent } from "@/lib/types/streaming";

type BusinessStoryFilters = {
  priority?: BusinessStoryPriority;
  status?: BusinessStoryStatus;
  q?: string;
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

export function streamGenerateBusinessStories(
  projectId: string,
  {
    input = {},
    onEvent,
    signal,
  }: {
    input?: GenerateBusinessStoriesInput;
    onEvent: (event: StreamEvent) => void;
    signal?: AbortSignal;
  }
) {
  const body: GenerateBusinessStoriesInput = {
    overwrite: input.overwrite ?? false,
  };

  if ("requirement_id" in input) {
    body.requirement_id = input.requirement_id;
  }

  return streamPost({
    path: `/projects/${projectId}/generate/business-stories/stream`,
    body,
    onEvent,
    signal,
  });
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

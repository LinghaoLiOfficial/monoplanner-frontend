import type { Requirement, RequirementProgressStatus } from "@/lib/types/requirement";

const PROGRESS_STATUS_LABELS: Record<RequirementProgressStatus, string> = {
  in_progress: "进行中",
  success: "成功",
  failed: "失败",
};

export function getRequirementProgressStatus(requirement: Requirement): RequirementProgressStatus {
  if (requirement.progress_status) {
    return requirement.progress_status;
  }

  if (requirement.business_story_generation?.status === "running") {
    return "in_progress";
  }

  if (requirement.business_story_generation?.status === "succeeded") {
    return "success";
  }

  return "failed";
}

export function getRequirementProgressStatusLabel(status: RequirementProgressStatus) {
  return PROGRESS_STATUS_LABELS[status];
}

export function stripTrailingProgressPunctuation(text: string) {
  return text.trim().replace(/[。.…]+$/g, "");
}

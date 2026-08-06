import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type UXBranchStatus = "success" | "error" | "blocked" | "empty" | "next_action";

export type UXWireframeRegion = {
  region_name: string;
  region_purpose: string;
  content_elements: string[];
};

export type UXScreen = {
  screen_name: string;
  screen_purpose: string;
  information_priority: string[];
  interaction_regions: UXWireframeRegion[];
};

export type UXFlowBranch = {
  branch_status: UXBranchStatus;
  branch_description: string;
  system_feedback: string;
};

export type UXFlowStep = {
  step_order: number;
  involved_elements: string[];
  user_action: string;
  system_feedback: string;
  branches: UXFlowBranch[];
};

export type UXBusinessFlow = {
  flow_name: string;
  flow_goal: string;
  primary_actor: string;
  preconditions: string[];
  steps: UXFlowStep[];
  ux_notes: string[];
};

export type NewUXDesignContent = {
  version_summary: string;
  low_fidelity_screen_structure: UXScreen[];
  business_flows: UXBusinessFlow[];
  diff: {
    added: unknown[];
    modified: unknown[];
    removed: unknown[];
  };
};

export type LegacyUXDesignContent = {
  version_summary: string;
  user_goals: Array<{
    goal_id: string;
    description: string;
    related_story_ids: string[];
  }>;
  user_flows: Array<{
    flow_id: string;
    name: string;
    entry_point: string;
    steps: Array<{
      step: number;
      user_action: string;
      system_feedback: string;
    }>;
    success_outcome: string;
    failure_outcome: string;
  }>;
  interaction_states: Array<{
    state: "idle" | "loading" | "success" | "error" | "empty" | "disabled" | string;
    description: string;
  }>;
  empty_states: Array<{
    target: string;
    message: string;
  }>;
  error_states: Array<{
    target: string;
    message: string;
    recovery_action?: string;
  }>;
  permission_experience?: Array<{
    role: string;
    experience: string;
  }>;
  accessibility_requirements: string[];
  diff: {
    added: unknown[];
    modified: unknown[];
    removed: unknown[];
  };
};

export type UXDesignContent = NewUXDesignContent | LegacyUXDesignContent;

export type UXDesign = VersionedDesignAsset<UXDesignContent>;

export function isNewUXDesignContent(content: UXDesignContent): content is NewUXDesignContent {
  return "low_fidelity_screen_structure" in content || "business_flows" in content;
}

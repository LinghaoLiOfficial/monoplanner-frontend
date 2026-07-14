export type BusinessStoryPriority =
  | "p1_must"
  | "p2_should"
  | "p3_could"
  | "p4_wont";

export type BusinessStoryStatus =
  | "draft"
  | "ready"
  | "in_progress"
  | "done"
  | "deferred";

export type BusinessScope = {
  included: string[];
  excluded: string[];
};

export type DataRule = {
  field?: string;
  rule: string;
};

export type BusinessRequirementStory = {
  id: string;
  project_id: string;
  requirement_id: string | null;
  generation_run_id: string | null;
  title: string;
  priority: BusinessStoryPriority;
  status: BusinessStoryStatus;
  user_story: string;
  business_scope: BusinessScope;
  data_rules: DataRule[];
  acceptance_criteria: string[];
  vertical_slice_note: string | null;
  source_requirement_excerpt: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GenerateBusinessStoriesInput = {
  requirement_id?: string | null;
  overwrite?: boolean;
};

export type GenerateBusinessStoriesResponse = {
  items: BusinessRequirementStory[];
};

export type UpdateBusinessStoryInput = Partial<{
  title: string;
  priority: BusinessStoryPriority;
  status: BusinessStoryStatus;
  user_story: string;
  business_scope: BusinessScope;
  data_rules: DataRule[];
  acceptance_criteria: string[];
}>;

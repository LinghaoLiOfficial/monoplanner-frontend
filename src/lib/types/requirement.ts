export type Requirement = {
  id: string;
  project_id: string;
  raw_text: string;
  language: string;
  source_type: string;
  created_at: string;
  updated_at: string;
};

export type CreateRequirementPayload = {
  raw_text: string;
  language?: string;
  source_type?: string;
};

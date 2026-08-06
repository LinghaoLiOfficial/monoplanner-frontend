import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type ApiContractDraft = {
  id: string;
  project_id: string;
  blueprint_id: string;
  version: number;
  title: string;
  summary: string;
  base_path: string;
  content: ApiContractContent;
  created_at: string;
  updated_at: string;
};

export type VersionedApiContract = VersionedDesignAsset<ApiContractContent>;

export type ApiContractContent = {
  base_path: string;
  resources: ApiResource[];
  schemas: ApiSchema[];
  error_model?: Record<string, unknown>;
  notes?: string[];
};

export type ApiResource = {
  name: string;
  description?: string;
  endpoints: ApiEndpoint[];
};

export type ApiEndpoint = {
  method: string;
  path: string;
  operation_id?: string;
  purpose?: string;
  request_body?: string | null;
  response_body?: string | null;
  auth_required?: boolean;
  errors?: string[];
};

export type ApiSchema = {
  name: string;
  fields: ApiSchemaField[];
};

export type ApiSchemaField = {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
};

export type DbModelDraft = {
  id: string;
  project_id: string;
  blueprint_id: string;
  version: number;
  title: string;
  summary: string;
  content: DbModelContent;
  created_at: string;
  updated_at: string;
};

export type DbModelContent = {
  database?: {
    engine?: string;
    orm?: string;
    migration_tool?: string;
  };
  entities: DbEntity[];
  relationships?: DbRelationship[];
  indexes?: DbIndex[];
  migration_notes?: string[];
};

export type DbEntity = {
  name: string;
  table_name?: string;
  description?: string;
  fields: DbField[];
  relationships?: DbRelationship[];
};

export type DbField = {
  name: string;
  type: string;
  primary_key?: boolean;
  nullable?: boolean;
  required?: boolean;
  description?: string;
};

export type DbRelationship = {
  from: string;
  to: string;
  type: string;
  description?: string;
};

export type DbIndex = {
  table: string;
  fields: string[];
  reason?: string;
};

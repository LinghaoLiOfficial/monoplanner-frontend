export type ModuleChangeGroup<T = unknown> = {
  added: T[];
  modified: T[];
  removed: T[];
  unchanged: T[];
};

export type VersionedAssetDiff = {
  added?: unknown[];
  modified?: unknown[];
  removed?: unknown[];
} | null;

export type VersionedDesignAsset<TContent = unknown> = {
  id: string;
  project_id: string;
  version: number;
  is_current?: boolean;
  title: string;
  summary?: string | null;
  content: TContent;
  diff_from_previous?: VersionedAssetDiff;
  source_requirement_id?: string | null;
  source_story_id?: string | null;
  change_set_id?: string | null;
  generation_run_id?: string | null;
  created_at: string;
  updated_at: string;
};

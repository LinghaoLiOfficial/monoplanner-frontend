import type { ImplementationScope } from "@/lib/types/business-story";
import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type PromptBlock = {
  needed: boolean;
  title?: string;
  body?: string;
  prompt?: string;
  affected_files?: string[];
  do_not_modify?: string[];
  verification_steps?: string[];
};

export type PromptPackContent = {
  batch_summary?: string;
  implementation_scope?: ImplementationScope;
  diff_summary?: string | {
    added?: unknown;
    modified?: unknown;
    removed?: unknown;
    [key: string]: unknown;
  };
  execution_order?: string[];
  frontend_prompt?: PromptBlock;
  backend_prompt?: PromptBlock;
  acceptance_checklist?: string[];
  rollback_notes?: string[];
  [key: string]: unknown;
};

export type PromptPack = VersionedDesignAsset<PromptPackContent>;

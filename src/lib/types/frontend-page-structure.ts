import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type FrontendPageStructureContent = {
  version_summary?: string;
  pages?: unknown[];
  directory_structure?: unknown;
  diff?: unknown;
  [key: string]: unknown;
};

export type FrontendPageStructure = VersionedDesignAsset<FrontendPageStructureContent>;

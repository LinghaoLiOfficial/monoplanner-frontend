import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type FrontendImplementationContent = {
  version_summary?: string;
  route_definitions?: unknown[];
  directory_structure?: unknown;
  code_logic?: unknown;
  environment_variables?: string[];
  design_theme?: unknown;
  dependency_packages?: unknown[];
  utilities?: unknown[];
  notes?: string[];
  diff?: unknown;
  [key: string]: unknown;
};

export type FrontendImplementation = VersionedDesignAsset<FrontendImplementationContent>;

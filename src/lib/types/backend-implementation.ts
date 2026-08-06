import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type BackendImplementationContent = {
  version_summary?: string;
  service_design?: unknown;
  code_logic?: unknown;
  dependency_packages?: unknown[];
  environment_variables?: string[];
  utility_modules?: unknown[];
  notes?: string[];
  diff?: unknown;
  [key: string]: unknown;
};

export type BackendImplementation = VersionedDesignAsset<BackendImplementationContent>;

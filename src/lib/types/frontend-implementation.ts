import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type FrontendRouteDefinition = {
  path: string;
  page_name: string;
  dynamic_params: string[];
  permission_requirement: string;
};

export type FrontendDirectoryEntry = {
  path: string;
  purpose: string;
};

export type FrontendCodeLogicItem = {
  target: string;
  state_management: string[];
  events: string[];
  data_flow: string[];
  error_handling: string[];
};

export type FrontendEnvironmentVariable = {
  name: string;
  purpose: string;
  required: boolean;
};

export type FrontendDependency = {
  package_name: string;
  purpose: string;
  required: boolean;
};

export type NewFrontendImplementationContent = {
  version_summary?: string;
  route_definitions?: FrontendRouteDefinition[];
  directory_structure?: FrontendDirectoryEntry[];
  code_logic?: FrontendCodeLogicItem[];
  environment_variables?: FrontendEnvironmentVariable[];
  design_theme?: string[];
  dependencies?: FrontendDependency[];
  diff?: unknown;
  [key: string]: unknown;
};

export type LegacyFrontendImplementationContent = {
  version_summary?: string;
  route_definitions?: unknown[];
  pages?: unknown[];
  components?: unknown[];
  directory_structure?: unknown;
  code_logic?: unknown;
  data_flow?: unknown;
  environment_variables?: string[];
  design_theme?: unknown;
  dependencies?: unknown[];
  dependency_packages?: unknown[];
  internal_utilities?: unknown[];
  install_commands?: string[];
  utilities?: unknown[];
  notes?: string[];
  diff?: unknown;
  [key: string]: unknown;
};

export type FrontendImplementationContent =
  | NewFrontendImplementationContent
  | LegacyFrontendImplementationContent;

export type FrontendImplementation = VersionedDesignAsset<FrontendImplementationContent>;

export function isNewFrontendImplementationContent(
  content: FrontendImplementationContent
): content is NewFrontendImplementationContent {
  return (
    "route_definitions" in content ||
    "code_logic" in content ||
    "environment_variables" in content ||
    "design_theme" in content ||
    ("dependencies" in content && !("internal_utilities" in content))
  );
}

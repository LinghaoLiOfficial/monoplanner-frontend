"use client";

import { Code2 } from "lucide-react";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { FrontendImplementationContentViewer } from "@/components/frontend-implementation/FrontendImplementationContentViewer";
import { useLanguage } from "@/components/language/language-provider";
import { listFrontendImplementationVersions } from "@/lib/api/frontend-page-structures";
import { createLegacySections } from "@/lib/i18n";
import type { FrontendImplementationContent } from "@/lib/types/frontend-implementation";

export default function FrontendImplementationPage() {
  const { t } = useLanguage();
  const legacySections = createLegacySections(t.designAssets.legacySections, [
    { key: "version_summary", labelKey: "versionSummary" },
    { key: "pages", labelKey: "pages" },
    { key: "components", labelKey: "components" },
    { key: "directory_structure", labelKey: "directoryStructure" },
    { key: "data_flow", labelKey: "dataFlow" },
    { key: "dependencies", labelKey: "dependencies" },
    { key: "internal_utilities", labelKey: "internalUtilities" },
    { key: "install_commands", labelKey: "installCommands" },
    { key: "diff", labelKey: "diff" },
  ]);

  return (
    <VersionedAssetPage
      title={t.designAssets.pages.frontendImplementation.title}
      emptyDescription={t.designAssets.pages.frontendImplementation.emptyDescription}
      listAssets={listFrontendImplementationVersions}
      sections={legacySections}
      titleIcon={Code2}
      versionListWidth="narrow"
      renderContent={(_asset, content) => (
        <FrontendImplementationContentViewer content={content as FrontendImplementationContent} />
      )}
    />
  );
}

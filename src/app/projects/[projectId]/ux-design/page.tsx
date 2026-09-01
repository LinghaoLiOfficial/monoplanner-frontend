"use client";

import { DraftingCompass } from "lucide-react";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { UXDesignContentViewer } from "@/components/ux-design/UXDesignContentViewer";
import { useLanguage } from "@/components/language/language-provider";
import { listUXDesigns } from "@/lib/api/ux-designs";
import { createLegacySections } from "@/lib/i18n";
import type { UXDesignContent } from "@/lib/types/ux-design";

export default function UXDesignPage() {
  const { t } = useLanguage();
  const legacySections = createLegacySections(t.designAssets.legacySections, [
    { key: "version_summary", labelKey: "versionSummary" },
    { key: "user_goals", labelKey: "userGoals" },
    { key: "user_flows", labelKey: "userFlows" },
    { key: "interaction_states", labelKey: "interactionStates" },
    { key: "empty_states", labelKey: "emptyStates" },
    { key: "error_states", labelKey: "errorStates" },
    { key: "permission_experience", labelKey: "permissionExperience" },
    { key: "accessibility_requirements", labelKey: "accessibilityRequirements" },
  ]);

  return (
    <VersionedAssetPage
      title={t.designAssets.pages.uxDesign.title}
      emptyDescription={t.designAssets.pages.uxDesign.emptyDescription}
      listAssets={listUXDesigns}
      sections={legacySections}
      titleIcon={DraftingCompass}
      versionListWidth="narrow"
      renderContent={(_asset, content) => (
        <UXDesignContentViewer content={content as UXDesignContent} />
      )}
    />
  );
}

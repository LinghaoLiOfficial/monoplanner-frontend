"use client";

import { Palette } from "lucide-react";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { useLanguage } from "@/components/language/language-provider";
import { UIDesignContentViewer } from "@/components/ui-design/UIDesignContentViewer";
import { listUIDesigns } from "@/lib/api/ui-designs";
import type { UIDesignContent } from "@/lib/types/ui-design";
import { createLegacySections } from "@/lib/i18n";

export default function UIDesignPage() {
  const { t } = useLanguage();
  const legacySections = createLegacySections(t.designAssets.legacySections, [
    { key: "version_summary", labelKey: "versionSummary" },
    { key: "visual_hierarchy", labelKey: "visualHierarchy" },
    { key: "layout_guidelines", labelKey: "layoutGuidelines" },
    { key: "component_style_rules", labelKey: "componentStyleRules" },
    { key: "badge_rules", labelKey: "badgeRules" },
    { key: "button_rules", labelKey: "buttonRules" },
    { key: "form_rules", labelKey: "formRules" },
    { key: "responsive_rules", labelKey: "responsiveRules" },
    { key: "accessibility_visual_rules", labelKey: "accessibilityVisualRules" },
  ]);

  return (
    <VersionedAssetPage
      title={t.designAssets.pages.uiDesign.title}
      emptyDescription={t.designAssets.pages.uiDesign.emptyDescription}
      listAssets={listUIDesigns}
      sections={legacySections}
      titleIcon={Palette}
      versionListWidth="narrow"
      renderContent={(_asset, content) => (
        <UIDesignContentViewer content={content as UIDesignContent} />
      )}
    />
  );
}

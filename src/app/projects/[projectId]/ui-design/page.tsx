"use client";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { UIDesignContentViewer } from "@/components/ui-design/UIDesignContentViewer";
import { listUIDesigns } from "@/lib/api/ui-designs";
import type { UIDesignContent } from "@/lib/types/ui-design";
import { uiDesignLegacySections } from "@/lib/ui-design-contract";

export default function UIDesignPage() {
  return (
    <VersionedAssetPage
      title="UI视觉设计"
      description="描述视觉系统、布局规则、组件样式规则和视觉表达约束的设计资产。"
      emptyDescription="暂无 UI 设计版本。执行包含 UI 影响层的敏捷业务需求后，系统会生成 UI 设计。"
      listAssets={listUIDesigns}
      sections={uiDesignLegacySections}
      renderContent={(_asset, content) => (
        <UIDesignContentViewer content={content as UIDesignContent} />
      )}
    />
  );
}

"use client";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { UXDesignContentViewer } from "@/components/ux-design/UXDesignContentViewer";
import { listUXDesigns } from "@/lib/api/ux-designs";
import { uxDesignLegacySections } from "@/lib/ux-design-contract";
import type { UXDesignContent } from "@/lib/types/ux-design";

export default function UXDesignPage() {
  return (
    <VersionedAssetPage
      title="UX用户体验设计"
      description="描述用户如何完成任务、页面低保真结构、业务逻辑流和交互反馈的体验设计资产。"
      emptyDescription="暂无 UX 设计版本。执行包含 UX 影响层的敏捷业务需求后，系统会生成 UX 设计。"
      listAssets={listUXDesigns}
      sections={uxDesignLegacySections}
      renderContent={(_asset, content) => (
        <UXDesignContentViewer content={content as UXDesignContent} />
      )}
    />
  );
}

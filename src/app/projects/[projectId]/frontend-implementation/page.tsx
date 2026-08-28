"use client";

import { Code2 } from "lucide-react";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { FrontendImplementationContentViewer } from "@/components/frontend-implementation/FrontendImplementationContentViewer";
import { listFrontendImplementationVersions } from "@/lib/api/frontend-page-structures";
import {
  frontendImplementationLegacySections,
} from "@/lib/frontend-implementation-contract";
import type { FrontendImplementationContent } from "@/lib/types/frontend-implementation";

export default function FrontendImplementationPage() {
  return (
    <VersionedAssetPage
      title="前端实现版本"
      emptyDescription="暂无前端实现版本。执行包含前端实现影响层的业务故事后，系统会生成版本资产。"
      listAssets={listFrontendImplementationVersions}
      sections={frontendImplementationLegacySections}
      titleIcon={Code2}
      versionListWidth="narrow"
      renderContent={(_asset, content) => (
        <FrontendImplementationContentViewer content={content as FrontendImplementationContent} />
      )}
    />
  );
}

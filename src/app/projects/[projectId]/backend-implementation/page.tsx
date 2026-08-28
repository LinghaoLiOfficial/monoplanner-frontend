"use client";

import { Code2 } from "lucide-react";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { BackendImplementationContentViewer } from "@/components/backend-implementation/BackendImplementationContentViewer";
import { listBackendImplementationVersions } from "@/lib/api/backend-service-designs";
import { backendImplementationLegacySections } from "@/lib/backend-implementation-contract";
import type { BackendImplementationContent } from "@/lib/types/backend-implementation";

export default function BackendImplementationPage() {
  return (
    <VersionedAssetPage
      title="后端实现版本"
      emptyDescription="暂无后端实现版本。执行包含后端实现影响层的业务故事后，系统会生成版本资产。"
      listAssets={listBackendImplementationVersions}
      sections={backendImplementationLegacySections}
      titleIcon={Code2}
      versionListWidth="narrow"
      renderContent={(_asset, content) => (
        <BackendImplementationContentViewer content={content as BackendImplementationContent} />
      )}
    />
  );
}

"use client";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { listFrontendToolings } from "@/lib/api/frontend-toolings";

export default function FrontendToolsPage() {
  return (
    <VersionedAssetPage
      title="前端依赖与工具"
      description="查看前端第三方依赖、内部工具函数、新增依赖建议和安装命令。"
      emptyDescription="应用影响前端工具链的变更集后，会在这里显示版本化结果。"
      listAssets={listFrontendToolings}
      sections={[
        { key: "dependencies", title: "第三方依赖" },
        { key: "internal_utilities", title: "内部工具函数" },
        { key: "install_commands", title: "安装命令" },
        { key: "diff", title: "版本差异" },
      ]}
    />
  );
}

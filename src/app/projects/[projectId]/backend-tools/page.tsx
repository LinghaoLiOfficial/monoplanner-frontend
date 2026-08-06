"use client";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { listBackendToolings } from "@/lib/api/backend-toolings";

export default function BackendToolsPage() {
  return (
    <VersionedAssetPage
      title="后端依赖与工具"
      description="查看后端依赖、外部服务、环境变量、内部工具、安装命令和风险说明。"
      emptyDescription="应用影响后端依赖或工具链的变更集后，会在这里显示版本化结果。"
      listAssets={listBackendToolings}
      sections={[
        { key: "dependencies", title: "第三方依赖" },
        { key: "external_services", title: "外部服务" },
        { key: "environment_variables", title: "环境变量" },
        { key: "internal_utilities", title: "内部工具函数" },
        { key: "install_commands", title: "安装命令" },
        { key: "risks", title: "风险说明" },
      ]}
    />
  );
}

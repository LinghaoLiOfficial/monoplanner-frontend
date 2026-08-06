"use client";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { listApiContracts } from "@/lib/api/api-contracts";

export default function ApiContractPage() {
  return (
    <VersionedAssetPage
      title="API 契约"
      description="查看资源列表、接口列表、请求/响应 Schema、错误模型，以及前后端映射关系。"
      emptyDescription="应用涉及 API 的变更集后，会在这里显示版本化 API 契约。"
      listAssets={listApiContracts}
      sections={[
        { key: "resources", title: "资源列表与接口" },
        { key: "schemas", title: "请求 / 响应 Schema" },
        { key: "error_model", title: "错误模型" },
        { key: "frontend_consumers", title: "前端消费者" },
        { key: "backend_service_mappings", title: "后端服务映射" },
        { key: "diff", title: "版本差异" },
      ]}
    />
  );
}

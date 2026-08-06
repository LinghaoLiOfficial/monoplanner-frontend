"use client";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { listBackendServiceDesigns } from "@/lib/api/backend-service-designs";

export default function BackendServicesPage() {
  return (
    <VersionedAssetPage
      title="后端服务设计"
      description="查看 Service 列表、方法、业务规则、权限规则、事务边界和关联资源。"
      emptyDescription="应用涉及后端服务的变更集后，会在这里沉淀服务设计版本。"
      listAssets={listBackendServiceDesigns}
      sections={[
        { key: "services", title: "Service 列表" },
        { key: "cross_cutting_rules", title: "横切规则" },
        { key: "api_mappings", title: "关联 API" },
        { key: "database_mappings", title: "关联数据库实体" },
        { key: "diff", title: "版本差异" },
      ]}
    />
  );
}

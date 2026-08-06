"use client";

import { CompositeVersionedAssetPage } from "@/components/design-assets/CompositeVersionedAssetPage";
import { listBackendServiceDesigns } from "@/lib/api/backend-service-designs";
import { listBackendToolings } from "@/lib/api/backend-toolings";

export default function BackendImplementationPage() {
  return (
    <CompositeVersionedAssetPage
      title="后端工程实现"
      description="查看后端代码逻辑、服务设计、环境变量、依赖包、工具类和风险说明。"
      groups={[
        {
          key: "backend-services",
          title: "后端服务设计",
          description: "查看服务职责、横切规则、API 映射和数据库映射。",
          emptyDescription: "暂无后端服务设计版本。执行涉及后端服务的变更集后会在这里显示。",
          listAssets: listBackendServiceDesigns,
          sections: [
            { key: "services", title: "Service 列表" },
            { key: "cross_cutting_rules", title: "横切规则" },
            { key: "api_mappings", title: "关联 API" },
            { key: "database_mappings", title: "关联数据库实体" },
            { key: "diff", title: "版本差异" },
          ],
        },
        {
          key: "backend-tools",
          title: "后端依赖与工具",
          description: "查看后端依赖、外部服务、环境变量、工具函数和安装命令。",
          emptyDescription: "暂无后端依赖与工具版本。执行涉及后端工具链的变更集后会在这里显示。",
          listAssets: listBackendToolings,
          sections: [
            { key: "dependencies", title: "依赖包" },
            { key: "external_services", title: "外部服务" },
            { key: "environment_variables", title: "环境变量" },
            { key: "internal_utilities", title: "内部工具" },
            { key: "install_commands", title: "安装命令" },
            { key: "risks", title: "风险说明" },
          ],
        },
      ]}
    />
  );
}

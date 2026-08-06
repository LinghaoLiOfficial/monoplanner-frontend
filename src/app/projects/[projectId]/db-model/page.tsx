"use client";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { listDbModels } from "@/lib/api/db-models";

export default function DbModelPage() {
  return (
    <VersionedAssetPage
      title="数据库模型"
      description="查看实体、字段、关系、索引、迁移说明和 API 字段映射。"
      emptyDescription="应用涉及数据库的变更集后，会在这里显示数据库模型版本。"
      listAssets={listDbModels}
      sections={[
        { key: "database", title: "数据库设置" },
        { key: "entities", title: "实体 / 表列表" },
        { key: "relationships", title: "关系定义" },
        { key: "indexes", title: "索引" },
        { key: "migration_notes", title: "迁移说明" },
        { key: "api_field_mappings", title: "API 字段映射" },
      ]}
    />
  );
}

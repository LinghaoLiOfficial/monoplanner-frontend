"use client";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { DatabaseModelContentViewer } from "@/components/db-model/DatabaseModelContentViewer";
import { listDbModels } from "@/lib/api/db-models";
import { databaseModelLegacySections } from "@/lib/database-model-contract";
import type { DbModelContent } from "@/lib/types/db-model";

export default function DbModelPage() {
  return (
    <VersionedAssetPage
      title="数据库模型"
      description="项目数据实体、数据表、字段、关系、索引和迁移说明。"
      emptyDescription="应用涉及数据库的变更集后，会在这里显示数据库模型版本。"
      listAssets={listDbModels}
      sections={databaseModelLegacySections}
      renderContent={(_asset, content) => (
        <DatabaseModelContentViewer content={content as DbModelContent} />
      )}
    />
  );
}

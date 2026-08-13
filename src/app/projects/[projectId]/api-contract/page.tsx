"use client";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { ApiContractContentViewer } from "@/components/contract/ApiContractContentViewer";
import { listApiContracts } from "@/lib/api/api-contracts";
import { apiContractLegacySections } from "@/lib/api-contract-contract";
import type { ApiContractDraft } from "@/lib/types/api-contract";

export default function ApiContractPage() {
  return (
    <VersionedAssetPage
      title="API 契约"
      description="查看资源列表、接口列表、请求/响应 Schema、错误模型，以及前后端映射关系。"
      emptyDescription="应用涉及 API 的变更集后，会在这里显示版本化 API 契约。"
      listAssets={listApiContracts}
      sections={apiContractLegacySections}
      renderContent={(asset) => (
        <ApiContractContentViewer contract={asset as ApiContractDraft} />
      )}
    />
  );
}

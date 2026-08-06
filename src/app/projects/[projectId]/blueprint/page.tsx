"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { Button } from "@/components/ui/button";
import { getProjectBlueprints, summarizeProjectBlueprint } from "@/lib/api/blueprints";

function SummarizeBlueprintButton() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      await summarizeProjectBlueprint(projectId);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" onClick={() => void handleSummarize()} disabled={loading}>
      {loading ? "重新总结中..." : "重新总结项目蓝图"}
    </Button>
  );
}

export default function ProjectBlueprintPage() {
  return (
    <VersionedAssetPage
      title="项目蓝图"
      description="项目蓝图是当前所有设计资产的聚合摘要，不是唯一源头。"
      emptyDescription="应用变更集后，项目蓝图会在这里形成版本化聚合摘要。"
      listAssets={getProjectBlueprints}
      action={<SummarizeBlueprintButton />}
      sections={[
        { key: "project_overview", title: "项目概览" },
        { key: "current_product_scope", title: "当前产品范围" },
        { key: "business_capability_summary", title: "业务能力摘要" },
        { key: "ux_summary", title: "UX 摘要" },
        { key: "ui_summary", title: "UI 摘要" },
        { key: "frontend_summary", title: "前端摘要" },
        { key: "backend_summary", title: "后端摘要" },
        { key: "architecture_notes", title: "架构说明" },
        { key: "risks", title: "风险" },
        { key: "open_questions", title: "待确认问题" },
      ]}
    />
  );
}

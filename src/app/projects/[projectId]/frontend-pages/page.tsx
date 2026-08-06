"use client";

import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listFrontendPageStructures } from "@/lib/api/frontend-page-structures";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toTextList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string" || typeof item === "number") {
        return String(item);
      }

      if (isRecord(item)) {
        const label = item.name ?? item.title ?? item.id ?? item.ref_id;
        return typeof label === "string" || typeof label === "number" ? String(label) : JSON.stringify(item);
      }

      return null;
    })
    .filter((item): item is string => Boolean(item));
}

function ComponentReferenceList({ components }: { components: unknown }) {
  if (!Array.isArray(components) || components.length === 0) {
    return null;
  }

  const records = components.filter(isRecord);
  const componentsWithRefs = records.filter((component) => {
    return toTextList(component.ux_refs).length > 0 || toTextList(component.ui_refs).length > 0;
  });

  if (componentsWithRefs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>组件 UX/UI 关联</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {componentsWithRefs.map((component, index) => {
          const name = component.name ?? component.title ?? component.component ?? component.id ?? `组件 ${index + 1}`;
          const purpose = component.purpose ?? component.description ?? component.usage;
          const uxRefs = toTextList(component.ux_refs);
          const uiRefs = toTextList(component.ui_refs);

          return (
            <section key={`${String(name)}-${index}`} className="rounded-2xl border border-border/60 p-4">
              <h3 className="font-medium">{String(name)}</h3>
              {typeof purpose === "string" && purpose ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">用途：{purpose}</p>
              ) : null}
              {uxRefs.length > 0 ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">关联 UX：{uxRefs.join("、")}</p>
              ) : null}
              {uiRefs.length > 0 ? (
                <p className="mt-1 text-sm leading-6 text-muted-foreground">关联 UI：{uiRefs.join("、")}</p>
              ) : null}
            </section>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default function FrontendPagesPage() {
  return (
    <VersionedAssetPage
      title="前端页面结构"
      description="查看应用变更集后保存的前端页面、目录结构和版本差异。"
      emptyDescription="执行并应用变更集后，前端页面结构会在这里形成版本记录。"
      listAssets={listFrontendPageStructures}
      sections={[
        { key: "version_summary", title: "版本摘要" },
        { key: "pages", title: "页面列表" },
        { key: "directory_structure", title: "目录结构" },
        { key: "diff", title: "版本差异" },
      ]}
      renderContent={(_asset, content, sections) => (
        <div className="space-y-4">
          <AssetContentSections content={content} sections={sections} />
          <ComponentReferenceList components={content.components} />
        </div>
      )}
    />
  );
}

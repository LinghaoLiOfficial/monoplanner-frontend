"use client";

import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { useLanguage } from "@/components/language/language-provider";
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
  const { locale, t } = useLanguage();
  const page = t.designAssets.pages.frontendPages;
  const listSeparator = locale === "zh-CN" ? "、" : ", ";

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
        <CardTitle>{page.componentRefs}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {componentsWithRefs.map((component, index) => {
          const name = component.name ?? component.title ?? component.component ?? component.id ?? page.unnamedComponent(index + 1);
          const purpose = component.purpose ?? component.description ?? component.usage;
          const uxRefs = toTextList(component.ux_refs);
          const uiRefs = toTextList(component.ui_refs);

          return (
            <section key={`${String(name)}-${index}`} className="rounded-2xl border border-border/60 p-4">
              <h3 className="font-medium">{String(name)}</h3>
              {typeof purpose === "string" && purpose ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{page.purpose}: {purpose}</p>
              ) : null}
              {uxRefs.length > 0 ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{page.uxRefs}: {uxRefs.join(listSeparator)}</p>
              ) : null}
              {uiRefs.length > 0 ? (
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{page.uiRefs}: {uiRefs.join(listSeparator)}</p>
              ) : null}
            </section>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default function FrontendPagesPage() {
  const { t } = useLanguage();
  const page = t.designAssets.pages.frontendPages;

  return (
    <VersionedAssetPage
      title={page.title}
      description={page.description}
      emptyDescription={page.emptyDescription}
      listAssets={listFrontendPageStructures}
      sections={[
        { key: "version_summary", title: t.designAssets.legacySections.versionSummary },
        { key: "pages", title: t.designAssets.legacySections.pages },
        { key: "directory_structure", title: t.designAssets.legacySections.directoryStructure },
        { key: "diff", title: t.designAssets.legacySections.diff },
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

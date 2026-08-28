import { Palette, PanelTop, Shapes, SlidersHorizontal, Type } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import { Badge } from "@/components/ui/badge";
import {
  MetricStrip,
  StatusBadge,
  TextChips,
  VisualSection,
  visualIcons,
} from "@/components/design-assets/visual-dashboard";
import { FieldHint } from "@/components/ui/field-hint";
import { isNewUIDesignContent, type UIDesignContent } from "@/lib/types/ui-design";
import { uiDesignLegacySections } from "@/lib/ui-design-contract";

function RuleCluster({ title, values, icon }: { title: string; values: string[]; icon: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="text-muted-foreground">{icon}</span>
        {title}
      </div>
      <TextChips values={values} />
    </div>
  );
}

function DesignStyleChips({ description, traits }: { description?: string; traits: string[] }) {
  const hasDescription = Boolean(description);
  const hasTraits = traits.length > 0;

  if (!hasDescription && !hasTraits) {
    return <p className="text-sm leading-6 text-muted-foreground">暂无风格信息</p>;
  }

  return (
    <div className="space-y-3">
      {hasDescription ? (
        <div>
          <Badge
            variant="outline"
            className="max-w-full whitespace-normal border-amber-200 bg-amber-50 text-left leading-5 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
          >
            {description}
          </Badge>
        </div>
      ) : null}
      {hasTraits ? (
        <div>
          <div className="flex flex-wrap gap-2">
            {traits.map((trait, index) => (
              <Badge key={`${trait}-${index}`} variant="secondary" className="max-w-full whitespace-normal text-left leading-5">
                {trait}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MetricNameList({ names, emptyText }: { names: string[]; emptyText: string }) {
  if (names.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{emptyText}</p>;
  }

  return (
    <div className="max-h-24 overflow-y-auto pr-1">
      <ul className="space-y-1.5">
        {names.map((name, index) => (
          <li key={`${name}-${index}`} className="truncate text-sm leading-5 text-muted-foreground">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewUIDesignContentView({ content }: { content: Extract<UIDesignContent, { visual_system: unknown }> }) {
  const visualSystem = content.visual_system;
  const layoutRules = content.layout_rules ?? [];
  const componentStyleRules = content.component_style_rules ?? [];
  const pageNames = layoutRules.map((rule) => rule.target_screen || "未指定页面");
  const componentNames = componentStyleRules.map((rule) => rule.component_name || "未命名组件");
  const tokenGroups = [
    { title: "颜色系统", values: visualSystem?.color_system ?? [], icon: <Palette className="h-4 w-4" /> },
    { title: "字体系统", values: visualSystem?.typography_system ?? [], icon: <Type className="h-4 w-4" /> },
    { title: "间距系统", values: visualSystem?.spacing_system ?? [], icon: <PanelTop className="h-4 w-4" /> },
    { title: "形状系统", values: visualSystem?.shape_system ?? [], icon: <Shapes className="h-4 w-4" /> },
    { title: "阴影系统", values: visualSystem?.elevation_system ?? [], icon: visualIcons.dot },
    { title: "交互视觉系统", values: visualSystem?.interaction_visual_system ?? [], icon: visualIcons.workflow },
  ];

  return (
    <div className="space-y-4">
      <MetricStrip
        className="xl:grid-cols-2"
        items={[
          {
            label: "页面",
            value: layoutRules.length,
            description: <MetricNameList names={pageNames} emptyText="暂无页面" />,
          },
          {
            label: "组件",
            value: componentStyleRules.length,
            description: <MetricNameList names={componentNames} emptyText="暂无组件" />,
          },
        ]}
      />

      <VisualSection
        title={
          <FieldHint
            label="视觉系统"
            hint="全局视觉语言，包括颜色、字体、间距、形状、阴影、主题和交互视觉规则。"
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={<SlidersHorizontal className="h-4 w-4" />}
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
              <h3 className="text-sm font-semibold">设计风格</h3>
              <DesignStyleChips
                description={visualSystem?.design_style?.style_description}
                traits={visualSystem?.design_style?.signature_traits ?? []}
              />
            </div>
            <div className="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-4">
              <h3 className="text-sm font-semibold">主题配置</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground">浅色</span>
                  <StatusBadge label={visualSystem?.theme_configuration?.theme_types?.light_mode || "未指定"} tone="muted" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground">暗色</span>
                  <StatusBadge label={visualSystem?.theme_configuration?.theme_types?.dark_mode || "未指定"} tone="muted" />
                </div>
              </div>
            </div>
            <div className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
              <h3 className="text-sm font-semibold">设计原则</h3>
              <TextChips values={visualSystem?.design_principles ?? []} emptyText="暂无设计原则" />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {tokenGroups.map((group) => (
              <RuleCluster key={group.title} title={group.title} values={group.values} icon={group.icon} />
            ))}
          </div>
        </div>
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label="布局规则"
            hint="按目标页面并排比较桌面端与移动端布局。"
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.route}
        empty={layoutRules.length === 0 ? "暂无布局规则" : false}
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {layoutRules.map((rule, index) => (
            <section key={`${rule.target_screen}-${index}`} className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{rule.target_screen || "未指定页面"}</h3>
                <StatusBadge label="响应式" tone="muted" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                  <p className="text-sm font-medium text-muted-foreground">桌面端</p>
                  <p className="mt-2 text-sm leading-6">{rule.desktop_layout || "暂无"}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                  <p className="text-sm font-medium text-muted-foreground">移动端</p>
                  <p className="mt-2 text-sm leading-6">{rule.mobile_layout || "暂无"}</p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label="组件样式规则"
            hint="把内容、行动和危险操作拆成清晰的扫描区。"
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.workflow}
        empty={componentStyleRules.length === 0 ? "暂无组件样式规则" : false}
      >
        <div className="space-y-3">
          {componentStyleRules.map((rule, index) => {
            const priority = rule.visual_priority;
            const groups = [
              { title: "一级内容", values: priority?.primary_content ?? [], tone: "success" as const },
              { title: "一级行动", values: priority?.primary_actions ?? [], tone: "success" as const },
              { title: "二级内容", values: priority?.secondary_content ?? [], tone: "default" as const },
              { title: "二级行动", values: priority?.secondary_actions ?? [], tone: "muted" as const },
              { title: "三级内容", values: priority?.tertiary_content ?? [], tone: "muted" as const },
              { title: "危险行动", values: priority?.danger_actions ?? [], tone: "error" as const },
            ];
            return (
              <section key={`${rule.component_name}-${index}`} className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{rule.component_name || "未命名组件"}</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {groups.map((group) => (
                    <div key={group.title} className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                      <StatusBadge label={group.title} tone={group.tone} />
                      <TextChips values={group.values} />
                    </div>
                  ))}
                </div>
                <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                  <StatusBadge label="样式规则" tone="muted" />
                  <TextChips values={Array.isArray(rule.style_rules) ? rule.style_rules : []} emptyText="暂无样式规则" />
                </div>
              </section>
            );
          })}
        </div>
      </VisualSection>
    </div>
  );
}

function LegacyUIDesignContentView({ content }: { content: UIDesignContent }) {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          这是历史 UI 内容结构，保留兼容读取。新版设计资产会使用视觉系统、布局规则和组件样式规则契约。
        </AlertDescription>
      </Alert>
      <AssetContentSections content={content as Record<string, unknown>} sections={uiDesignLegacySections} />
    </div>
  );
}

export function UIDesignContentViewer({ content }: { content: UIDesignContent }) {
  if (isNewUIDesignContent(content)) {
    return <NewUIDesignContentView content={content} />;
  }

  return <LegacyUIDesignContentView content={content} />;
}

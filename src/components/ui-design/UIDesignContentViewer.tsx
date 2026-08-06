import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import { UIFieldBlock, UIFieldHeading } from "@/components/ui-design/UIFieldDefinition";
import { isNewUIDesignContent, type UIDesignContent } from "@/lib/types/ui-design";
import { uiDesignFieldDefinitions, uiDesignLegacySections } from "@/lib/ui-design-contract";
import type { UIFieldDefinition } from "@/lib/ui-design-contract";

function TextValue({ value }: { value: unknown }) {
  return (
    <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
      {String(value ?? "暂无")}
    </p>
  );
}

function DefinitionList({
  values,
  itemDefinition,
  emptyText = "暂无",
}: {
  values: string[];
  itemDefinition?: UIFieldDefinition;
  emptyText?: string;
}) {
  if (values.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{emptyText}</p>;
  }

  return (
    <div className="space-y-2">
      {values.map((item, index) => (
        <div key={`${item}-${index}`} className="rounded-lg border border-border/60 bg-muted/30 p-3">
          {itemDefinition ? <UIFieldHeading definition={itemDefinition} className="mb-2" /> : null}
          <p className="text-sm leading-7 text-muted-foreground">{item}</p>
        </div>
      ))}
    </div>
  );
}

function RuleSystemBlock({
  definition,
  values,
}: {
  definition: UIFieldDefinition;
  values: string[];
}) {
  return (
    <UIFieldBlock definition={definition}>
      <DefinitionList values={values} />
    </UIFieldBlock>
  );
}

function VisualPriorityList({
  definition,
  itemDefinition,
  values,
}: {
  definition: UIFieldDefinition;
  itemDefinition: UIFieldDefinition;
  values: string[];
}) {
  return (
    <UIFieldBlock definition={definition}>
      <DefinitionList values={values} itemDefinition={itemDefinition} />
    </UIFieldBlock>
  );
}

function NewUIDesignContentView({ content }: { content: Extract<UIDesignContent, { visual_system: unknown }> }) {
  const visualSystem = content.visual_system;
  const designStyle = visualSystem?.design_style;
  const themeConfiguration = visualSystem?.theme_configuration;
  const themeTypes = themeConfiguration?.theme_types;
  const layoutRules = content.layout_rules ?? [];
  const componentStyleRules = content.component_style_rules ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <UIFieldHeading definition={uiDesignFieldDefinitions.version_summary} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TextValue value={content.version_summary} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <UIFieldHeading definition={uiDesignFieldDefinitions.visual_system} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <section className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
            <UIFieldHeading definition={uiDesignFieldDefinitions.design_style} />
            <UIFieldBlock definition={uiDesignFieldDefinitions.style_description}>
              <TextValue value={designStyle?.style_description} />
            </UIFieldBlock>
            <UIFieldBlock definition={uiDesignFieldDefinitions.signature_traits}>
              <DefinitionList
                values={Array.isArray(designStyle?.signature_traits) ? designStyle.signature_traits : []}
                itemDefinition={uiDesignFieldDefinitions.trait}
              />
            </UIFieldBlock>
          </section>

          <UIFieldBlock definition={uiDesignFieldDefinitions.design_principles}>
            <DefinitionList
              values={Array.isArray(visualSystem?.design_principles) ? visualSystem.design_principles : []}
              itemDefinition={uiDesignFieldDefinitions.design_principle}
            />
          </UIFieldBlock>

          <section className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
            <UIFieldHeading definition={uiDesignFieldDefinitions.theme_configuration} />
            <UIFieldBlock definition={uiDesignFieldDefinitions.theme_types}>
              <div className="grid gap-4 md:grid-cols-2">
                <UIFieldBlock definition={uiDesignFieldDefinitions.light_mode}>
                  <TextValue value={themeTypes?.light_mode} />
                </UIFieldBlock>
                <UIFieldBlock definition={uiDesignFieldDefinitions.dark_mode}>
                  <TextValue value={themeTypes?.dark_mode} />
                </UIFieldBlock>
              </div>
            </UIFieldBlock>
            <UIFieldBlock definition={uiDesignFieldDefinitions.default_theme}>
              <TextValue value={themeConfiguration?.default_theme} />
            </UIFieldBlock>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <RuleSystemBlock definition={uiDesignFieldDefinitions.color_system} values={visualSystem?.color_system ?? []} />
            <RuleSystemBlock definition={uiDesignFieldDefinitions.typography_system} values={visualSystem?.typography_system ?? []} />
            <RuleSystemBlock definition={uiDesignFieldDefinitions.spacing_system} values={visualSystem?.spacing_system ?? []} />
            <RuleSystemBlock definition={uiDesignFieldDefinitions.shape_system} values={visualSystem?.shape_system ?? []} />
            <RuleSystemBlock definition={uiDesignFieldDefinitions.elevation_system} values={visualSystem?.elevation_system ?? []} />
            <RuleSystemBlock definition={uiDesignFieldDefinitions.interaction_visual_system} values={visualSystem?.interaction_visual_system ?? []} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <UIFieldHeading definition={uiDesignFieldDefinitions.layout_rules} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {layoutRules.length > 0 ? (
            layoutRules.map((rule, index) => (
              <section key={`${rule.target_screen}-${index}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                <UIFieldHeading definition={uiDesignFieldDefinitions.layout_rule} />
                <div className="grid gap-4 md:grid-cols-3">
                  <UIFieldBlock definition={uiDesignFieldDefinitions.target_screen}>
                    <TextValue value={rule.target_screen} />
                  </UIFieldBlock>
                  <UIFieldBlock definition={uiDesignFieldDefinitions.desktop_layout}>
                    <TextValue value={rule.desktop_layout} />
                  </UIFieldBlock>
                  <UIFieldBlock definition={uiDesignFieldDefinitions.mobile_layout}>
                    <TextValue value={rule.mobile_layout} />
                  </UIFieldBlock>
                </div>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无布局规则</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <UIFieldHeading definition={uiDesignFieldDefinitions.component_style_rules} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {componentStyleRules.length > 0 ? (
            componentStyleRules.map((rule, index) => {
              const priority = rule.visual_priority;
              return (
                <section key={`${rule.component_name}-${index}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                  <UIFieldHeading definition={uiDesignFieldDefinitions.component_style_rule} />
                  <UIFieldBlock definition={uiDesignFieldDefinitions.component_name}>
                    <TextValue value={rule.component_name} />
                  </UIFieldBlock>
                  <UIFieldBlock definition={uiDesignFieldDefinitions.visual_priority}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <VisualPriorityList
                        definition={uiDesignFieldDefinitions.primary_content}
                        itemDefinition={uiDesignFieldDefinitions.primary_content_item}
                        values={priority?.primary_content ?? []}
                      />
                      <VisualPriorityList
                        definition={uiDesignFieldDefinitions.secondary_content}
                        itemDefinition={uiDesignFieldDefinitions.secondary_content_item}
                        values={priority?.secondary_content ?? []}
                      />
                      <VisualPriorityList
                        definition={uiDesignFieldDefinitions.tertiary_content}
                        itemDefinition={uiDesignFieldDefinitions.tertiary_content_item}
                        values={priority?.tertiary_content ?? []}
                      />
                      <VisualPriorityList
                        definition={uiDesignFieldDefinitions.primary_actions}
                        itemDefinition={uiDesignFieldDefinitions.primary_action_item}
                        values={priority?.primary_actions ?? []}
                      />
                      <VisualPriorityList
                        definition={uiDesignFieldDefinitions.secondary_actions}
                        itemDefinition={uiDesignFieldDefinitions.secondary_action_item}
                        values={priority?.secondary_actions ?? []}
                      />
                      <VisualPriorityList
                        definition={uiDesignFieldDefinitions.danger_actions}
                        itemDefinition={uiDesignFieldDefinitions.danger_action_item}
                        values={priority?.danger_actions ?? []}
                      />
                    </div>
                  </UIFieldBlock>
                  <UIFieldBlock definition={uiDesignFieldDefinitions.style_rules}>
                    <DefinitionList
                      values={Array.isArray(rule.style_rules) ? rule.style_rules : []}
                      itemDefinition={uiDesignFieldDefinitions.style_rule}
                    />
                  </UIFieldBlock>
                </section>
              );
            })
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无组件样式规则</p>
          )}
        </CardContent>
      </Card>
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
      <AssetContentSections
        content={content as Record<string, unknown>}
        sections={uiDesignLegacySections}
      />
    </div>
  );
}

export function UIDesignContentViewer({ content }: { content: UIDesignContent }) {
  if (isNewUIDesignContent(content)) {
    return <NewUIDesignContentView content={content} />;
  }

  return <LegacyUIDesignContentView content={content} />;
}

"use client";

import { Palette, PanelTop, Shapes, SlidersHorizontal, Type } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import { CopyButton } from "@/components/common/CopyButton";
import { useLanguage } from "@/components/language/language-provider";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  MetricStrip,
  StatusBadge,
  TextChips,
  VisualSection,
  visualIcons,
} from "@/components/design-assets/visual-dashboard";
import { FieldHint } from "@/components/ui/field-hint";
import { cn } from "@/lib/utils";
import {
  isNewUIDesignContent,
  type UIDesignTokenSystem,
  type UIComponentStyleRule,
  type UIInteractionStateRule,
  type UILayoutRule,
  type UIVisualToken,
  type UIDesignContent,
} from "@/lib/types/ui-design";
import { uiDesignLegacySections } from "@/lib/ui-design-contract";

type TokenSystemInput = UIDesignTokenSystem | string[] | undefined | null;

const componentStateCoverageNames = ["default", "hover", "pressed", "focus-visible", "selected", "disabled", "loading", "error"];

function asArray<T>(value: T[] | undefined | null) {
  return Array.isArray(value) ? value : [];
}

function looksLikeColor(value: string) {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value.trim())
    || /^oklch\(/i.test(value.trim())
    || /^rgb(a)?\(/i.test(value.trim())
    || /^hsl(a)?\(/i.test(value.trim())
    || /^var\(--/i.test(value.trim());
}

function tokenKind(token: UIVisualToken, fallbackKind?: string) {
  const explicit = token.token_type?.toLowerCase();
  if (explicit) {
    return explicit;
  }
  if (fallbackKind) {
    return fallbackKind;
  }
  const name = `${token.token_name} ${token.semantic_role}`.toLowerCase();
  if ((typeof token.token_value === "string" && looksLikeColor(token.token_value)) || name.includes("color") || name.includes("颜色")) {
    return "color";
  }
  if (name.includes("font") || name.includes("type") || name.includes("字体")) {
    return "typography";
  }
  if (name.includes("spacing") || name.includes("space") || name.includes("间距")) {
    return "spacing";
  }
  if (name.includes("radius") || name.includes("圆角")) {
    return "radius";
  }
  if (name.includes("shadow") || name.includes("elevation") || name.includes("阴影")) {
    return "elevation";
  }
  return "semantic";
}

function displayTokenValue(value: UIVisualToken["token_value"]) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

function tokenValueObject(value: UIVisualToken["token_value"]) {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : null;
}

function tokenValueString(value: UIVisualToken["token_value"] | string) {
  return typeof value === "string" ? value : "";
}

function splitTokenValue(value: UIVisualToken["token_value"] | string) {
  return tokenValueString(value).split(/\s+/).filter(Boolean);
}

function colorPreviewValue(value: string) {
  return value.startsWith("var(") ? "var(--muted)" : value;
}

function normalizeTokenSystem(value: TokenSystemInput): UIDesignTokenSystem {
  if (value && !Array.isArray(value)) {
    return {
      description: value.description,
      rules: asArray(value.rules),
      tokens: asArray(value.tokens),
      tbd_items: asArray(value.tbd_items),
    };
  }
  return {
    description: null,
    rules: asArray(value),
    tokens: [],
    tbd_items: [],
  };
}

function MetricNameList({ names, emptyText }: { names: string[]; emptyText: string }) {
  if (names.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{emptyText}</p>;
  }

  return (
    <div className="max-h-24 overflow-y-auto pr-1">
      <div className="flex flex-col items-start gap-1.5">
        {names.map((name, index) => (
          <Badge key={`${name}-${index}`} variant="outline" className="max-w-full items-center justify-center bg-transparent px-2 py-0.5 text-center leading-5">
            {name}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function StyleTagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Badge key={`${tag}-${index}`} variant="secondary" className="max-w-full whitespace-normal text-left leading-5">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

function TokenPreview({ token, fallbackKind }: { token: UIVisualToken; fallbackKind?: string }) {
  const kind = tokenKind(token, fallbackKind);
  const value = displayTokenValue(token.token_value);
  if (kind === "color") {
    return (
      <div className="flex items-center gap-3">
        <span
          className="h-9 w-9 shrink-0 rounded-lg border border-border"
          style={{ background: colorPreviewValue(value) }}
          aria-hidden="true"
        />
        <span className="break-all font-mono text-xs text-muted-foreground">{value}</span>
      </div>
    );
  }
  if (kind === "typography") {
    const typedValue = tokenValueObject(token.token_value);
    const style = {
      fontFamily: typeof typedValue?.fontFamily === "string" ? typedValue.fontFamily : undefined,
      fontSize: typeof typedValue?.fontSize === "string" ? typedValue.fontSize : undefined,
      fontWeight: typeof typedValue?.fontWeight === "number" || typeof typedValue?.fontWeight === "string" ? typedValue.fontWeight : undefined,
      lineHeight: typeof typedValue?.lineHeight === "string" ? typedValue.lineHeight : undefined,
      letterSpacing: typeof typedValue?.letterSpacing === "string" ? typedValue.letterSpacing : undefined,
    };
    return (
      <div className="space-y-1">
        <p className="break-words text-lg font-semibold leading-tight" style={style}>The quick brown fox jumps</p>
        <p className="break-all font-mono text-xs text-muted-foreground">{value}</p>
      </div>
    );
  }
  if (kind === "spacing") {
    const first = splitTokenValue(value)[0] ?? value;
    return (
      <div className="space-y-2">
        <div className="h-3 max-w-full rounded-full bg-muted">
          <div className="h-3 max-w-full rounded-full bg-foreground/70" style={{ width: first || "0px" }} />
        </div>
        <p className="break-all font-mono text-xs text-muted-foreground">{value}</p>
      </div>
    );
  }
  if (kind === "radius") {
    const first = splitTokenValue(value)[0] ?? value;
    return (
      <div className="flex items-center gap-3">
        <span className="h-10 w-16 border border-foreground/30 bg-muted" style={{ borderRadius: first }} aria-hidden="true" />
        <span className="break-all font-mono text-xs text-muted-foreground">{value}</span>
      </div>
    );
  }
  if (kind === "elevation") {
    return (
      <div className="rounded-lg border border-border bg-background p-3" style={{ boxShadow: value === "none" ? "none" : value }}>
        <p className="break-all font-mono text-xs text-muted-foreground">{value}</p>
      </div>
    );
  }
  if (kind === "interaction") {
    return (
      <div className="rounded-lg border border-border bg-background p-3 shadow-[var(--shadow-sm)]">
        <div className="inline-flex min-h-9 items-center rounded-md border border-foreground/20 px-3 text-sm font-medium" style={{ boxShadow: value.includes("0 0") ? value : undefined }}>
          focus-visible
        </div>
        <p className="mt-2 break-all font-mono text-xs text-muted-foreground">{value}</p>
      </div>
    );
  }
  return <p className="break-all font-mono text-xs text-muted-foreground">{value}</p>;
}

function TokenSystemPanel({
  title,
  system,
  fallbackKind,
}: {
  title: string;
  system: UIDesignTokenSystem;
  fallbackKind: string;
}) {
  const { t } = useLanguage();
  const labels = t.designAssets.ui;

  return (
    <section className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">{title}</h3>
          {system.description ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{system.description}</p> : null}
        </div>
        <StatusBadge label={labels.itemCount(system.tokens.length)} tone={system.tokens.length > 0 ? "success" : "muted"} />
      </div>
      <TextChips values={system.rules} emptyText={t.common.empty} />
      {system.tokens.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {system.tokens.map((token, tokenIndex) => {
            const copyValue = `${token.css_variable || token.tailwind_variable || token.token_name}: ${displayTokenValue(token.token_value)}`;
            return (
              <article key={`${token.token_name}-${tokenIndex}`} className="flex min-h-64 flex-col justify-between gap-4 rounded-lg border border-border/70 bg-card p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="break-words font-mono text-sm font-semibold">{token.token_name || labels.noToken}</p>
                      {token.description ? <p className="mt-1 text-sm leading-5 text-muted-foreground">{token.description}</p> : null}
                      {token.css_variable ? <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{token.css_variable}</p> : null}
                      {token.tailwind_variable && token.tailwind_variable !== token.css_variable ? <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{token.tailwind_variable}</p> : null}
                    </div>
                    {token.validated_status ? <StatusBadge label={token.validated_status} tone={token.validated_status === "tbd" ? "warning" : "muted"} /> : null}
                  </div>
                  <TokenPreview token={token} fallbackKind={fallbackKind} />
                  <div className="grid gap-2 text-sm">
                    <p><span className="font-medium">{labels.semanticRole}：</span>{token.semantic_role || t.common.empty}</p>
                    <p className="text-muted-foreground"><span className="font-medium text-foreground">{labels.usageContext}：</span>{token.usage_context || t.common.empty}</p>
                    {token.contrast_notes ? <p className="text-muted-foreground">{token.contrast_notes}</p> : null}
                  </div>
                  <TextChips values={asArray(token.anti_usage)} emptyText={labels.noConstraints} />
                  <TextChips values={asArray(token.source_basis)} emptyText={t.common.empty} />
                </div>
                <CopyButton value={copyValue} label={t.common.copy} className="w-full" />
              </article>
            );
          })}
        </div>
      ) : null}
      <TextChips values={asArray(system.tbd_items)} emptyText={t.common.empty} />
    </section>
  );
}

function StateMatrixPanel({ states }: { states: UIInteractionStateRule[] }) {
  const { t } = useLanguage();
  const labels = t.designAssets.ui;

  if (states.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{labels.noInteractionStateMatrix}</p>;
  }

  return (
    <div className="max-h-80 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{labels.states}</TableHead>
            <TableHead>{labels.visualCues}</TableHead>
            <TableHead>{labels.usageCondition}</TableHead>
            <TableHead>{labels.constraints}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {states.map((state, stateIndex) => (
            <TableRow key={`${state.state_name || "state"}-${stateIndex}`}>
              <TableCell className="min-w-36 font-mono text-xs">{state.state_name || labels.unnamedState}</TableCell>
              <TableCell className="min-w-56"><TextChips values={asArray(state.visual_cues)} emptyText="/" /></TableCell>
              <TableCell className="min-w-56"><TextChips values={asArray(state.usage_context)} emptyText="/" /></TableCell>
              <TableCell className="min-w-56"><TextChips values={asArray(state.constraints)} emptyText="/" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function LayoutRuleCard({ rule }: { rule: UILayoutRule }) {
  const { t } = useLanguage();
  const labels = t.designAssets.ui;
  return (
    <section className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{rule.target_screen || t.designAssets.ux.unnamedScreen}</h3>
        <StatusBadge label={rule.primary_action || labels.responsive} tone={rule.primary_action ? "success" : "muted"} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <p className="text-sm font-medium text-muted-foreground">{labels.desktop}</p>
          <p className="mt-2 text-sm leading-6">{rule.desktop_layout || t.common.empty}</p>
          {rule.desktop_grid ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{rule.desktop_grid}</p> : null}
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <p className="text-sm font-medium text-muted-foreground">{labels.mobile}</p>
          <p className="mt-2 text-sm leading-6">{rule.mobile_layout || t.common.empty}</p>
          {rule.mobile_reflow ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{rule.mobile_reflow}</p> : null}
        </div>
      </div>
      <TextChips values={asArray(rule.container_rules)} emptyText={t.common.empty} />
    </section>
  );
}

function ComponentRuleCard({ rule }: { rule: UIComponentStyleRule }) {
  const { t } = useLanguage();
  const labels = t.designAssets.ui;
  const priority = rule.visual_priority;
  const groups = [
    { title: labels.primaryContent, values: priority?.primary_content ?? [], tone: "success" as const },
    { title: labels.primaryActions, values: priority?.primary_actions ?? [], tone: "success" as const },
    { title: labels.secondaryContent, values: priority?.secondary_content ?? [], tone: "default" as const },
    { title: labels.secondaryActions, values: priority?.secondary_actions ?? [], tone: "muted" as const },
    { title: labels.tertiaryContent, values: priority?.tertiary_content ?? [], tone: "muted" as const },
    { title: labels.dangerActions, values: priority?.danger_actions ?? [], tone: "error" as const },
  ];
  const coveredStates = new Set(asArray(rule.states).map((state) => state.state_name));

  return (
    <section className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{rule.component_name || labels.noComponents}</h3>
        {rule.implementation_hint ? <StatusBadge label={rule.implementation_hint} tone="muted" /> : null}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <div key={group.title} className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
            <StatusBadge label={group.title} tone={group.tone} />
            <TextChips values={group.values} />
          </div>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
          <StatusBadge label={labels.styleRules} tone="muted" />
          <TextChips values={Array.isArray(rule.style_rules) ? rule.style_rules : []} emptyText={labels.noStyleRules} />
        </div>
        <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
          <StatusBadge label={labels.states} tone={coveredStates.size >= 4 ? "success" : "warning"} />
          <div className="flex flex-wrap gap-1.5">
            {componentStateCoverageNames.map((state) => (
              <Badge key={state} variant="outline" className={cn("font-mono text-[11px]", coveredStates.has(state) ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-border bg-background text-muted-foreground")}>
                {state}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      {asArray(rule.states).length > 0 ? <StateMatrixPanel states={asArray(rule.states)} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <StatusBadge label={labels.responsive} tone="muted" />
          <div className="mt-2"><TextChips values={asArray(rule.responsive_behavior)} emptyText={t.common.empty} /></div>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <StatusBadge label="A11y" tone="muted" />
          <div className="mt-2"><TextChips values={asArray(rule.accessibility_notes)} emptyText={t.common.empty} /></div>
        </div>
      </div>
    </section>
  );
}

function DesignStyleChips({
  description,
  traits,
  styleTags,
}: {
  description?: string;
  traits: string[];
  styleTags: string[];
}) {
  const { t } = useLanguage();
  const labels = t.designAssets.ui;
  const hasDescription = Boolean(description);
  const hasTraits = traits.length > 0;
  const hasStyleTags = styleTags.length > 0;

  if (!hasDescription && !hasTraits && !hasStyleTags) {
    return <p className="text-sm leading-6 text-muted-foreground">{labels.noStyleInfo}</p>;
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
      {hasStyleTags ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold">{labels.styleTags}</p>
          <StyleTagList tags={styleTags} />
        </div>
      ) : null}
      {hasTraits ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold">{labels.traits}</p>
          <TextChips values={traits} />
        </div>
      ) : null}
    </div>
  );
}

function NewUIDesignContentView({ content }: { content: Extract<UIDesignContent, { visual_system: unknown }> }) {
  const { t } = useLanguage();
  const labels = t.designAssets.ui;
  const visualSystem = content.visual_system;
  const layoutRules = content.layout_rules ?? [];
  const componentStyleRules = content.component_style_rules ?? [];
  const stateMatrix = visualSystem?.interaction_state_matrix ?? [];
  const colorSystem = normalizeTokenSystem(visualSystem?.color_system);
  const typographySystem = normalizeTokenSystem(visualSystem?.typography_system);
  const spacingSystem = normalizeTokenSystem(visualSystem?.spacing_system);
  const shapeSystem = normalizeTokenSystem(visualSystem?.shape_system);
  const elevationSystem = normalizeTokenSystem(visualSystem?.elevation_system);
  const interactionVisualSystem = normalizeTokenSystem(visualSystem?.interaction_visual_system);
  const visualTokenSystems = [
    { title: labels.colorSystem, system: colorSystem, fallbackKind: "color", icon: <Palette className="h-4 w-4" /> },
    { title: labels.typographySystem, system: typographySystem, fallbackKind: "typography", icon: <Type className="h-4 w-4" /> },
    { title: labels.spacingSystem, system: spacingSystem, fallbackKind: "spacing", icon: <PanelTop className="h-4 w-4" /> },
    { title: labels.shapeSystem, system: shapeSystem, fallbackKind: "radius", icon: <Shapes className="h-4 w-4" /> },
    { title: labels.elevationSystem, system: elevationSystem, fallbackKind: "elevation", icon: visualIcons.dot },
    { title: labels.interactionVisualSystem, system: interactionVisualSystem, fallbackKind: "interaction", icon: visualIcons.workflow },
  ];
  const pageNames = layoutRules.map((rule) => rule.target_screen || t.designAssets.ux.unnamedScreen);
  const componentNames = componentStyleRules.map((rule) => rule.component_name || labels.noComponents);
  const stateNames = stateMatrix.map((state) => state.state_name || labels.unnamedState);

  return (
    <div className="space-y-4">
      <MetricStrip
        items={[
          {
            label: t.designAssets.ux.screens,
            value: layoutRules.length,
            description: <MetricNameList names={pageNames} emptyText={t.designAssets.ux.noScreens} />,
          },
          {
            label: labels.components,
            value: componentStyleRules.length,
            description: <MetricNameList names={componentNames} emptyText={labels.noComponents} />,
          },
          {
            label: labels.states,
            value: stateMatrix.length,
            description: <MetricNameList names={stateNames} emptyText={labels.noStates} />,
          },
        ]}
      />

      <VisualSection
        title={
          <FieldHint
            label={labels.visualSystem}
            hint={labels.visualSystemHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={<SlidersHorizontal className="h-4 w-4" />}
      >
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
              <h3 className="text-sm font-semibold">{labels.designStyle}</h3>
              <DesignStyleChips
                description={visualSystem?.design_style?.style_description}
                traits={visualSystem?.design_style?.signature_traits ?? []}
                styleTags={visualSystem?.style_tags ?? []}
              />
            </div>
            <div className="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-4">
              <h3 className="text-sm font-semibold">{labels.themeConfiguration}</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground">{labels.light}</span>
                  <StatusBadge label={visualSystem?.theme_configuration?.theme_types?.light_mode || t.common.unspecified} tone="muted" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground">{labels.dark}</span>
                  <StatusBadge label={visualSystem?.theme_configuration?.theme_types?.dark_mode || t.common.unspecified} tone="muted" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground">{labels.defaultTheme}</span>
                  <StatusBadge label={visualSystem?.theme_configuration?.default_theme || t.common.unspecified} tone="muted" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-border/70 bg-background/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">{labels.designPrinciples}</h3>
            </div>
            <TextChips values={visualSystem?.design_principles ?? []} emptyText={labels.noDesignPrinciples} />
          </div>

          <div className="space-y-3">
            {visualTokenSystems.map((group) => (
              <TokenSystemPanel
                key={group.title}
                title={group.title}
                system={group.system}
                fallbackKind={group.fallbackKind}
              />
            ))}
          </div>

          {visualSystem?.tailwind_theme_css ? (
            <div className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{labels.tailwindThemeCss}</h3>
                <CopyButton value={visualSystem.tailwind_theme_css} label={t.common.copy} />
              </div>
              <pre className="max-h-80 overflow-auto rounded-lg bg-muted/40 p-3 text-xs leading-5">
                <code>{visualSystem.tailwind_theme_css}</code>
              </pre>
            </div>
          ) : null}
        </div>
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label={labels.interactionStateMatrix}
            hint={labels.interactionStateMatrixHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.workflow}
        empty={stateMatrix.length === 0 ? labels.noInteractionStateMatrix : false}
      >
        <StateMatrixPanel states={stateMatrix} />
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label={labels.layoutRules}
            hint={labels.layoutRulesHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.route}
        empty={layoutRules.length === 0 ? labels.layoutRules : false}
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {layoutRules.map((rule, index) => (
            <LayoutRuleCard key={`${rule.target_screen}-${index}`} rule={rule} />
          ))}
        </div>
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label={labels.componentStyleRules}
            hint={labels.componentStyleRulesHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.workflow}
        empty={componentStyleRules.length === 0 ? labels.noComponentStyleRules : false}
      >
        <div className="space-y-3">
          {componentStyleRules.map((rule, index) => (
            <ComponentRuleCard key={`${rule.component_name}-${index}`} rule={rule} />
          ))}
        </div>
      </VisualSection>
    </div>
  );
}

function LegacyUIDesignContentView({ content }: { content: UIDesignContent }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          {t.designAssets.ui.legacy}
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

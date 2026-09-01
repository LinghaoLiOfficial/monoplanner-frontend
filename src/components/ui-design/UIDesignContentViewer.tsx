"use client";

import { AlertTriangle, CheckCircle2, Palette, PanelTop, Shapes, SlidersHorizontal, Type } from "lucide-react";

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
  type UIComponentStyleRule,
  type UIInteractionStateRule,
  type UILayoutRule,
  type UIVisualToken,
  type UIVisualTokenGroup,
  type UIDesignContent,
} from "@/lib/types/ui-design";
import { uiDesignLegacySections } from "@/lib/ui-design-contract";

const canonicalStates = ["default", "hover", "pressed", "focus-visible", "selected", "disabled", "loading", "error"];

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

function tokenKind(token: UIVisualToken) {
  const explicit = token.token_type?.toLowerCase();
  if (explicit) {
    return explicit;
  }
  const name = `${token.token_name} ${token.semantic_role}`.toLowerCase();
  if (looksLikeColor(token.token_value) || name.includes("color") || name.includes("颜色")) {
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

function splitTokenValue(value: string) {
  return value.split(/\s+/).filter(Boolean);
}

function colorPreviewValue(value: string) {
  return value.startsWith("var(") ? "var(--muted)" : value;
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

function TokenPreview({ token }: { token: UIVisualToken }) {
  const kind = tokenKind(token);
  const value = token.token_value;
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
    return (
      <div className="space-y-1">
        <p className="text-lg font-semibold leading-tight">Ag 字体样张</p>
        <p className="break-all font-mono text-xs text-muted-foreground">{value}</p>
      </div>
    );
  }
  if (kind === "spacing") {
    const first = splitTokenValue(value)[0] ?? value;
    return (
      <div className="space-y-2">
        <div className="h-3 max-w-full rounded-full bg-muted">
          <div className="h-3 max-w-full rounded-full bg-foreground/70" style={{ width: first }} />
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
  return <p className="break-all font-mono text-xs text-muted-foreground">{value}</p>;
}

function TokenCatalogPanel({ groups }: { groups: UIVisualTokenGroup[] }) {
  const { t } = useLanguage();
  const labels = t.designAssets.ui;

  if (groups.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{labels.noTokenCatalog}</p>;
  }

  return (
    <div className="space-y-4">
      {groups.map((group, groupIndex) => (
        <section key={`${group.group_name}-${groupIndex}`} className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold">{group.group_name || labels.unnamedGroup}</h3>
              {group.description ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{group.description}</p> : null}
            </div>
            <StatusBadge label={labels.itemCount(group.tokens.length)} tone="muted" />
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {group.tokens.map((token, tokenIndex) => (
              <article key={`${token.token_name}-${tokenIndex}`} className="flex min-h-64 flex-col justify-between gap-4 rounded-lg border border-border/70 bg-card p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="break-words font-mono text-sm font-semibold">{token.token_name || labels.noToken}</p>
                      {token.css_variable ? <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{token.css_variable}</p> : null}
                    </div>
                    {token.validated_status ? <StatusBadge label={token.validated_status} tone={token.validated_status === "tbd" ? "warning" : "muted"} /> : null}
                  </div>
                  <TokenPreview token={token} />
                  <div className="grid gap-2 text-sm">
                    <p><span className="font-medium">{labels.semanticRole}：</span>{token.semantic_role || t.common.empty}</p>
                    <p className="text-muted-foreground"><span className="font-medium text-foreground">{labels.usageContext}：</span>{token.usage_context || t.common.empty}</p>
                    {token.contrast_notes ? <p className="text-muted-foreground">{token.contrast_notes}</p> : null}
                  </div>
                  <TextChips values={asArray(token.anti_usage)} emptyText={labels.noConstraints} />
                  <TextChips values={asArray(token.source_basis)} emptyText={t.common.empty} />
                </div>
                <CopyButton
                  value={`${token.css_variable ? `${token.css_variable}: ` : ""}${token.token_name}: ${token.token_value}`}
                  label={t.common.copy}
                  className="w-full"
                />
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function StateMatrixPanel({ states }: { states: UIInteractionStateRule[] }) {
  const { t } = useLanguage();
  const labels = t.designAssets.ui;
  const byName = new Map(states.map((state) => [state.state_name, state]));

  if (states.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{labels.noInteractionStateMatrix}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{labels.interactionStateMatrix}</TableHead>
            <TableHead>{labels.visualCues}</TableHead>
            <TableHead>{labels.usageContext}</TableHead>
            <TableHead>{labels.constraints}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {canonicalStates.map((name) => {
            const state = byName.get(name);
            return (
              <TableRow key={name}>
                <TableCell className="font-mono text-xs">
                  <div className="flex items-center gap-2">
                    {state ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}
                    {name}
                  </div>
                </TableCell>
                <TableCell className="min-w-56"><TextChips values={asArray(state?.visual_cues)} emptyText={labels.noVisualCues} /></TableCell>
                <TableCell className="min-w-56"><TextChips values={asArray(state?.usage_context)} emptyText={labels.noUsageContext} /></TableCell>
                <TableCell className="min-w-56"><TextChips values={asArray(state?.constraints)} emptyText={labels.noConstraints} /></TableCell>
              </TableRow>
            );
          })}
          {states.filter((state) => !canonicalStates.includes(state.state_name)).map((state) => (
            <TableRow key={state.state_name}>
              <TableCell className="font-mono text-xs">{state.state_name || labels.unnamedState}</TableCell>
              <TableCell className="min-w-56"><TextChips values={asArray(state.visual_cues)} emptyText={labels.noVisualCues} /></TableCell>
              <TableCell className="min-w-56"><TextChips values={asArray(state.usage_context)} emptyText={labels.noUsageContext} /></TableCell>
              <TableCell className="min-w-56"><TextChips values={asArray(state.constraints)} emptyText={labels.noConstraints} /></TableCell>
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
            {canonicalStates.map((state) => (
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
  brandAnchor,
  styleTags,
}: {
  description?: string;
  traits: string[];
  brandAnchor?: string | null;
  styleTags: string[];
}) {
  const { t } = useLanguage();
  const labels = t.designAssets.ui;
  const hasDescription = Boolean(description);
  const hasTraits = traits.length > 0;
  const hasBrandAnchor = Boolean(brandAnchor);
  const hasStyleTags = styleTags.length > 0;

  if (!hasDescription && !hasTraits && !hasBrandAnchor && !hasStyleTags) {
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
      {hasBrandAnchor ? (
        <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{labels.brandAnchor}</p>
          <p className="mt-1 text-sm leading-6 text-foreground">{brandAnchor}</p>
        </div>
      ) : null}
      {hasStyleTags ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{labels.styleTags}</p>
          <StyleTagList tags={styleTags} />
        </div>
      ) : null}
      {hasTraits ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{labels.traits}</p>
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
  const tokenCatalog = visualSystem?.token_catalog ?? [];
  const stateMatrix = visualSystem?.interaction_state_matrix ?? [];
  const pageNames = layoutRules.map((rule) => rule.target_screen || t.designAssets.ux.unnamedScreen);
  const componentNames = componentStyleRules.map((rule) => rule.component_name || labels.noComponents);
  const tokenGroupNames = tokenCatalog.map((group) => group.group_name || labels.unnamedGroup);
  const stateNames = stateMatrix.map((state) => state.state_name || labels.unnamedState);

  const tokenGroups = [
    { title: labels.colorSystem, values: visualSystem?.color_system ?? [], icon: <Palette className="h-4 w-4" /> },
    { title: labels.typographySystem, values: visualSystem?.typography_system ?? [], icon: <Type className="h-4 w-4" /> },
    { title: labels.spacingSystem, values: visualSystem?.spacing_system ?? [], icon: <PanelTop className="h-4 w-4" /> },
    { title: labels.shapeSystem, values: visualSystem?.shape_system ?? [], icon: <Shapes className="h-4 w-4" /> },
    { title: labels.elevationSystem, values: visualSystem?.elevation_system ?? [], icon: visualIcons.dot },
    { title: labels.interactionVisualSystem, values: visualSystem?.interaction_visual_system ?? [], icon: visualIcons.workflow },
  ];

  return (
    <div className="space-y-4">
      <MetricStrip
        className="xl:grid-cols-4"
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
            label: labels.tokenGroups,
            value: tokenCatalog.length,
            description: <MetricNameList names={tokenGroupNames} emptyText={labels.noTokenGroups} />,
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
                brandAnchor={visualSystem?.brand_anchor}
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
              <StatusBadge label={labels.summary} tone="muted" />
            </div>
            <TextChips values={visualSystem?.design_principles ?? []} emptyText={labels.noDesignPrinciples} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
              <h3 className="text-sm font-semibold">Evidence</h3>
              {visualSystem?.evidence_policy ? <p className="text-sm leading-6 text-muted-foreground">{visualSystem.evidence_policy}</p> : null}
              <TextChips values={asArray(visualSystem?.source_references)} emptyText={t.common.empty} />
            </div>
            <div className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
              <h3 className="text-sm font-semibold">Accessibility / Responsive</h3>
              <TextChips values={asArray(visualSystem?.accessibility_rules)} emptyText={t.common.empty} />
              <TextChips values={asArray(visualSystem?.responsive_contract)} emptyText={t.common.empty} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {tokenGroups.map((group) => (
              <div key={group.title} className="rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="text-muted-foreground">{group.icon}</span>
                  {group.title}
                </div>
                <div className="mt-3">
                  <TextChips values={group.values} emptyText={t.common.empty} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label={labels.tokenCatalog}
            hint={labels.tokenCatalogHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={<Palette className="h-4 w-4" />}
        empty={tokenCatalog.length === 0 ? labels.noTokenCatalog : false}
      >
        <TokenCatalogPanel groups={tokenCatalog} />
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

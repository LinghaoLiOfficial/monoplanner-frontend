import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import {
  KeyValueTable,
  MetricStrip,
  RelationshipMap,
  StatusBadge,
  TextChips,
  VisualSection,
  visualIcons,
} from "@/components/design-assets/visual-dashboard";
import { FieldHint } from "@/components/ui/field-hint";
import { FrontendImplementationFieldHeading } from "@/components/frontend-implementation/FrontendImplementationFieldDefinition";
import { useLanguage } from "@/components/language/language-provider";
import {
  isNewFrontendImplementationContent,
  type FrontendImplementationContent,
  type NewFrontendImplementationContent,
} from "@/lib/types/frontend-implementation";
import {
  frontendImplementationFieldDefinitions,
  frontendImplementationLegacySections,
} from "@/lib/frontend-implementation-contract";
import type { FrontendImplementationFieldDefinition } from "@/lib/frontend-implementation-contract";

function TextList({
  values,
  itemDefinition,
  emptyText,
}: {
  values: string[];
  itemDefinition?: FrontendImplementationFieldDefinition;
  emptyText?: string;
}) {
  const { t } = useLanguage();

  if (values.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{emptyText ?? t.common.empty}</p>;
  }

  return (
    <div className="space-y-2">
      {values.map((item, index) => (
        <div key={`${item}-${index}`} className="rounded-lg border border-border/60 bg-muted/30 p-3">
          {itemDefinition ? <FrontendImplementationFieldHeading definition={itemDefinition} className="mb-2" /> : null}
          <p className="text-sm leading-7 text-muted-foreground">{item}</p>
        </div>
      ))}
    </div>
  );
}

function RequiredBadge({ value }: { value: boolean | undefined }) {
  const { t } = useLanguage();
  return <Badge variant={value === false ? "secondary" : "outline"}>{value === false ? t.common.optional : t.common.required}</Badge>;
}

function NewFrontendImplementationContentView({ content }: { content: NewFrontendImplementationContent }) {
  const { t } = useLanguage();
  const labels = t.designAssets.viewer;
  const routeDefinitions = content.route_definitions ?? [];
  const directoryStructure = content.directory_structure ?? [];
  const codeLogic = content.code_logic ?? [];
  const environmentVariables = content.environment_variables ?? [];
  const designTheme = content.design_theme ?? [];
  const dependencies = content.dependencies ?? [];

  return (
    <div className="space-y-4">
      <MetricStrip
        items={[
          { label: labels.routes, value: routeDefinitions.length, description: labels.pageEntryAndPermissions },
          { label: labels.directoryItems, value: directoryStructure.length, description: labels.suggestedFileStructure },
          { label: labels.logicItems, value: codeLogic.length, description: labels.stateEventsDataFlow },
          { label: labels.dependenciesAndEnv, value: `${dependencies.length} / ${environmentVariables.length}`, description: content.version_summary },
        ]}
      />

      <VisualSection
        title={
          <FieldHint
            label={labels.routeDefinitions}
            hint={labels.routeDefinitionsHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.route}
      >
        <div className="space-y-3">
          {routeDefinitions.length > 0 ? (
            routeDefinitions.map((route, index) => (
              <section key={`${route.path}-${index}`} className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold">{route.page_name || labels.unnamedPage}</h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{route.path}</p>
                  </div>
                  <StatusBadge label={route.permission_requirement || labels.unspecifiedPermission} tone="muted" />
                </div>
                <TextChips values={Array.isArray(route.dynamic_params) ? route.dynamic_params : []} emptyText={labels.noDynamicParams} />
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">{labels.noRouteDefinitions}</p>
          )}
        </div>
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label={labels.directoryStructure}
            hint={labels.frontendDirectoryHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.workflow}
      >
        <div className="space-y-3">
          {directoryStructure.length > 0 ? (
            directoryStructure.map((entry, index) => (
              <section key={`${entry.path}-${index}`} className="rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-mono text-xs text-muted-foreground">{entry.path}</p>
                  <StatusBadge label={labels.directoryItem} tone="muted" />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.purpose}</p>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">{labels.noDirectoryStructure}</p>
          )}
        </div>
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label={labels.codeLogic}
            hint={labels.frontendCodeLogicHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.branch}
      >
        <div className="space-y-3">
          {codeLogic.length > 0 ? (
            codeLogic.map((logic, index) => (
              <section key={`${logic.target}-${index}`} className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{logic.target}</h3>
                  <StatusBadge label={labels.logicItem} tone="muted" />
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{labels.coreState}</p>
                    <TextChips values={Array.isArray(logic.state_management) ? logic.state_management : []} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{labels.events}</p>
                    <TextChips values={Array.isArray(logic.events) ? logic.events : []} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{labels.dataFlow}</p>
                    <TextChips values={Array.isArray(logic.data_flow) ? logic.data_flow : []} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{labels.errorHandling}</p>
                    <TextChips values={Array.isArray(logic.error_handling) ? logic.error_handling : []} />
                  </div>
                </div>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">{labels.noCodeLogic}</p>
          )}
        </div>
      </VisualSection>

      <div className="grid gap-4 xl:grid-cols-2">
        <VisualSection title={labels.environmentVariables} icon={visualIcons.dot}>
          {environmentVariables.length > 0 ? (
            <KeyValueTable
              rows={environmentVariables.map((variable) => ({
                key: variable.name,
                value: variable.purpose,
                meta: <RequiredBadge value={variable.required} />,
              }))}
              columns={[labels.variableName, labels.purpose, t.common.required]}
            />
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">{labels.noEnvironmentVariables}</p>
          )}
        </VisualSection>
        <VisualSection title={labels.designTheme} icon={<span className="text-muted-foreground">◫</span>}>
          <TextList values={Array.isArray(designTheme) ? designTheme : []} itemDefinition={frontendImplementationFieldDefinitions.theme_item} />
        </VisualSection>
      </div>

      <VisualSection title={labels.dependencies} icon={visualIcons.branch}>
        {dependencies.length > 0 ? (
          <div className="space-y-3">
            {dependencies.map((dependency, index) => (
              <section key={`${dependency.package_name}-${index}`} className="rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{dependency.package_name}</h3>
                  <RequiredBadge value={dependency.required} />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{dependency.purpose}</p>
              </section>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">{labels.noDependencies}</p>
        )}
      </VisualSection>

      <VisualSection title={labels.pageImplementationMap} icon={visualIcons.route}>
        <RelationshipMap
          nodes={[
            ...routeDefinitions.map((route) => ({
              id: `route:${route.path}`,
              title: route.page_name || route.path,
              subtitle: route.path,
              badge: <StatusBadge label={labels.routes} tone="muted" />,
              tone: "accent" as const,
            })),
            ...codeLogic.map((logic) => ({
              id: `logic:${logic.target}`,
              title: logic.target,
              subtitle: labels.implementationLogic,
              badge: <StatusBadge label={labels.logic} />,
            })),
          ]}
          emptyText={labels.noRoutesOrLogic}
        />
      </VisualSection>

    </div>
  );
}

function LegacyFrontendImplementationContentView({ content }: { content: FrontendImplementationContent }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          {t.designAssets.viewer.legacyFrontend}
        </AlertDescription>
      </Alert>
      <AssetContentSections content={content as Record<string, unknown>} sections={frontendImplementationLegacySections} />
    </div>
  );
}

export function FrontendImplementationContentViewer({ content }: { content: FrontendImplementationContent }) {
  if (isNewFrontendImplementationContent(content)) {
    return <NewFrontendImplementationContentView content={content} />;
  }

  return <LegacyFrontendImplementationContentView content={content} />;
}

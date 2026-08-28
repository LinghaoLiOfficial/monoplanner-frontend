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
  emptyText = "暂无",
}: {
  values: string[];
  itemDefinition?: FrontendImplementationFieldDefinition;
  emptyText?: string;
}) {
  if (values.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{emptyText}</p>;
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
  return <Badge variant={value === false ? "secondary" : "outline"}>{value === false ? "可选" : "必需"}</Badge>;
}

function NewFrontendImplementationContentView({ content }: { content: NewFrontendImplementationContent }) {
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
          { label: "路由", value: routeDefinitions.length, description: "页面入口与权限要求" },
          { label: "目录项", value: directoryStructure.length, description: "建议文件结构" },
          { label: "逻辑项", value: codeLogic.length, description: "状态、事件和数据流" },
          { label: "依赖 / 环境", value: `${dependencies.length} / ${environmentVariables.length}`, description: content.version_summary },
        ]}
      />

      <VisualSection
        title={
          <FieldHint
            label="路由定义"
            hint="把页面入口和权限要求聚合在一起。"
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
                    <h3 className="text-sm font-semibold">{route.page_name || "未命名页面"}</h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{route.path}</p>
                  </div>
                  <StatusBadge label={route.permission_requirement || "未指定权限"} tone="muted" />
                </div>
                <TextChips values={Array.isArray(route.dynamic_params) ? route.dynamic_params : []} emptyText="无动态参数" />
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无路由定义</p>
          )}
        </div>
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label="目录结构"
            hint="展示前端页面、组件、API client 和工具文件的位置。"
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
                  <StatusBadge label="目录项" tone="muted" />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.purpose}</p>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无目录结构</p>
          )}
        </div>
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label="代码逻辑"
            hint="把页面与组件的状态、事件和数据流串起来。"
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
                  <StatusBadge label="逻辑项" tone="muted" />
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">核心状态</p>
                    <TextChips values={Array.isArray(logic.state_management) ? logic.state_management : []} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">事件</p>
                    <TextChips values={Array.isArray(logic.events) ? logic.events : []} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">数据流</p>
                    <TextChips values={Array.isArray(logic.data_flow) ? logic.data_flow : []} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">错误处理</p>
                    <TextChips values={Array.isArray(logic.error_handling) ? logic.error_handling : []} />
                  </div>
                </div>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无代码逻辑</p>
          )}
        </div>
      </VisualSection>

      <div className="grid gap-4 xl:grid-cols-2">
        <VisualSection title="环境变量" icon={visualIcons.dot}>
          {environmentVariables.length > 0 ? (
            <KeyValueTable
              rows={environmentVariables.map((variable) => ({
                key: variable.name,
                value: variable.purpose,
                meta: <RequiredBadge value={variable.required} />,
              }))}
              columns={["变量名", "用途", "必需"]}
            />
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无环境变量</p>
          )}
        </VisualSection>
        <VisualSection title="设计主题" icon={<span className="text-muted-foreground">◫</span>}>
          <TextList values={Array.isArray(designTheme) ? designTheme : []} itemDefinition={frontendImplementationFieldDefinitions.theme_item} />
        </VisualSection>
      </div>

      <VisualSection title="依赖包" icon={visualIcons.branch}>
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
          <p className="text-sm leading-6 text-muted-foreground">暂无依赖包</p>
        )}
      </VisualSection>

      <VisualSection title="页面与实现覆盖关系" icon={visualIcons.route}>
        <RelationshipMap
          nodes={[
            ...routeDefinitions.map((route) => ({
              id: `route:${route.path}`,
              title: route.page_name || route.path,
              subtitle: route.path,
              badge: <StatusBadge label="路由" tone="muted" />,
              tone: "accent" as const,
            })),
            ...codeLogic.map((logic) => ({
              id: `logic:${logic.target}`,
              title: logic.target,
              subtitle: "实现逻辑",
              badge: <StatusBadge label="逻辑" />,
            })),
          ]}
          emptyText="暂无路由或逻辑"
        />
      </VisualSection>

    </div>
  );
}

function LegacyFrontendImplementationContentView({ content }: { content: FrontendImplementationContent }) {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          这是历史前端工程实现内容，保留兼容读取。新版资产会使用路由定义、目录结构、代码逻辑、环境变量、设计主题和依赖包契约。
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

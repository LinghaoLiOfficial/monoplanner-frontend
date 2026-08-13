import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import {
  FrontendImplementationFieldBlock,
  FrontendImplementationFieldHeading,
} from "@/components/frontend-implementation/FrontendImplementationFieldDefinition";
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

function TextValue({ value }: { value: unknown }) {
  return (
    <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
      {String(value ?? "暂无")}
    </p>
  );
}

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
          {itemDefinition ? (
            <FrontendImplementationFieldHeading definition={itemDefinition} className="mb-2" />
          ) : null}
          <p className="text-sm leading-7 text-muted-foreground">{item}</p>
        </div>
      ))}
    </div>
  );
}

function RequiredBadge({ value }: { value: boolean | undefined }) {
  return (
    <Badge variant={value === false ? "secondary" : "outline"}>
      {value === false ? "可选" : "必需"}
    </Badge>
  );
}

function NewFrontendImplementationContentView({
  content,
}: {
  content: NewFrontendImplementationContent;
}) {
  const routeDefinitions = content.route_definitions ?? [];
  const directoryStructure = content.directory_structure ?? [];
  const codeLogic = content.code_logic ?? [];
  const environmentVariables = content.environment_variables ?? [];
  const designTheme = content.design_theme ?? [];
  const dependencies = content.dependencies ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <FrontendImplementationFieldHeading
              definition={frontendImplementationFieldDefinitions.version_summary}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TextValue value={content.version_summary} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <FrontendImplementationFieldHeading
              definition={frontendImplementationFieldDefinitions.route_definitions}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {routeDefinitions.length > 0 ? (
            routeDefinitions.map((route, index) => (
              <section key={`${route.path}-${index}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                <FrontendImplementationFieldHeading
                  definition={frontendImplementationFieldDefinitions.route_definition}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.route_path}>
                    <TextValue value={route.path} />
                  </FrontendImplementationFieldBlock>
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.page_name}>
                    <TextValue value={route.page_name} />
                  </FrontendImplementationFieldBlock>
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.dynamic_params}>
                    <TextList values={Array.isArray(route.dynamic_params) ? route.dynamic_params : []} />
                  </FrontendImplementationFieldBlock>
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.permission_requirement}>
                    <TextValue value={route.permission_requirement} />
                  </FrontendImplementationFieldBlock>
                </div>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无路由定义</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <FrontendImplementationFieldHeading
              definition={frontendImplementationFieldDefinitions.directory_structure}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {directoryStructure.length > 0 ? (
            directoryStructure.map((entry, index) => (
              <section key={`${entry.path}-${index}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                <FrontendImplementationFieldHeading
                  definition={frontendImplementationFieldDefinitions.directory_entry}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.file_path}>
                    <TextValue value={entry.path} />
                  </FrontendImplementationFieldBlock>
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.file_purpose}>
                    <TextValue value={entry.purpose} />
                  </FrontendImplementationFieldBlock>
                </div>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无目录结构</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <FrontendImplementationFieldHeading
              definition={frontendImplementationFieldDefinitions.code_logic}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {codeLogic.length > 0 ? (
            codeLogic.map((logic, index) => (
              <section key={`${logic.target}-${index}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                <FrontendImplementationFieldHeading
                  definition={frontendImplementationFieldDefinitions.logic_item}
                />
                <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.logic_target}>
                  <TextValue value={logic.target} />
                </FrontendImplementationFieldBlock>
                <div className="grid gap-4 md:grid-cols-2">
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.state_management}>
                    <TextList values={Array.isArray(logic.state_management) ? logic.state_management : []} />
                  </FrontendImplementationFieldBlock>
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.events}>
                    <TextList values={Array.isArray(logic.events) ? logic.events : []} />
                  </FrontendImplementationFieldBlock>
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.data_flow}>
                    <TextList values={Array.isArray(logic.data_flow) ? logic.data_flow : []} />
                  </FrontendImplementationFieldBlock>
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.error_handling}>
                    <TextList values={Array.isArray(logic.error_handling) ? logic.error_handling : []} />
                  </FrontendImplementationFieldBlock>
                </div>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无代码逻辑</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <FrontendImplementationFieldHeading
              definition={frontendImplementationFieldDefinitions.environment_variables}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {environmentVariables.length > 0 ? (
            environmentVariables.map((variable, index) => (
              <section key={`${variable.name}-${index}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <FrontendImplementationFieldHeading
                    definition={frontendImplementationFieldDefinitions.environment_variable}
                  />
                  <RequiredBadge value={variable.required} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.env_name}>
                    <TextValue value={variable.name} />
                  </FrontendImplementationFieldBlock>
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.env_purpose}>
                    <TextValue value={variable.purpose} />
                  </FrontendImplementationFieldBlock>
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.env_required}>
                    <TextValue value={variable.required === false ? "否" : "是"} />
                  </FrontendImplementationFieldBlock>
                </div>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无环境变量</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <FrontendImplementationFieldHeading
              definition={frontendImplementationFieldDefinitions.design_theme}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TextList
            values={Array.isArray(designTheme) ? designTheme : []}
            itemDefinition={frontendImplementationFieldDefinitions.theme_item}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <FrontendImplementationFieldHeading
              definition={frontendImplementationFieldDefinitions.dependencies}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dependencies.length > 0 ? (
            dependencies.map((dependency, index) => (
              <section key={`${dependency.package_name}-${index}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <FrontendImplementationFieldHeading
                    definition={frontendImplementationFieldDefinitions.dependency}
                  />
                  <RequiredBadge value={dependency.required} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.package_name}>
                    <TextValue value={dependency.package_name} />
                  </FrontendImplementationFieldBlock>
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.dependency_purpose}>
                    <TextValue value={dependency.purpose} />
                  </FrontendImplementationFieldBlock>
                  <FrontendImplementationFieldBlock definition={frontendImplementationFieldDefinitions.dependency_required}>
                    <TextValue value={dependency.required === false ? "否" : "是"} />
                  </FrontendImplementationFieldBlock>
                </div>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无依赖包</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LegacyFrontendImplementationContentView({
  content,
}: {
  content: FrontendImplementationContent;
}) {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          这是历史前端工程实现内容，保留兼容读取。新版资产会使用路由定义、目录结构、代码逻辑、环境变量、设计主题和依赖包契约。
        </AlertDescription>
      </Alert>
      <AssetContentSections
        content={content as Record<string, unknown>}
        sections={frontendImplementationLegacySections}
      />
    </div>
  );
}

export function FrontendImplementationContentViewer({
  content,
}: {
  content: FrontendImplementationContent;
}) {
  if (isNewFrontendImplementationContent(content)) {
    return <NewFrontendImplementationContentView content={content} />;
  }

  return <LegacyFrontendImplementationContentView content={content} />;
}

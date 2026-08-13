"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import {
  BackendImplementationFieldBlock,
  BackendImplementationFieldHeading,
} from "@/components/backend-implementation/BackendImplementationFieldDefinition";
import {
  isNewBackendImplementationContent,
  type BackendImplementationContent,
  type NewBackendImplementationContent,
} from "@/lib/types/backend-implementation";
import {
  backendImplementationFieldDefinitions,
  backendImplementationLegacySections,
} from "@/lib/backend-implementation-contract";
import type { BackendImplementationFieldDefinition } from "@/lib/backend-implementation-contract";

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
  itemDefinition?: BackendImplementationFieldDefinition;
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
            <BackendImplementationFieldHeading definition={itemDefinition} className="mb-2" />
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

function NewBackendImplementationContentView({
  content,
}: {
  content: NewBackendImplementationContent;
}) {
  const directoryStructure = content.directory_structure ?? [];
  const codeLogic = content.code_logic ?? [];
  const utilityClasses = content.utility_classes ?? [];
  const llmTemplates = content.llm_interaction_templates ?? [];
  const environmentVariables = content.environment_variables ?? [];
  const dependencies = content.dependencies ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <BackendImplementationFieldHeading
              definition={backendImplementationFieldDefinitions.version_summary}
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
            <BackendImplementationFieldHeading
              definition={backendImplementationFieldDefinitions.directory_structure}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {directoryStructure.length > 0 ? (
            directoryStructure.map((entry, index) => (
              <section key={`${entry.path}-${index}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                <BackendImplementationFieldHeading
                  definition={backendImplementationFieldDefinitions.directory_entry}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.file_path}>
                    <TextValue value={entry.path} />
                  </BackendImplementationFieldBlock>
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.file_purpose}>
                    <TextValue value={entry.purpose} />
                  </BackendImplementationFieldBlock>
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
            <BackendImplementationFieldHeading
              definition={backendImplementationFieldDefinitions.code_logic}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {codeLogic.length > 0 ? (
            codeLogic.map((logic, index) => (
              <section key={`${logic.target}-${index}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                <BackendImplementationFieldHeading
                  definition={backendImplementationFieldDefinitions.logic_item}
                />
                <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.logic_target}>
                  <TextValue value={logic.target} />
                </BackendImplementationFieldBlock>
                <div className="grid gap-4 md:grid-cols-2">
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.service_flow}>
                    <TextList values={Array.isArray(logic.service_flow) ? logic.service_flow : []} />
                  </BackendImplementationFieldBlock>
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.validation_logic}>
                    <TextList values={Array.isArray(logic.validation_logic) ? logic.validation_logic : []} />
                  </BackendImplementationFieldBlock>
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.transaction_handling}>
                    <TextList values={Array.isArray(logic.transaction_handling) ? logic.transaction_handling : []} />
                  </BackendImplementationFieldBlock>
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.error_handling}>
                    <TextList values={Array.isArray(logic.error_handling) ? logic.error_handling : []} />
                  </BackendImplementationFieldBlock>
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
            <BackendImplementationFieldHeading
              definition={backendImplementationFieldDefinitions.utility_classes}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {utilityClasses.length > 0 ? (
            utilityClasses.map((utility, index) => (
              <section key={`${utility.name}-${index}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                <BackendImplementationFieldHeading
                  definition={backendImplementationFieldDefinitions.utility_class}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.utility_name}>
                    <TextValue value={utility.name} />
                  </BackendImplementationFieldBlock>
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.utility_purpose}>
                    <TextValue value={utility.purpose} />
                  </BackendImplementationFieldBlock>
                </div>
                <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.utility_usage}>
                  <TextList values={Array.isArray(utility.usage) ? utility.usage : []} />
                </BackendImplementationFieldBlock>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无工具类</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <BackendImplementationFieldHeading
              definition={backendImplementationFieldDefinitions.llm_interaction_templates}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {llmTemplates.length > 0 ? (
            llmTemplates.map((template, index) => (
              <section key={`${template.template_name}-${index}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                <BackendImplementationFieldHeading
                  definition={backendImplementationFieldDefinitions.llm_interaction_template}
                />
                <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.template_name}>
                  <TextValue value={template.template_name} />
                </BackendImplementationFieldBlock>
                <div className="grid gap-4 md:grid-cols-3">
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.input_structure}>
                    <TextList values={Array.isArray(template.input_structure) ? template.input_structure : []} />
                  </BackendImplementationFieldBlock>
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.output_structure}>
                    <TextList values={Array.isArray(template.output_structure) ? template.output_structure : []} />
                  </BackendImplementationFieldBlock>
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.parsing_rules}>
                    <TextList values={Array.isArray(template.parsing_rules) ? template.parsing_rules : []} />
                  </BackendImplementationFieldBlock>
                </div>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无大模型交互模板</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <BackendImplementationFieldHeading
              definition={backendImplementationFieldDefinitions.environment_variables}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {environmentVariables.length > 0 ? (
            environmentVariables.map((variable, index) => (
              <section key={`${variable.name}-${index}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <BackendImplementationFieldHeading
                    definition={backendImplementationFieldDefinitions.environment_variable}
                  />
                  <RequiredBadge value={variable.required} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.env_name}>
                    <TextValue value={variable.name} />
                  </BackendImplementationFieldBlock>
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.env_purpose}>
                    <TextValue value={variable.purpose} />
                  </BackendImplementationFieldBlock>
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.env_required}>
                    <TextValue value={variable.required === false ? "否" : "是"} />
                  </BackendImplementationFieldBlock>
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
            <BackendImplementationFieldHeading
              definition={backendImplementationFieldDefinitions.dependencies}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dependencies.length > 0 ? (
            dependencies.map((dependency, index) => (
              <section key={`${dependency.package_name}-${index}`} className="space-y-4 rounded-lg border border-border/60 bg-background/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <BackendImplementationFieldHeading
                    definition={backendImplementationFieldDefinitions.dependency}
                  />
                  <RequiredBadge value={dependency.required} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.package_name}>
                    <TextValue value={dependency.package_name} />
                  </BackendImplementationFieldBlock>
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.dependency_purpose}>
                    <TextValue value={dependency.purpose} />
                  </BackendImplementationFieldBlock>
                  <BackendImplementationFieldBlock definition={backendImplementationFieldDefinitions.dependency_required}>
                    <TextValue value={dependency.required === false ? "否" : "是"} />
                  </BackendImplementationFieldBlock>
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

function LegacyBackendImplementationContentView({
  content,
}: {
  content: BackendImplementationContent;
}) {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          这是历史后端工程实现内容，保留兼容读取。新版资产会使用目录结构、代码逻辑、工具类、大模型交互模板、环境变量和依赖包契约。
        </AlertDescription>
      </Alert>
      <AssetContentSections
        content={content as Record<string, unknown>}
        sections={backendImplementationLegacySections}
      />
    </div>
  );
}

export function BackendImplementationContentViewer({
  content,
}: {
  content: BackendImplementationContent;
}) {
  if (isNewBackendImplementationContent(content)) {
    return <NewBackendImplementationContentView content={content} />;
  }

  return <LegacyBackendImplementationContentView content={content} />;
}

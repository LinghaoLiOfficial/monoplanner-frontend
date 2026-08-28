"use client";

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
import {
  isNewBackendImplementationContent,
  type BackendImplementationContent,
  type NewBackendImplementationContent,
} from "@/lib/types/backend-implementation";
import { backendImplementationLegacySections } from "@/lib/backend-implementation-contract";

function RequiredBadge({ value }: { value: boolean | undefined }) {
  return <Badge variant={value === false ? "secondary" : "outline"}>{value === false ? "可选" : "必需"}</Badge>;
}

function NewBackendImplementationContentView({ content }: { content: NewBackendImplementationContent }) {
  const directoryStructure = content.directory_structure ?? [];
  const codeLogic = content.code_logic ?? [];
  const utilityClasses = content.utility_classes ?? [];
  const llmTemplates = content.llm_interaction_templates ?? [];
  const environmentVariables = content.environment_variables ?? [];
  const dependencies = content.dependencies ?? [];

  return (
    <div className="space-y-4">
      <MetricStrip
        items={[
          { label: "目录项", value: directoryStructure.length, description: "路由、模型、服务与迁移文件" },
          { label: "服务逻辑", value: codeLogic.length, description: "流程、校验、事务和错误处理" },
          { label: "工具 / 模板", value: `${utilityClasses.length} / ${llmTemplates.length}`, description: "复用工具与 LLM 交互模板" },
          { label: "依赖 / 环境", value: `${dependencies.length} / ${environmentVariables.length}`, description: content.version_summary },
        ]}
      />

      <VisualSection
        title={
          <FieldHint
            label="后端目录结构"
            hint="展示服务、路由、schema、模型与基础设施文件职责。"
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
            label="服务逻辑矩阵"
            hint="按目标模块比较服务流程、校验、事务和错误处理。"
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
                  <StatusBadge label="服务逻辑" tone="muted" />
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">服务流程</p>
                    <TextChips values={Array.isArray(logic.service_flow) ? logic.service_flow : []} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">校验逻辑</p>
                    <TextChips values={Array.isArray(logic.validation_logic) ? logic.validation_logic : []} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">事务处理</p>
                    <TextChips values={Array.isArray(logic.transaction_handling) ? logic.transaction_handling : []} />
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
        <VisualSection title="工具类" icon={visualIcons.dot}>
          <div className="space-y-3">
            {utilityClasses.length > 0 ? (
              utilityClasses.map((utility, index) => (
                <section key={`${utility.name}-${index}`} className="rounded-lg border border-border/70 bg-background/70 p-4">
                  <h3 className="text-sm font-semibold">{utility.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{utility.purpose}</p>
                  <div className="mt-3">
                    <TextChips values={Array.isArray(utility.usage) ? utility.usage : []} emptyText="暂无使用场景" />
                  </div>
                </section>
              ))
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">暂无工具类</p>
            )}
          </div>
        </VisualSection>
        <VisualSection title="LLM 交互模板" icon={visualIcons.workflow}>
          <div className="space-y-3">
            {llmTemplates.length > 0 ? (
              llmTemplates.map((template, index) => (
                <section key={`${template.template_name}-${index}`} className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
                  <h3 className="text-sm font-semibold">{template.template_name}</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">输入结构</p>
                      <TextChips values={Array.isArray(template.input_structure) ? template.input_structure : []} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">输出结构</p>
                      <TextChips values={Array.isArray(template.output_structure) ? template.output_structure : []} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">解析规则</p>
                      <TextChips values={Array.isArray(template.parsing_rules) ? template.parsing_rules : []} />
                    </div>
                  </div>
                </section>
              ))
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">暂无大模型交互模板</p>
            )}
          </div>
        </VisualSection>
      </div>

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
        <VisualSection title="依赖包" icon={visualIcons.branch}>
          {dependencies.length > 0 ? (
            <KeyValueTable
              rows={dependencies.map((dependency) => ({
                key: dependency.package_name,
                value: dependency.purpose,
                meta: <RequiredBadge value={dependency.required} />,
              }))}
              columns={["包名", "用途", "必需"]}
            />
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">暂无依赖包</p>
          )}
        </VisualSection>
      </div>

      <VisualSection title="后端模块关系" icon={visualIcons.route}>
        <RelationshipMap
          nodes={[
            ...codeLogic.map((logic) => ({
              id: `logic:${logic.target}`,
              title: logic.target,
              subtitle: "服务逻辑",
              badge: <StatusBadge label="服务" />,
              tone: "accent" as const,
            })),
            ...utilityClasses.map((utility) => ({
              id: `utility:${utility.name}`,
              title: utility.name,
              subtitle: utility.purpose,
              badge: <StatusBadge label="工具" tone="muted" />,
            })),
          ]}
          emptyText="暂无后端模块关系"
        />
      </VisualSection>

    </div>
  );
}

function LegacyBackendImplementationContentView({ content }: { content: BackendImplementationContent }) {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          这是历史后端工程实现内容，保留兼容读取。新版资产会使用目录结构、代码逻辑、工具类、大模型交互模板、环境变量和依赖包契约。
        </AlertDescription>
      </Alert>
      <AssetContentSections content={content as Record<string, unknown>} sections={backendImplementationLegacySections} />
    </div>
  );
}

export function BackendImplementationContentViewer({ content }: { content: BackendImplementationContent }) {
  if (isNewBackendImplementationContent(content)) {
    return <NewBackendImplementationContentView content={content} />;
  }

  return <LegacyBackendImplementationContentView content={content} />;
}

import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import { UXFieldBlock, UXFieldHeading } from "@/components/ux-design/UXFieldDefinition";
import { isNewUXDesignContent, type UXDesignContent } from "@/lib/types/ux-design";
import { uxDesignFieldDefinitions, uxDesignLegacySections } from "@/lib/ux-design-contract";
import type { ReactNode } from "react";

function TextList({
  values,
  emptyText = "暂无",
}: {
  values: string[];
  emptyText?: string;
}) {
  if (values.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{emptyText}</p>;
  }

  return (
    <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
      {values.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

function ObjectList({
  items,
  emptyText = "暂无",
  renderItem,
}: {
  items: Array<Record<string, unknown>>;
  emptyText?: string;
  renderItem: (item: Record<string, unknown>, index: number) => ReactNode;
}) {
  if (items.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{emptyText}</p>;
  }

  return <div className="space-y-3">{items.map((item, index) => renderItem(item, index))}</div>;
}

function formatStepLabel(stepOrder: unknown) {
  if (typeof stepOrder === "number" || typeof stepOrder === "string") {
    return `步骤 ${stepOrder}`;
  }
  return "步骤";
}

function NewUXDesignContentView({ content }: { content: Extract<UXDesignContent, { low_fidelity_screen_structure: unknown }> }) {
  const screens = content.low_fidelity_screen_structure ?? [];
  const flows = content.business_flows ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <UXFieldHeading definition={uxDesignFieldDefinitions.version_summary} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {String(content.version_summary ?? "暂无")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <UXFieldHeading definition={uxDesignFieldDefinitions.low_fidelity_screen_structure} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ObjectList
            items={screens as Array<Record<string, unknown>>}
            emptyText="暂无页面低保真结构"
            renderItem={(screen, screenIndex) => (
              <div key={`${String(screen.screen_name ?? "screen")}-${screenIndex}`} className="rounded-2xl border border-border/60 bg-background/70 p-4 space-y-4">
                <UXFieldHeading definition={uxDesignFieldDefinitions.ux_screen} />
                <div className="grid gap-4 md:grid-cols-2">
                  <UXFieldBlock definition={uxDesignFieldDefinitions.screen_name}>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {String(screen.screen_name ?? "暂无")}
                    </p>
                  </UXFieldBlock>
                  <UXFieldBlock definition={uxDesignFieldDefinitions.screen_purpose}>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {String(screen.screen_purpose ?? "暂无")}
                    </p>
                  </UXFieldBlock>
                </div>
                <UXFieldBlock definition={uxDesignFieldDefinitions.information_priority}>
                  <TextList values={Array.isArray(screen.information_priority) ? (screen.information_priority as string[]) : []} />
                </UXFieldBlock>
                <UXFieldBlock definition={uxDesignFieldDefinitions.interaction_regions}>
                  <div className="space-y-3">
                    {Array.isArray(screen.interaction_regions) && screen.interaction_regions.length > 0 ? (
                      (screen.interaction_regions as Array<Record<string, unknown>>).map((region, regionIndex) => (
                        <div key={`${String(region.region_name ?? "region")}-${regionIndex}`} className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-3">
                          <UXFieldHeading definition={uxDesignFieldDefinitions.wireframe_region} />
                          <UXFieldBlock definition={uxDesignFieldDefinitions.region_name}>
                            <p className="text-sm leading-7 text-muted-foreground">
                              {String(region.region_name ?? "暂无")}
                            </p>
                          </UXFieldBlock>
                          <UXFieldBlock definition={uxDesignFieldDefinitions.region_purpose}>
                            <p className="text-sm leading-7 text-muted-foreground">
                              {String(region.region_purpose ?? "暂无")}
                            </p>
                          </UXFieldBlock>
                          <UXFieldBlock definition={uxDesignFieldDefinitions.content_elements}>
                            <TextList values={Array.isArray(region.content_elements) ? (region.content_elements as string[]) : []} />
                          </UXFieldBlock>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-muted-foreground">暂无交互区域</p>
                    )}
                  </div>
                </UXFieldBlock>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <UXFieldHeading definition={uxDesignFieldDefinitions.business_flows} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ObjectList
            items={flows as Array<Record<string, unknown>>}
            emptyText="暂无业务逻辑流"
            renderItem={(flow, flowIndex) => (
              <div key={`${String(flow.flow_name ?? "flow")}-${flowIndex}`} className="rounded-2xl border border-border/60 bg-background/70 p-4 space-y-4">
                <UXFieldHeading definition={uxDesignFieldDefinitions.business_flow} />
                <div className="grid gap-4 md:grid-cols-2">
                  <UXFieldBlock definition={uxDesignFieldDefinitions.flow_name}>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {String(flow.flow_name ?? "暂无")}
                    </p>
                  </UXFieldBlock>
                  <UXFieldBlock definition={uxDesignFieldDefinitions.flow_goal}>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {String(flow.flow_goal ?? "暂无")}
                    </p>
                  </UXFieldBlock>
                  <UXFieldBlock definition={uxDesignFieldDefinitions.primary_actor}>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {String(flow.primary_actor ?? "暂无")}
                    </p>
                  </UXFieldBlock>
                  <UXFieldBlock definition={uxDesignFieldDefinitions.preconditions}>
                    <TextList values={Array.isArray(flow.preconditions) ? (flow.preconditions as string[]) : []} />
                  </UXFieldBlock>
                </div>

                <UXFieldBlock definition={uxDesignFieldDefinitions.steps}>
                  <div className="space-y-3">
                    {Array.isArray(flow.steps) && flow.steps.length > 0 ? (
                      (flow.steps as Array<Record<string, unknown>>).map((step, stepIndex) => (
                        <div key={`${String(step.step_order ?? stepIndex)}-${stepIndex}`} className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-3">
                          <UXFieldHeading definition={uxDesignFieldDefinitions.flow_step} />
                          <div className="grid gap-4 md:grid-cols-2">
                            <UXFieldBlock definition={uxDesignFieldDefinitions.step_order}>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{formatStepLabel(step.step_order)}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {String(step.step_order ?? "暂无")}
                                </span>
                              </div>
                            </UXFieldBlock>
                            <UXFieldBlock definition={uxDesignFieldDefinitions.user_action}>
                              <p className="text-sm leading-7 text-muted-foreground">
                                {String(step.user_action ?? "暂无")}
                              </p>
                            </UXFieldBlock>
                            <UXFieldBlock definition={uxDesignFieldDefinitions.step_system_feedback}>
                              <p className="text-sm leading-7 text-muted-foreground">
                                {String(step.system_feedback ?? "暂无")}
                              </p>
                            </UXFieldBlock>
                            <UXFieldBlock definition={uxDesignFieldDefinitions.involved_elements}>
                              <TextList values={Array.isArray(step.involved_elements) ? (step.involved_elements as string[]) : []} />
                            </UXFieldBlock>
                          </div>
                          <UXFieldBlock definition={uxDesignFieldDefinitions.branches}>
                            <div className="space-y-3">
                              {Array.isArray(step.branches) && step.branches.length > 0 ? (
                                (step.branches as Array<Record<string, unknown>>).map((branch, branchIndex) => (
                                  <div key={`${String(branch.branch_status ?? "branch")}-${branchIndex}`} className="rounded-2xl border border-border/60 bg-background p-4 space-y-3">
                                    <UXFieldHeading definition={uxDesignFieldDefinitions.branch} />
                                    <div className="flex flex-wrap items-center gap-2">
                                      <Badge variant="outline">
                                        {String(branch.branch_status ?? "next_action")}
                                      </Badge>
                                      <span className="text-sm text-muted-foreground">
                                        {String(branch.branch_description ?? "暂无")}
                                      </span>
                                    </div>
                                    <UXFieldBlock definition={uxDesignFieldDefinitions.branch_status}>
                                      <p className="text-sm leading-7 text-muted-foreground">
                                        {String(branch.branch_status ?? "暂无")}
                                      </p>
                                    </UXFieldBlock>
                                    <UXFieldBlock definition={uxDesignFieldDefinitions.branch_description}>
                                      <p className="text-sm leading-7 text-muted-foreground">
                                        {String(branch.branch_description ?? "暂无")}
                                      </p>
                                    </UXFieldBlock>
                                    <UXFieldBlock definition={uxDesignFieldDefinitions.branch_system_feedback}>
                                      <p className="text-sm leading-7 text-muted-foreground">
                                        {String(branch.system_feedback ?? "暂无")}
                                      </p>
                                    </UXFieldBlock>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm leading-6 text-muted-foreground">暂无分支</p>
                              )}
                            </div>
                          </UXFieldBlock>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-muted-foreground">暂无步骤</p>
                    )}
                  </div>
                </UXFieldBlock>

                <UXFieldBlock definition={uxDesignFieldDefinitions.ux_notes}>
                  <TextList values={Array.isArray(flow.ux_notes) ? (flow.ux_notes as string[]) : []} />
                </UXFieldBlock>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function LegacyUXDesignContentView({ content }: { content: UXDesignContent }) {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          这是历史 UX 内容结构，保留兼容读取。新版设计资产会使用页面低保真结构和业务逻辑流契约。
        </AlertDescription>
      </Alert>
      <AssetContentSections
        content={content as Record<string, unknown>}
        sections={uxDesignLegacySections}
      />
    </div>
  );
}

export function UXDesignContentViewer({ content }: { content: UXDesignContent }) {
  if (isNewUXDesignContent(content)) {
    return <NewUXDesignContentView content={content} />;
  }

  return <LegacyUXDesignContentView content={content} />;
}

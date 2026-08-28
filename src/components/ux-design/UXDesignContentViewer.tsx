import { Alert, AlertDescription } from "@/components/ui/alert";
import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import {
  FlowTimeline,
  MetricStrip,
  StatusBadge,
  TextChips,
  VisualSection,
  visualIcons,
  type TimelineStep,
} from "@/components/design-assets/visual-dashboard";
import { FieldHint } from "@/components/ui/field-hint";
import { isNewUXDesignContent, type UXBranchStatus, type UXDesignContent } from "@/lib/types/ux-design";
import { uxDesignLegacySections } from "@/lib/ux-design-contract";

function branchTone(status: UXBranchStatus): TimelineStep["tone"] {
  if (status === "success") return "success";
  if (status === "error") return "error";
  if (status === "blocked" || status === "empty") return "warning";
  return "muted";
}

function statusLabel(status: UXBranchStatus) {
  return {
    success: "成功",
    error: "错误",
    blocked: "阻塞",
    empty: "空状态",
    next_action: "下一步",
  }[status] ?? status;
}

function isTechnicalIdentifier(value: string) {
  if (/[\u4e00-\u9fff]/.test(value)) return false;
  return (
    /^[A-Za-z][A-Za-z0-9]*(?:[_-][A-Za-z0-9]+)+$/.test(value) ||
    /^[a-z][A-Za-z0-9]*[A-Z][A-Za-z0-9]*$/.test(value)
  );
}

function shortReadableText(value: string) {
  return value.trim().replace(/[。！？；：,.!?;:].*$/, "");
}

function getReadableUXName(value: string | undefined, fallback: string | undefined, defaultLabel: string) {
  const trimmedValue = value?.trim();
  if (trimmedValue && !isTechnicalIdentifier(trimmedValue)) {
    return { label: trimmedValue, source: "value" as const };
  }

  const trimmedFallback = fallback?.trim();
  if (trimmedFallback && !isTechnicalIdentifier(trimmedFallback)) {
    return { label: shortReadableText(trimmedFallback), source: "fallback" as const };
  }

  return { label: defaultLabel, source: "default" as const };
}

function getFlowTitle(value: string | undefined, fallback: string | undefined) {
  const trimmedValue = value?.trim();
  if (trimmedValue) {
    return { label: trimmedValue, source: "value" as const };
  }

  const trimmedFallback = fallback?.trim();
  if (trimmedFallback) {
    return { label: shortReadableText(trimmedFallback), source: "fallback" as const };
  }

  return { label: "未命名流程", source: "default" as const };
}

function UXNotesTextBlock({ notes }: { notes: string[] }) {
  return (
    <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
      <p className="text-sm font-medium text-muted-foreground">UX 说明</p>
      {notes.length > 0 ? (
        <ul className="list-disc space-y-2 pl-5">
          {notes.map((note, index) => (
            <li key={`${note}-${index}`} className="pl-1 text-sm leading-6 text-muted-foreground">
              {note}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-6 text-muted-foreground">暂无 UX 说明</p>
      )}
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

function NewUXDesignContentView({ content }: { content: Extract<UXDesignContent, { low_fidelity_screen_structure: unknown }> }) {
  const screens = content.low_fidelity_screen_structure ?? [];
  const flows = content.business_flows ?? [];
  const screenNames = screens.map((screen) => getReadableUXName(screen.screen_name, screen.screen_purpose, "未命名页面").label);
  const flowNames = flows.map((flow) => getFlowTitle(flow.flow_name, flow.flow_goal).label);

  return (
    <div className="space-y-4">
      <MetricStrip
        className="xl:grid-cols-2"
        items={[
          {
            label: "页面",
            value: screens.length,
            description: <MetricNameList names={screenNames} emptyText="暂无页面" />,
          },
          {
            label: "业务流程",
            value: flows.length,
            description: <MetricNameList names={flowNames} emptyText="暂无业务流程" />,
          },
        ]}
      />

      <VisualSection
        title={
          <FieldHint
            label="页面低保真结构"
            hint="按屏幕展示信息优先级和交互区域，便于快速判断页面承载的用户任务。"
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.workflow}
        empty={screens.length === 0 ? "暂无页面低保真结构" : false}
      >
        <div className="grid gap-3">
          {screens.map((screen, screenIndex) => {
            const screenTitle = getReadableUXName(screen.screen_name, screen.screen_purpose, "未命名页面");
            return (
              <section key={`${screen.screen_name}-${screenIndex}`} className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-start gap-2">
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <h3 className="min-w-0 whitespace-normal break-words text-sm font-semibold">{screenTitle.label}</h3>
                      <StatusBadge label={`${screen.interaction_regions?.length ?? 0} 区域`} tone="muted" />
                    </div>
                    {screenTitle.source !== "fallback" ? (
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{screen.screen_purpose || "暂无页面功能说明"}</p>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">信息优先级</p>
                  <TextChips values={Array.isArray(screen.information_priority) ? screen.information_priority : []} numbered />
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {(screen.interaction_regions ?? []).map((region, regionIndex) => {
                    const regionTitle = getReadableUXName(region.region_name, region.region_purpose, "未命名区域");
                    return (
                      <div key={`${region.region_name}-${regionIndex}`} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                        <div className="text-sm font-medium">{regionTitle.label}</div>
                        {regionTitle.source !== "fallback" ? (
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">{region.region_purpose || "暂无区域功能"}</p>
                        ) : null}
                        <div className="mt-3">
                          <TextChips values={Array.isArray(region.content_elements) ? region.content_elements : []} emptyText="暂无内容元素" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label="业务逻辑流"
            hint="用时间线呈现用户行为、系统反馈和结果分支。"
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.branch}
        empty={flows.length === 0 ? "暂无业务逻辑流" : false}
      >
        <div className="space-y-4">
          {flows.map((flow, flowIndex) => {
            const flowTitle = getFlowTitle(flow.flow_name, flow.flow_goal);
            return (
              <section key={`${flow.flow_name}-${flowIndex}`} className="space-y-4 rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
                  <div>
                    <h3 className="text-sm font-semibold">{flowTitle.label}</h3>
                    {flowTitle.source !== "fallback" ? (
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{flow.flow_goal || "暂无流程目标"}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <StatusBadge label={getReadableUXName(flow.primary_actor, undefined, "未指定用户").label} tone="default" />
                    <TextChips values={Array.isArray(flow.preconditions) ? flow.preconditions : []} emptyText="暂无前置条件" />
                  </div>
                </div>
                <FlowTimeline
                  steps={(flow.steps ?? []).map((step) => ({
                    title: step.user_action || "未描述用户行为",
                    meta: `步骤 ${step.step_order}`,
                    description: step.system_feedback || "暂无系统反馈",
                    details: (
                      <div className="space-y-3">
                        <TextChips values={Array.isArray(step.involved_elements) ? step.involved_elements : []} emptyText="暂无涉及元素" />
                        <div className="grid gap-2 md:grid-cols-2">
                          {(step.branches ?? []).map((branch, branchIndex) => (
                            <div key={`${branch.branch_status}-${branchIndex}`} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge label={statusLabel(branch.branch_status)} tone={branchTone(branch.branch_status)} />
                                <span className="text-sm text-muted-foreground">{branch.branch_description || "暂无分支说明"}</span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-muted-foreground">{branch.system_feedback || "暂无反馈"}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  }))}
                />
                <UXNotesTextBlock notes={Array.isArray(flow.ux_notes) ? flow.ux_notes : []} />
              </section>
            );
          })}
        </div>
      </VisualSection>
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
      <AssetContentSections content={content as Record<string, unknown>} sections={uxDesignLegacySections} />
    </div>
  );
}

export function UXDesignContentViewer({ content }: { content: UXDesignContent }) {
  if (isNewUXDesignContent(content)) {
    return <NewUXDesignContentView content={content} />;
  }

  return <LegacyUXDesignContentView content={content} />;
}

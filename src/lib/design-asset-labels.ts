import type { AffectedLayer, ImplementationScope } from "@/lib/types/business-story";
import type { ChangeSetStatus } from "@/lib/types/change-set";

export const implementationScopeLabels: Record<ImplementationScope, string> = {
  frontend_only: "仅前端",
  backend_only: "仅后端",
  fullstack: "前后端",
  non_code: "非代码",
};

export const affectedLayerLabels: Record<AffectedLayer, string> = {
  ux_design: "UX设计",
  ui_design: "UI设计",
  frontend_pages: "前端页面结构",
  frontend_tools: "前端依赖与工具",
  api_contract: "API 契约",
  backend_services: "后端服务设计",
  backend_tools: "后端依赖与工具",
  database_models: "数据库模型",
  project_blueprint: "项目蓝图",
  prompt_assets: "指令集合",
  documentation: "文档",
};

export const changeSetStatusLabels: Record<ChangeSetStatus, string> = {
  draft: "草稿",
  ready: "就绪",
  applied: "已应用",
  discarded: "已放弃",
  failed: "失败",
};

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "暂无时间";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

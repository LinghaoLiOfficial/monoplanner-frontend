import type { AffectedLayer, ImplementationScope } from "@/lib/types/business-story";
import type { ChangeSetStatus } from "@/lib/types/change-set";

export const implementationScopeLabels: Record<ImplementationScope, string> = {
  frontend_only: "仅前端",
  backend_only: "仅后端",
  fullstack: "前后端",
  non_code: "非代码",
};

export const affectedLayerLabels: Record<AffectedLayer, string> = {
  ux_design: "UX 用户体验设计",
  ui_design: "UI 视觉设计",
  frontend_implementation: "前端工程实现",
  frontend_tools: "前端工程实现扩展",
  api_contract: "API 契约",
  backend_implementation: "后端工程实现",
  backend_tools: "后端工程实现扩展",
  database_model: "数据库模型",
  db_model: "数据库模型",
  frontend_pages: "前端工程实现",
  backend_services: "后端工程实现",
  database_models: "数据库模型",
  project_blueprint: "历史蓝图",
  prompt_pack: "PromptPack",
  prompt_assets: "PromptPack",
  documentation: "文档",
};

export type BusinessStoryImpactScopeFilter =
  | ImplementationScope
  | "ux_design"
  | "ui_design"
  | "frontend_implementation"
  | "api_contract"
  | "backend_implementation"
  | "database_models";

export const businessStoryImpactScopeLabels: Record<BusinessStoryImpactScopeFilter, string> = {
  frontend_only: "仅前端",
  backend_only: "仅后端",
  fullstack: "前后端",
  non_code: "非代码",
  ux_design: "UX 用户体验设计",
  ui_design: "UI 视觉设计",
  frontend_implementation: "前端工程实现",
  api_contract: "API 契约",
  backend_implementation: "后端工程实现",
  database_models: "数据库模型",
};

export const businessStoryImpactScopeOptions: BusinessStoryImpactScopeFilter[] = [
  "frontend_only",
  "backend_only",
  "fullstack",
  "non_code",
  "ux_design",
  "ui_design",
  "frontend_implementation",
  "api_contract",
  "backend_implementation",
  "database_models",
];

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

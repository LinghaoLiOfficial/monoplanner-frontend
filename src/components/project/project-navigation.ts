import type { LucideIcon } from "lucide-react";
import {
  Braces,
  ClipboardCheck,
  Code2,
  Database,
  DraftingCompass,
  FileText,
  LayoutDashboard,
  ListChecks,
  Palette,
  ScrollText,
  Settings2,
} from "lucide-react";

export type ProjectNavItem = {
  label: string;
  segment: string;
  icon: LucideIcon;
};

export type ProjectNavGroup = {
  label: string;
  items: ProjectNavItem[];
};

export const projectNavGroups: ProjectNavGroup[] = [
  {
    label: "配置",
    items: [
      { label: "工作台", segment: "", icon: LayoutDashboard },
      { label: "项目配置", segment: "configuration", icon: Settings2 },
    ],
  },
  {
    label: "业务故事池",
    items: [
      { label: "原始用户需求", segment: "raw-requirements", icon: FileText },
      { label: "业务故事池", segment: "business-requirements", icon: ListChecks },
    ],
  },
  {
    label: "分层变更集",
    items: [
      { label: "变更集", segment: "change-sets", icon: ScrollText },
    ],
  },
  {
    label: "版本资产",
    items: [
      { label: "UX 用户体验设计", segment: "ux-design", icon: DraftingCompass },
      { label: "UI 视觉设计", segment: "ui-design", icon: Palette },
      { label: "前端实现版本", segment: "frontend-implementation", icon: Code2 },
      { label: "API 契约", segment: "api-contract", icon: Braces },
      { label: "后端实现版本", segment: "backend-implementation", icon: Code2 },
      { label: "数据库模型", segment: "database-model", icon: Database },
    ],
  },
  {
    label: "PromptPack",
    items: [
      { label: "PromptPack", segment: "delivery", icon: ScrollText },
      { label: "一致性检查", segment: "consistency", icon: ClipboardCheck },
    ],
  },
];

export function getProjectNavHref(projectId: string, segment: string) {
  return segment ? `/projects/${projectId}/${segment}` : `/projects/${projectId}`;
}

export function getProjectNavItems() {
  return projectNavGroups.flatMap((group) => group.items);
}

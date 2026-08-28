import type { LucideIcon } from "lucide-react";
import {
  Braces,
  ClipboardCheck,
  Code2,
  Database,
  DraftingCompass,
  FileText,
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
    label: "全局约束",
    items: [
      { label: "项目配置", segment: "configuration", icon: Settings2 },
    ],
  },
  {
    label: "需求分析",
    items: [
      { label: "原始用户需求", segment: "raw-requirements", icon: FileText },
      { label: "敏捷业务需求池", segment: "business-requirements", icon: ListChecks },
      { label: "变更集", segment: "change-sets", icon: ScrollText },
    ],
  },
  {
    label: "方案资产",
    items: [
      { label: "UX 用户体验设计", segment: "ux-design", icon: DraftingCompass },
      { label: "UI 视觉设计", segment: "ui-design", icon: Palette },
      { label: "前端工程实现", segment: "frontend-implementation", icon: Code2 },
      { label: "API 契约", segment: "api-contract", icon: Braces },
      { label: "后端工程实现", segment: "backend-implementation", icon: Code2 },
      { label: "数据库模型", segment: "database-model", icon: Database },
    ],
  },
  {
    label: "交付校验",
    items: [
      { label: "指令集合", segment: "delivery", icon: ScrollText },
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

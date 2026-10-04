import { FolderKanban, Home, Plus, type LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
};

export const siteConfig = {
  name: "Full-Stack Context Orchestrator",
  description:
    "Turn natural-language business requirements into structured development context and prompts for vibe coding tools.",
  tagline: "A context orchestration workspace for full-stack development",
  links: {
    docs: "https://nextjs.org/docs",
    ui: "https://ui.shadcn.com/docs",
    repo: "https://github.com",
  },
  marketingNav: [
    {
      label: "首页",
      href: "/",
      icon: Home,
      description: "查看产品介绍",
    },
    {
      label: "我的项目",
      href: "/projects",
      icon: FolderKanban,
      description: "查看和进入项目工作台",
    },
    {
      label: "新建项目",
      href: "/projects/new",
      icon: Plus,
      description: "创建新的上下文编排项目",
    },
  ] satisfies NavItem[],
  dashboardNav: [] as NavItem[],
};

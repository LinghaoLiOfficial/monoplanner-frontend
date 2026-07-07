import {
  Bell,
  CreditCard,
  LayoutDashboard,
  List,
  FileBarChart,
  Settings,
  Shield,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
};

export const siteConfig = {
  name: "fullstack-forge-frontend",
  description:
    "The frontend application for fullstack-forge, built with Next.js, React, TypeScript, Tailwind CSS 4, shadcn/ui, and pnpm.",
  tagline: "fullstack-forge 的前端应用，面向产品官网、控制台与业务系统场景",
  links: {
    docs: "https://nextjs.org/docs",
    ui: "https://ui.shadcn.com/docs",
    repo: "https://github.com",
  },
  marketingNav: [
    {
      label: "项目特性",
      href: "/#features",
      description: "查看项目基础能力",
    },
    {
      label: "目录结构",
      href: "/#structure",
      description: "了解项目组织方式",
    },
    {
      label: "控制台",
      href: "/dashboard",
      description: "查看项目控制台页面",
    },
  ] satisfies NavItem[],
  dashboardNav: [
    {
      label: "概览",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "统计概览与业务入口",
    },
    {
      label: "账单",
      href: "/dashboard/billing",
      icon: CreditCard,
      description: "订阅与费用管理",
    },
    {
      label: "通知",
      href: "/dashboard/notifications",
      icon: Bell,
      description: "站内消息与提醒",
    },
    {
      label: "成员",
      href: "/dashboard/users",
      icon: List,
      description: "成员管理、筛选与分页",
    },
    {
      label: "报表",
      href: "/dashboard/reports",
      icon: FileBarChart,
      description: "报表中心与空状态引导",
    },
    {
      label: "权限",
      href: "/dashboard/access",
      icon: Shield,
      description: "角色与权限控制",
    },
    {
      label: "设置",
      href: "/dashboard/settings",
      icon: Settings,
      description: "系统配置与偏好设置",
    },
  ] satisfies NavItem[],
};

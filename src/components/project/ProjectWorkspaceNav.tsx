"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "工作台", segment: "" },
  { label: "项目蓝图", segment: "blueprint" },
  { label: "原始用户需求", segment: "requirements" },
  { label: "敏捷业务需求", segment: "business-stories" },
  { label: "API 契约", segment: "api-contract" },
  { label: "数据库模型", segment: "db-model" },
  { label: "指令集合", segment: "prompts" },
  { label: "一致性检查", segment: "consistency" },
];

export function ProjectWorkspaceNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  return (
    <nav className="overflow-x-auto rounded-full border border-border/70 bg-card/80 p-1 shadow-sm">
      <div className="flex min-w-max items-center gap-1">
        {navItems.map((item) => {
          const href = item.segment ? `/projects/${projectId}/${item.segment}` : `/projects/${projectId}`;
          const active = pathname === href;

          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                "rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                active && "bg-foreground text-background hover:bg-foreground hover:text-background"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

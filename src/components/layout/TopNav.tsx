"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Braces, FolderKanban, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

export function TopNav() {
  const pathname = usePathname();
  const isProjectsActive =
    pathname === "/projects" || (pathname.startsWith("/projects/") && pathname !== "/projects/new");
  const isNewProjectActive = pathname === "/projects/new";

  return (
    <header className="sticky top-6 z-40 mb-8">
      <div className="rounded-full border border-border/70 bg-background/85 px-4 py-3 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-foreground text-background">
              <Braces className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Monoplanner</div>
              <div className="font-medium">全栈上下文编排器</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 md:flex">
            <Link
              href="/projects"
              className={cn(
                "rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isProjectsActive && "bg-muted text-foreground font-medium"
              )}
            >
              项目列表
            </Link>
            <Link
              href="/projects/new"
              className={cn(
                "rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isNewProjectActive && "bg-muted text-foreground font-medium"
              )}
            >
              新建项目
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/projects">
                <FolderKanban className="size-4" />
                项目
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/projects/new">
                <Plus className="size-4" />
                新建
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

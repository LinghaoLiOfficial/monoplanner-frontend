"use client";

import Link from "next/link";
import { Braces, FolderKanban, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UserMenu } from "@/components/user/UserMenu";
import { cn } from "@/lib/utils";

export function TopNav({ compactGap = false }: { compactGap?: boolean }) {
  return (
    <header
      className={cn(
        "z-40 shrink-0 transition-[margin,top] duration-300 ease-out motion-reduce:transition-none",
        compactGap ? "relative" : "sticky top-6 mb-8"
      )}
    >
      <div className="rounded-full border border-border/70 bg-background/85 px-4 py-3 shadow-sm backdrop-blur transition-[border-radius,box-shadow,background-color] duration-300 ease-out motion-reduce:transition-none">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-foreground text-background">
              <Braces className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Monoplanner</div>
              <div className="font-medium">全栈上下文编排器</div>
            </div>
          </Link>

          <div className="flex items-center justify-center gap-2">
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

          <div className="flex items-center justify-end gap-2">
            <UserMenu />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

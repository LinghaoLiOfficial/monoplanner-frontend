"use client";

import Link from "next/link";
import { Braces, Users } from "lucide-react";

import { RequireAdmin } from "@/components/auth/RequireAdmin";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UserMenu } from "@/components/user/UserMenu";
import { Button } from "@/components/ui/button";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <RequireAdmin>
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 md:px-10 lg:px-12">
        <header className="sticky top-6 z-40 mb-8">
          <div className="rounded-full border border-border/70 bg-background/85 px-4 py-3 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-foreground text-background">
                  <Braces className="size-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Monoplanner</div>
                  <div className="font-medium">管理员控制面板</div>
                </div>
              </Link>

              <nav className="hidden items-center gap-2 md:flex">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin/users">
                    <Users className="size-4" />
                    用户管理
                  </Link>
                </Button>
              </nav>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>
        {children}
      </main>
    </RequireAdmin>
  );
}

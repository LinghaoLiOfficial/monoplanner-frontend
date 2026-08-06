"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { TopNav } from "@/components/layout/TopNav";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [, firstSegment, secondSegment] = pathname.split("/");
  const isProjectDetail = firstSegment === "projects" && Boolean(secondSegment) && secondSegment !== "new";

  return (
    <main
      className={cn(
        "mx-auto flex min-h-screen w-full flex-col transition-[max-width,padding,gap] duration-[400ms] ease-out motion-reduce:transition-none",
        isProjectDetail
          ? "max-w-[100vw] gap-6 p-6 lg:h-screen lg:overflow-hidden"
          : "max-w-[90rem] p-6"
      )}
    >
      <TopNav compactGap={isProjectDetail} />
      {children}
    </main>
  );
}

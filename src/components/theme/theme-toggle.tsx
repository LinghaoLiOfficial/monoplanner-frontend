"use client";

import { MonitorCog, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const icon =
    resolvedTheme === undefined ? (
      <MonitorCog className="size-4" />
    ) : isDark ? (
      <Sun className="size-4" />
    ) : (
      <Moon className="size-4" />
    );

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="切换主题"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {icon}
    </Button>
  );
}

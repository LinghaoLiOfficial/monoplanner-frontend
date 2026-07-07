"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function Sonner() {
  const { resolvedTheme = "system" } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme as "light" | "dark" | "system"}
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "!rounded-2xl",
        },
      }}
    />
  );
}

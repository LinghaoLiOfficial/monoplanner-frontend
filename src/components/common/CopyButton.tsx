"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type CopyState = "idle" | "copied" | "failed";

type CopyButtonProps = {
  value: string;
  label?: string;
};

export function CopyButton({ value, label = "复制 JSON" }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }

    window.setTimeout(() => setState("idle"), 1800);
  };

  const text = state === "copied" ? "已复制" : state === "failed" ? "复制失败" : label;

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
      {text}
    </Button>
  );
}

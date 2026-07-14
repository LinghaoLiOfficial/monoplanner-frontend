import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BusinessStoryGenerateButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <Button type="button" size="sm" onClick={onClick} disabled={loading}>
      <Sparkles className="size-4" />
      {loading ? "正在生成业务需求故事..." : "生成业务需求故事"}
    </Button>
  );
}

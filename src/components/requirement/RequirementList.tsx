import { MessageSquareText } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Requirement } from "@/lib/types/requirement";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function summarize(text: string) {
  return text.length > 160 ? `${text.slice(0, 160)}...` : text;
}

export function RequirementList({ requirements }: { requirements: Requirement[] }) {
  if (requirements.length === 0) {
    return (
      <EmptyState
        icon={MessageSquareText}
        title="当前项目还没有需求"
        description="输入一段自然语言业务需求，保存后即可触发 blueprint 草案生成。"
      />
    );
  }

  return (
    <div className="space-y-3">
      {requirements.map((requirement) => (
        <Card key={requirement.id}>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{requirement.language}</Badge>
              <Badge variant="secondary">{requirement.source_type}</Badge>
              <span className="text-xs text-muted-foreground">{formatDate(requirement.created_at)}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-muted-foreground">{summarize(requirement.raw_text)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

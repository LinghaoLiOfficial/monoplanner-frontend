"use client";

import { RotateCcw, Save } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type TechStackConfigCardProps = {
  frontendStack: string;
  backendStack: string;
  saving?: boolean;
  error?: string | null;
  dirty?: boolean;
  saved?: boolean;
  configured?: boolean;
  canSave?: boolean;
  onFrontendStackChange: (value: string) => void;
  onBackendStackChange: (value: string) => void;
  onSave: () => void | Promise<void>;
  onResetToDefault?: () => void;
};

export function TechStackConfigCard({
  frontendStack,
  backendStack,
  saving = false,
  error,
  dirty = false,
  saved = false,
  configured = false,
  canSave = dirty,
  onFrontendStackChange,
  onBackendStackChange,
  onSave,
  onResetToDefault,
}: TechStackConfigCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>技术栈配置</CardTitle>
            <CardDescription>技术栈配置保存后不可修改，蓝图生成会固定使用这里配置的前端和后端技术栈</CardDescription>
          </div>
          <Badge variant={configured ? "default" : "outline"}>{configured ? "已配置" : "未配置"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="frontend-stack">前端技术栈</Label>
            <Textarea
              id="frontend-stack"
              value={frontendStack}
              onChange={(event) => onFrontendStackChange(event.target.value)}
              disabled={saving || configured}
              className="min-h-28 resize-y"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="backend-stack">后端技术栈</Label>
            <Textarea
              id="backend-stack"
              value={backendStack}
              onChange={(event) => onBackendStackChange(event.target.value)}
              disabled={saving || configured}
              className="min-h-28 resize-y"
            />
          </div>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {!configured ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={() => void onSave()} disabled={saving || !canSave}>
              <Save className="size-4" />
              {saving ? "保存中..." : "保存配置"}
            </Button>
            {onResetToDefault ? (
              <Button type="button" variant="outline" onClick={onResetToDefault} disabled={saving}>
                <RotateCcw className="size-4" />
                恢复默认
              </Button>
            ) : null}
            {!error && !dirty && saved ? (
              <p className="text-sm text-muted-foreground">配置已保存</p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

"use client";

import { FormEvent, useState } from "react";

import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateProjectPayload, Project } from "@/lib/types/project";

type ProjectFormProps = {
  onSubmit: (payload: CreateProjectPayload) => Promise<Project>;
};

export function ProjectForm({ onSubmit }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("请输入项目名称");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建项目失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>创建新项目</CardTitle>
        <CardDescription>先记录项目名称，再进入工作台补充业务需求</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="project-name">项目名称</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="请输入项目名称"
              disabled={submitting}
              required
            />
          </div>
          {error ? <ErrorState message={error} /> : null}
          <Button type="submit" disabled={submitting}>
            {submitting ? "正在创建..." : "创建项目"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

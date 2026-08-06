"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_BACKEND_STACK, DEFAULT_FRONTEND_STACK } from "@/lib/constants/project";
import { getProjectConfig, updateProjectConfig } from "@/lib/api/project-config";
import type { ProjectConfig, ProjectConfigUpdateInput } from "@/lib/types/project-config";

type ProjectConfigFormState = {
  project_name: string;
  project_description: string;
  frontend_tech_stack: string;
  backend_tech_stack: string;
};

type FieldMeta = {
  key: keyof ProjectConfigFormState;
  chineseName: string;
  englishName: string;
  meaning: string;
  fullWidth?: boolean;
};

function createFormFallback(): ProjectConfigFormState {
  return {
    project_name: "",
    project_description: "",
    frontend_tech_stack: DEFAULT_FRONTEND_STACK,
    backend_tech_stack: DEFAULT_BACKEND_STACK,
  };
}

function toFormState(data: ProjectConfig): ProjectConfigFormState {
  return {
    project_name: data.project_name || data.name,
    project_description: data.project_description ?? data.description ?? "",
    frontend_tech_stack:
      data.frontend_tech_stack?.trim() || data.target_frontend_stack?.trim() || DEFAULT_FRONTEND_STACK,
    backend_tech_stack:
      data.backend_tech_stack?.trim() || data.target_backend_stack?.trim() || DEFAULT_BACKEND_STACK,
  };
}

function fieldInputId(key: string) {
  return `project-config-${key}`;
}

function FieldBlock({
  field,
  children,
}: {
  field: FieldMeta;
  children: ReactNode;
}) {
  return (
    <div className={field.fullWidth ? "space-y-2 md:col-span-2" : "space-y-2"}>
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Label htmlFor={fieldInputId(field.key)} className="text-sm font-medium">
            {field.chineseName}
          </Label>
          <span className="rounded-full border border-border/60 bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            {field.englishName}
          </span>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">{field.meaning}</p>
      </div>
      {children}
    </div>
  );
}

const coreFields: FieldMeta[] = [
  {
    key: "project_name",
    chineseName: "项目名称",
    englishName: "project_name",
    meaning: "项目的显示名称和主要识别信息。",
  },
  {
    key: "project_description",
    chineseName: "项目描述",
    englishName: "project_description",
    meaning: "对项目目标、背景和范围的简要说明。",
    fullWidth: true,
  },
  {
    key: "frontend_tech_stack",
    chineseName: "前端技术栈",
    englishName: "frontend_tech_stack",
    meaning: "项目前端使用的框架、语言、样式方案、UI 组件库和包管理工具。",
  },
  {
    key: "backend_tech_stack",
    chineseName: "后端技术栈",
    englishName: "backend_tech_stack",
    meaning: "项目后端使用的语言、框架、数据库、ORM、迁移工具和运行方式。",
  },
];

export default function ProjectConfigPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [form, setForm] = useState<ProjectConfigFormState>(() => createFormFallback());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);
    setForm(createFormFallback());
    try {
      const data = await getProjectConfig(projectId);
      setForm(toFormState(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载项目配置失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const projectName = form.project_name.trim();
    if (!projectName) {
      setSaveError("请输入项目名称");
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const input: ProjectConfigUpdateInput = {
        project_name: projectName,
        project_description: form.project_description.trim() || null,
        frontend_tech_stack: form.frontend_tech_stack.trim() || DEFAULT_FRONTEND_STACK,
        backend_tech_stack: form.backend_tech_stack.trim() || DEFAULT_BACKEND_STACK,
      };
      const updated = await updateProjectConfig(projectId, input);
      setForm(toFormState(updated));
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "保存项目配置失败");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">项目配置</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              单个项目的基础信息、技术栈和全局生成约束。
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href={`/projects/${projectId}`}>返回工作台</Link>
        </Button>
      </div>

      {loading ? <LoadingState label="正在加载项目配置..." /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={loadConfig} /> : null}
      {!loading && !error ? (
        <Card>
          <CardHeader>
            <CardTitle>配置表单</CardTitle>
            <CardDescription>用于录入或修改项目配置的表单结构。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {saveError ? <ErrorState title="保存失败" message={saveError} /> : null}
            {saved ? (
              <Alert>
                <AlertDescription>项目配置已保存。</AlertDescription>
              </Alert>
            ) : null}

            <section className="space-y-4">
              <div className="grid gap-5 md:grid-cols-2">
                {coreFields.map((field) => {
                  const commonProps = {
                    id: fieldInputId(field.key),
                    disabled: saving,
                  };

                  if (field.key === "project_name") {
                    return (
                      <FieldBlock key={field.key} field={field}>
                        <Input
                          {...commonProps}
                          value={form.project_name}
                          onChange={(event) =>
                            setForm((current) => ({ ...current, project_name: event.target.value }))
                          }
                          placeholder="请输入项目名称"
                        />
                      </FieldBlock>
                    );
                  }

                  if (field.key === "project_description") {
                    return (
                      <FieldBlock key={field.key} field={field}>
                        <Textarea
                          {...commonProps}
                          className="min-h-28"
                          value={form.project_description}
                          onChange={(event) =>
                            setForm((current) => ({ ...current, project_description: event.target.value }))
                          }
                          placeholder="请输入项目描述"
                        />
                      </FieldBlock>
                    );
                  }

                  if (field.key === "frontend_tech_stack") {
                    return (
                      <FieldBlock key={field.key} field={field}>
                        <Textarea
                          {...commonProps}
                          className="min-h-28"
                          value={form.frontend_tech_stack}
                          onChange={(event) =>
                            setForm((current) => ({ ...current, frontend_tech_stack: event.target.value }))
                          }
                          placeholder="例如：Next.js + React + TypeScript"
                        />
                      </FieldBlock>
                    );
                  }

                  return (
                    <FieldBlock key={field.key} field={field}>
                      <Textarea
                        {...commonProps}
                        className="min-h-28"
                        value={form.backend_tech_stack}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, backend_tech_stack: event.target.value }))
                        }
                        placeholder="例如：FastAPI + SQLAlchemy + PostgreSQL"
                      />
                    </FieldBlock>
                  );
                })}
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={() => void handleSave()} disabled={saving}>
                {saving ? "保存中..." : "保存配置"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

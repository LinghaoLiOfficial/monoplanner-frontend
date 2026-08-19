"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { TechStackConfigCard } from "@/components/blueprint/TechStackConfigCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getProjectConfig, updateProjectConfig } from "@/lib/api/project-config";
import type { ProjectConfig } from "@/lib/types/project-config";
import type { TechStackItem } from "@/lib/types/tech-stack";

export default function ProjectConfigPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [config, setConfig] = useState<ProjectConfig | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [frontendStack, setFrontendStack] = useState<TechStackItem[]>([]);
  const [backendStack, setBackendStack] = useState<TechStackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    setSaveError(null);
    try {
      const data = await getProjectConfig(projectId);
      setConfig(data);
      setProjectName(data.project_name || data.name);
      setProjectDescription(data.project_description ?? data.description ?? "");
      setFrontendStack(data.target_frontend_stack_items);
      setBackendStack(data.target_backend_stack_items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载项目配置失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    const normalizedName = projectName.trim();
    if (!normalizedName) {
      setSaveError("请输入项目名称");
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateProjectConfig(projectId, {
        project_name: normalizedName,
        project_description: projectDescription.trim() || null,
        target_frontend_stack_items: frontendStack,
        target_backend_stack_items: backendStack,
      });
      setConfig(updated);
      setProjectName(updated.project_name || updated.name);
      setProjectDescription(updated.project_description ?? updated.description ?? "");
      setFrontendStack(updated.target_frontend_stack_items);
      setBackendStack(updated.target_backend_stack_items);
      toast.success("项目配置已保存");
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

  if (loading) {
    return <LoadingState label="正在加载项目配置..." />;
  }

  if (error || !config) {
    return <ErrorState title="项目配置不可用" message={error || "配置不存在"} actionLabel="重新加载" onAction={loadConfig} />;
  }

  return (
    <div className="space-y-6 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:gap-6 lg:space-y-0">
      <Card className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="size-5 text-muted-foreground" aria-hidden="true" />
            配置表单
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-4">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-config-name">项目名称</Label>
              <Input
                id="project-config-name"
                value={projectName}
                disabled={saving}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="请输入项目名称"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="project-config-description">项目描述</Label>
              <Textarea
                id="project-config-description"
                className="min-h-28"
                value={projectDescription}
                disabled={saving}
                onChange={(event) => setProjectDescription(event.target.value)}
                placeholder="请输入项目描述"
              />
            </div>
          </div>

          <TechStackConfigCard
            frontendStack={frontendStack}
            backendStack={backendStack}
            saving={saving}
            error={saveError}
            onFrontendStackChange={setFrontendStack}
            onBackendStackChange={setBackendStack}
            onSave={handleSaveConfig}
          />
        </CardContent>
      </Card>
    </div>
  );
}
